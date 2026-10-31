---
title: Workflows
description: Every Course Hub n8n workflow, with its ID, triggers, schedule and failure behaviour.
---

`seed/course-hub/build.py` generates every workflow, and `deploy.sh` imports it. Workflow IDs are fixed, so other workflows and scripts can call them by ID.

## Core workflows (always published)

| ID | Name | Triggers | What it does |
|---|---|---|---|
| `chSite0000000001` | 0 · Website + API | Webhooks | Serves the local site and the `overview`, `courses`, `settings`, `override`, `checkin` and `checkup` endpoints. Successful runs are not saved, because page loads would flood the history. |
| `chIngest00000001` | 1 · Ingest course facts | 3:30 AM daily · a course file changes (polling, about 3 s) · `POST ingest` · manual | Reads course documents with local AI, validates every weight and date against a quote, merges by source rank, and writes the tables and MongoDB. Then runs the tasks sync. |
| `chPlanner0000001` | 2 · Plan study blocks | 6:00 AM daily · `POST plan` · called by Decision · manual | Builds the plan with `planner-core.js`, adds AI step lists, and writes Study Blocks events. |
| `chDecision000001` | 3 · Conflict decision | `POST decision` · called by the SMS workflows · every 5 min | Resolves a conflict question, re-runs the planner, and expires unanswered questions to `decision_default`. |
| `chTasksSync00001` | 4 · Coursework tasks sync | After every ingest · manual | Keeps one Google Task per open, weighted assessment in the Coursework list. |
| `chTaskDone000001` | 5 · Task checked off → clean up | Every 5 min | Polls Google Tasks for changes and marks the assessment `done`, `dismissed` or `open`. Deletes that assessment's future study blocks. |

## SMS workflows

| ID | Name | State | What it does |
|---|---|---|---|
| `chSmsInbound0001` | 3a · SMS reply in | Published when a tunnel exists | Twilio Trigger on `<hooks-host>`. Only texts from the `sms_to` number are passed on. |
| `chSmsPoll0000001` | 3b · SMS reply poll | Inactive by design | Fallback for when the tunnel is down. Polls Twilio once a minute, only while a question is open. |

SMS Hub (`seed/sms-hub/`) is a separate project on the same n8n instance. Its router `smsRouter0000001` receives every inbound text.

## One-time and test workflows

| ID | Name | Published by |
|---|---|---|
| `chSetup000000001` | [setup] tables, seeds, calendar, task list | `CH_SETUP=1 ./deploy.sh` |
| `chClassSeries001` | [setup] Add missing class series | `CH_SETUP=1` |
| `chMigrate0000002` | [setup] migration 2 (model column) | `CH_SETUP=1` |
| `chTestHarness001` | [test] flip a Coursework task | `CH_TEST=1 ./deploy.sh` |

## Workflows outside Course Hub that it depends on

| ID | Name | Why it matters |
|---|---|---|
| `gmailOrgAlert001` | Gmail AI Organizer — failure alert | The **error workflow** for every Course Hub workflow. It must stay **published**: n8n 2.x silently ignores an unpublished error workflow. |
| `morningDigest001` | Morning Digest (7 AM) | Emails today's plan, coursework due in 7 days and facts to check. |

## Failure behaviour

Course Hub prefers a loud failure to a silent success:

- **Unreadable calendar:** the planner refuses to write, returns `503`, and fails so the alert email goes out.
- **No block reached the calendar:** the run fails on purpose.
- **A MongoDB write failed:** the Data Tables are still written, and the run fails at the end.
- **A Google Tasks read failed:** the task watcher doesn't advance its "since" clock, so no check-off is missed.
- **A failed document read** never replaces that document's last good result. A course is never emptied.

## Next steps

- [Hub API](/course-hub-docs/reference/hub-api/)
- [Deploy backend workflows](/course-hub-docs/how-to/deploy-backend-workflows/)
