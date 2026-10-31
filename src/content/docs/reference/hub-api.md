---
title: Hub API
description: Every Course Hub HTTP endpoint, with request fields, responses, status codes and side effects.
---

The Hub API is a set of n8n webhooks under `/webhook/hub/api/`. One workflow, `chSite0000000001`, answers the site and data endpoints. `plan`, `decision` and `ingest` start their own workflows.

Source: `build_site()` and the `JS_*` request handlers in `~/.n8n-server/seed/course-hub/build.py`.

## Base URLs

| Caller | Base URL | Auth |
|---|---|---|
| Scripts on the Mac | `http://localhost:5678/webhook/hub/api` | None. Listens on `127.0.0.1` only. |
| Local site | `http://localhost:8080/hub/api` | None. Caddy rewrites it to `/webhook/hub/api`. |
| Web app server | `https://<api-host>/webhook/hub/api` | Cloudflare Access service token in `CF-Access-Client-Id` and `CF-Access-Client-Secret` headers |

Through `<api-host>`, only `overview`, `courses`, `settings`, `plan`, `decision`, `checkin`, `override` and `checkup` are reachable. Everything else returns `404` at the tunnel.

## Conventions

- Request and response bodies are JSON. Every response carries `Cache-Control: no-store`.
- Settings values are **strings**, including `"true"`, `"false"` and numbers.
- Times are local to `America/Toronto`. `start` uses `YYYY-MM-DDTHH:MM`.
- GET endpoints are read-only. `settings` and `override` POSTs are safe to repeat. `plan` with `dry_run: true` writes nothing.

## Endpoint summary

| Method | Path | Purpose | Writes |
|---|---|---|---|
| GET | `/webhook/hub` | Local site HTML | — |
| GET | `overview` | Today at a glance | — |
| GET | `courses` | Every course with its people, meetings, assessments and topics | — |
| GET | `settings` | All settings rows | — |
| POST | `settings` | Change settings | `ch_settings` |
| POST | `override` | Confirm or correct a fact | `ch_overrides`, `ch_assessments` |
| POST | `checkin` | Save an evening check-in | `ch_checkins`, MongoDB |
| GET | `checkup` | Last health report | — |
| POST | `checkup` | Ask for a fresh health report | A request file |
| POST | `ingest` | Scan course files | 9 tables, MongoDB, Google Tasks |
| POST | `plan` | Build a plan, or preview one | Google Calendar, tables, MongoDB, SMS |
| POST | `decision` | Answer a conflict question | Google Calendar, tables, SMS |

---

## GET overview

Today at a glance. The web app's home, Plan, Wrap-up and Facts screens use it.

**Response `200`**

| Field | Type | Contents |
|---|---|---|
| `now` | string (ISO) | Server time |
| `blocks` | array | Today's scheduled blocks from `ch_plan_blocks` |
| `soon` | array | Open assessments due in the next 14 days |
| `tba` | array | Open, weighted assessments with no due date |
| `review` | array | Assessments flagged `needs_review` |
| `pending` | array | Open conflict questions from `ch_decisions` |
| `courses` | array | Each course's code, title and review flag |
| `settings` | object | `sms_enabled`, `study_calendar` (bool), `tasks_list` (bool), `wake`, `sleep` |

## GET courses

**Response `200`:** `{"courses": [...]}`. Each course has its profile fields plus `contacts`, `meetings`, `assessments` (sorted by due date, excluding `removed`) and `topics` (sorted by week). Field lists are in [Data model](/course-hub-docs/reference/data-model/).

## GET settings

**Response `200`:** `{"settings": [{"key": "...", "value": "...", "note": "..."}]}`, one entry per row in `ch_settings`.

:::caution
This endpoint returns **every** setting, including phone numbers and calendar ids. The web app filters it down to the editable keys on the server before rendering.
:::

## POST settings

Change one or more settings. Unknown keys are ignored.

**Body:** any subset of the 15 writable keys. Rules are in the [Settings reference](/course-hub-docs/reference/settings/).

```json
{ "wake": "07:30", "study_default": "90" }
```

**Responses**

| Status | Body | When |
|---|---|---|
| `200` | `{"ok": true, "saved": ["wake", "study_default"]}` | At least one key was valid |
| `400` | `{"ok": false, "error": "invalid value", "fields": ["study_default"]}` | No key was valid |

:::caution
In a call with both valid and invalid keys, the valid keys are saved and the invalid ones are **silently dropped**, with a `200`. Send one key per call if you need to know each result, as the web app does.
:::

## POST override

Record a rank-0 fact that outranks every document.

**Body**

| Field | Required | Values |
|---|---|---|
| `entity` | yes | `"assessment"` |
| `entity_key` | yes | The `assessment_id` |
| `field` | yes | `due_at`, `weight`, `date_status` or `title` |
| `value` | yes | `due_at`: an ISO date-time. `weight`: 0–100. `date_status`: `confirmed`, `tentative`, `ambiguous`, `tba` or `announced_later`. `title`: 1–119 characters. |
| `course_code` | no | For example `COMP-1234` |
| `source` | no | Defaults to `"manual"`. The web app sends `"hub web"`. |

**Responses**

| Status | Body |
|---|---|
| `200` | `{"ok": true, "override": {...}}` |
| `400` | `{"ok": false, "error": "entity must be assessment; field one of due_at, weight, date_status, title"}` |

**Side effects:** inserts a `ch_overrides` row and patches the `ch_assessments` row at once. It clears `needs_review` and sets `review_note` to "confirmed by &lt;source&gt;". A `due_at` override also sets `date_status: "confirmed"` and `all_day: false`.

