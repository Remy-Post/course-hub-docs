---
title: Preview a plan without writing
description: Run the planner as a dry run to see exactly what it would book, with no calendar, table or SMS writes.
---

Use a dry run to test a planner change or to check tomorrow's plan before 6:00 AM. A dry run plans normally but writes nothing: no calendar events, no table rows, no MongoDB documents and no SMS.

## From the web app

The Plan flow's **Preview** step is always a dry run. Stop before **Put it on my calendar**.

## From the command line

On the Mac, send a plan request with `"dry_run": true`.

**Tomorrow, as the 6:00 AM run would plan it:**

```bash
curl -s -X POST localhost:5678/webhook/hub/api/plan \
  -H 'Content-Type: application/json' \
  -d '{"scope":"day","start":"2026-11-01T06:00","dry_run":true}'
```

**A 3-hour session starting now, with a quiz answer:**

```bash
curl -s -X POST localhost:5678/webhook/hub/api/plan \
  -H 'Content-Type: application/json' \
  -d '{"scope":"3h","dry_run":true,"quiz":{"energy":2,"style":"deep"}}'
```

A future `start` plans that whole day from your wake time.

## Verify

The response has `"dry_run": true` and a `status`:

| `status` | Meaning |
|---|---|
| `ok` | `blocks` holds the plan, and `stats` totals study minutes |
| `conflict` | The session overlaps a fixed event. Add `"decision":"around"`, `"push"` or `"ignore"` to see each outcome. |
| `setup_needed` | The Study Blocks calendar id is missing. Run the setup workflow. |
| `calendar_unreadable` | A Google Calendar read failed. See [Plan wrote nothing](/course-hub-docs/operations/plan-wrote-nothing/). |

## Next steps

- [How the planner works](/course-hub-docs/explanation/planner/)
- [`POST plan` reference](/course-hub-docs/reference/hub-api/#post-plan)
