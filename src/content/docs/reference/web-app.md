---
title: Web app
description: Routes, Server Actions, the hub-api layer, UI primitives and keyboard shortcuts of the Next.js web app.
---

The web app is a Next.js 16.4 App Router project in `Remy-Post/n8n-hub`. All data comes from the [Hub API](/course-hub-docs/reference/hub-api/) on the server. The browser never calls n8n.

## Routes

| Route | Shows | Reads | Writes (Server Actions) |
|---|---|---|---|
| `/` | Today: Now / Next, the at-a-glance tiles, any pending conflict question, and the five flows | `getOverview()` | `decide` |
| `/plan` | 6-step plan flow | `getOverview()` | `buildPlan`, `decide` |
| `/wrap-up` | 3-step evening check-in | `getOverview()` | `saveCheckin` |
| `/facts` | One unconfirmed fact per step, with its source quote | `getOverview()`, `getCourses()` | `saveOverride`, `rescan` |
| `/courses` | Every course, with its next deadline and total weight | `getCourses()`, `getOverview()` | — |
| `/courses/[code]` | One course: deadlines by month (filter with `?type=`), people, details, weekly topics | `getCourses()` | `rescan` |
| `/settings` | Basic and advanced settings that save as you go | `getSettings()` | `saveSetting` |
| `/api/health` | `{"ok":true}`, static, with no call to the Mac | — | — |
| `/robots.txt` | `Disallow: /` | — | — |

Multi-step flows keep the current step in the URL as `?step=1` to `?step=N`, so the browser's Back button walks back through the flow. Draft answers are saved in `sessionStorage`. The last submitted plan answers are saved in `localStorage` as `hub.plan.last`, which powers "Same answers as last time".

### Plan flow steps

| Step | Asks |
|---|---|
| 1. Amount | `1 hour`, `3 hours`, `5 hours`, `Full day` or `Week`; now or a picked time (5-minute steps) |
| 2. How you're doing | Sleep hours (0–14), and sleep quality, energy, focus and stress (1–5); optional meds |
| 3. Priorities | Urgent courses, and your confidence (1–5) for each assessment worth 5% or more due within 14 days (up to 6) |
| 4. Style | Deep or Sprint, an optional experiment, and notes (up to 500 characters) |
| 5. Preview | Dry-run result |
| 6. Result | Committed plan, or the conflict choices |

## Server Actions

Every write goes through `runWrite()` in `src/lib/actions.ts`, which rate-limits writes and turns errors into plain messages.

| Action | File | Input checks (zod) | Calls |
|---|---|---|---|
| `buildPlan` | `features/plan/actions.ts` | `scope` enum, `start` `YYYY-MM-DDTHH:MM`, scales 1–5, notes ≤ 500 | `POST plan` |
| `decide` | `features/plan/actions.ts` | `code` 1–40 characters, `choice` enum | `POST decision` |
| `saveCheckin` | `features/wrap-up/actions.ts` | blocks 0–30, focus 1–5 | `POST checkin` |
| `saveOverride` | `features/facts/actions.ts` | course code `^[A-Z]{3,5}-\d{4}$`; `due_at`, `weight` 0–100 or `date_status` | `POST override` |
| `rescan` | `features/facts/actions.ts` | Optional course code | `POST ingest` (not routed; see [Known issues](/course-hub-docs/project/known-issues/)) |
| `saveSetting` | `features/settings/actions.ts` | Only keys in `EDITABLE_KEYS`, typed by the field definition | `POST settings` |

| Error | Message the user sees |
|---|---|
| More than 30 writes in a minute from one IP | "Too many changes in a minute. Try again shortly." |
| Mac offline (`502`, `503`, `504`, `530`, or a network failure) | "Your Mac is asleep or offline, so nothing was changed." |
| Timeout | "Your Mac is still working on this. Check Home again in a few minutes." |
| Anything else | "Something went wrong. Nothing was changed." |

## The hub-api layer

`src/lib/hub-api/` is server-only. Each file starts with `import "server-only"`, so importing it from client code fails the build.

| File | Role |
|---|---|
| `client.ts` | `hubRequest()`: builds the URL from `HUB_API_URL`, adds the Access headers when both are set, sends `cache: "no-store"`, and enforces a timeout of 10 s (3 min for `plan` and `decision`). No retries. Sorts each failure into `offline`, `timeout`, `upstream`, `invalid` or `config`. |
| `queries.ts` | `getOverview`, `getCourses`, `getSettings`. Keeps the **last good** answer in process memory. When the Mac is offline, it returns that answer with `stale: true`, which shows "Your Mac is asleep. Showing data from HH:MM; changes are paused." The cache is lost when the container restarts. |
| `mutations.ts` | One function per POST endpoint |
| `schemas.ts` | zod schemas for every response. They keep only the fields the UI uses: no phone fields, no meetings, no school name, no task bookkeeping. |

## Components

| Component | Purpose |
|---|---|
| `FlowShell` | One step's frame: a progress bar, the title, and a sticky Back/Continue footer. Steps animate with React's `<ViewTransition>`, and the animation is off under `prefers-reduced-motion`. |
| `Timeline` | Blocks grouped by day, with color, course, a "fixed" or "not on calendar" pill, and a steps toggle |
| `DataStatus` | `StaleLine` (showing saved data) and `Unavailable` (no data yet) |
| `ShortcutsHelp` | The `?` dialog |
| `ui/Button`, `ChoiceGroup`, `Scale`, `ChipGroup`, `Stepper`, `Pill`, `Notice` | Primitives built on native inputs (visually hidden radios and checkboxes), so keyboard and screen-reader behavior is native |

## Keyboard shortcuts

| Key | Where | Action |
|---|---|---|
| `1`–`5` | Home | Open Plan, Wrap-up, Facts, Courses or Settings |
| `Enter` | In a flow | Continue. Ignored in text areas and on buttons. |
| `Esc` | In a flow | Back |
| `g` then `h` | Anywhere | Go home |
| `?` | Anywhere | Show shortcuts |

Shortcuts are ignored while you type in a field, or while a modifier key is held.

## Dates

All dates are shown in `America/Toronto` through `src/lib/format.ts`, whatever the input's offset. Tests cover the Nov 1, 2026 daylight-saving change.

## Next steps

- [Run the web app locally](/course-hub-docs/tutorials/run-the-web-app-locally/)
- [Security model](/course-hub-docs/explanation/security-model/)