## POST checkin

**Body:** all fields optional, clamped on the server.

| Field | Range |
|---|---|
| `date` | `YYYY-MM-DD`, defaults to today |
| `blocks_done`, `blocks_planned` | 0–40 |
| `focus` | 1–5 |
| `derailers`, `experiment`, `notes` | Text, capped at 200–500 characters |

**Response `200`:** `{"ok": true, "checkin": {...}}`. It writes `ch_checkins` and mirrors the row to MongoDB.

## GET checkup

**Response `200`:** the last report from `bin/checkup.sh` (`~/.n8n-files/course-hub/checkup.json`), or `{"summary": null, "checks": []}` if none exists yet.

## POST checkup

**Response `200`:** `{"requested": true, "at": "<ISO>"}`, returned at once. The watchdog writes a fresh report within 5 minutes. With the optional `com.remy.checkup` helper installed, it takes about 5 seconds.

## POST ingest

Scan course files. It returns as soon as the scan starts, and the scan continues in the background. **Mac only:** not reachable through `<api-host>`.

**Body:** all optional. `{}` scans changed files.

| Field | Effect |
|---|---|
| `force: true` | Re-read every matched file, changed or not |
| `course: "COMP-1234"` | Re-read only this course |
| `remerge: true` | Re-apply merge rules to cached readings. No file reads and no model. |
| `revalidate: true` | Re-check stored readings against the current validation rules. No model. Combine with `course` to limit it. |

**Side effects:** writes `ch_courses`, `ch_contacts`, `ch_assessments`, `ch_topics`, `ch_doc_facts` and `ch_ingest_registry`, mirrors them to MongoDB, then runs the Coursework tasks sync. If any MongoDB write fails, the run ends in an error on purpose so the alert email is sent.

## POST plan

Build a plan, or preview one.

**Body**

| Field | Default | Values |
|---|---|---|
| `scope` | `"day"` | `1h`, `3h`, `5h`, `day`, `week` |
| `start` | now | `YYYY-MM-DDTHH:MM`. A future date plans that whole day from wake time. |
| `dry_run` | `false` | `true` writes nothing at all |
| `decision` | — | `around`, `push` or `ignore`, for a known conflict |
| `quiz` | `{}` | `energy`, `focus`, `stress`, `sleep_quality` (1–5), `sleep_hours`, `meds`, `style` (`deep` or `sprint`), `urgent_courses` (array), `confidence` (assessment id → 1–5), `location`, `experiment`, `notes` |

**Responses**

| Status | `status` | Body and meaning |
|---|---|---|
| `200` | `ok` | `plan_id`, `scope`, `window`, `notes`, `stats`, `fixed`, `blocks`. The plan was written, or previewed when `dry_run` is true. |
| `200` | `conflict` | `code`, `conflicts`, `choices: ["around","push","ignore"]`. A 1h, 3h or 5h session overlaps a fixed event and no `decision` was given. If SMS is on, a text is sent. |
| `200` | `empty` | Nothing left to plan in the window |
| `409` | `setup_needed` | `study_calendar_id` is empty. Run the setup workflow. |
| `503` | `calendar_unreadable` | A Google Calendar read failed. Nothing is written, and the run fails on purpose so the alert email is sent. |

**Side effects (not a dry run):** creates events on the **Study Blocks** calendar only, and replaces this plan's own earlier blocks in the same window. Writes `ch_plans`, `ch_plan_blocks` and `ch_quiz`, and mirrors to MongoDB. If any calendar or MongoDB write fails, the site still gets an answer, and the run then fails on purpose so the alert email is sent.

**Timeout:** the web app allows 3 minutes, because the local AI writes the step lists.

## POST decision

Answer an open conflict question.

**Body**

| Field | Values |
|---|---|
| `code` | The question's code, for example `K7`. If omitted, the newest open question is used. |
| `choice` | `around`, `push` or `ignore` |
| `text` | A free-text reply, used when `choice` is absent. A regex reads it first; if that fails, the local model `llama3.2` does. |

**Response `200`:** `{ok, choice, code, message, plan_status, blocks, to, from, source}`. `ok: false` means no open question matched or the reply couldn't be read.

:::caution
The response includes `to` and `from` phone numbers. The web app's schema drops them, and `test/schemas.test.ts` guards that. Never send this response to a browser directly.
:::

**Side effects:** re-runs the planner with the choice, closes the `ch_decisions` row, and texts a confirmation only if the reply came by SMS and `sms_enabled` is `"true"`. Questions nobody answers expire every 5 minutes to `decision_default`.

## Setup and test endpoints

These are published only on request and are never reachable through the tunnel.

| Path | Published by | Purpose |
|---|---|---|
| `POST setup` | `CH_SETUP=1 ./deploy.sh` | Create tables, seed settings, create the Study Blocks calendar and Coursework list. Safe to repeat. |
| `POST setup/classes` | `CH_SETUP=1` | Add missing weekly class series to the school calendar |
| `POST setup/migrate-2` | `CH_SETUP=1` | Add the `model` column to the cache tables |
| `POST test/task` | `CH_TEST=1 ./deploy.sh` | `{"assessment_id","status":"completed"\|"needsAction"}` flips a Coursework task, to test the cleanup workflow |

## Next steps

- [Workflows](/course-hub-docs/reference/workflows/)
- [Update the API contract](/course-hub-docs/how-to/update-the-api-contract/)
