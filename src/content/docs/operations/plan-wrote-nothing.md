---
title: Plan wrote nothing
description: Recover when the morning plan put no study blocks on your calendar, or the planner sent an alert email.
---

## When to use

- No study blocks are on the **Study Blocks** calendar this morning.
- You got an alert email about "Course Hub — 2 · Plan study blocks".
- A plan request returned `calendar_unreadable` (`503`) or `setup_needed` (`409`).

## Check

1. **Did the planner run, and which node failed?**

   ```bash
   ~/.n8n-server/bin/n8n-exec.py chPlanner0000001
   ```

   This shows each node's status in the newest run. Data Tables are stored as `data_table_user_<id>`, so find a table's id first if you want to query it directly: `bin/n8n-sql "select id from data_table where name='ch_plans'"`.
2. **Is the morning plan turned on?** `morning_plan_enabled` must be `"true"`.
3. **Can it read the calendars?** Preview today's plan:

   ```bash
   curl -s -X POST localhost:5678/webhook/hub/api/plan -H 'Content-Type: application/json' -d '{"scope":"day","dry_run":true}' | head -c 300
   ```

## Fix

| Result | Cause | Fix |
|---|---|---|
| No run today, and the Mac was asleep | The 6:00 AM schedule was missed | Wake the Mac. The watchdog catches up between 6:05 AM and noon, or you can plan from the web app. |
| `calendar_unreadable` | A Google credential expired or was removed | In the n8n editor (`localhost:5678`), reconnect the Google Calendar credential, then plan again. Google nodes continue on error, so a broken credential looks like an empty calendar unless the planner stops it. |
| `setup_needed` | `study_calendar_id` is empty | `CH_SETUP=1 ./deploy.sh`, then `POST /webhook/hub/api/setup` |
| `ok`, but the run failed afterwards | Some calendar or MongoDB writes failed | Check the alert email for the node that failed. Fix the credential or MongoDB, then plan again. The new plan replaces its own earlier blocks. |

## Verify

The preview returns `status: "ok"` with blocks. After a real plan, the blocks appear on your phone's calendar.

## Roll back

Plans replace only their own earlier blocks in the same window. To remove a plan, delete its events from **Study Blocks** in Google Calendar. No other calendar is touched.

## Escalate

Run `checkup.sh` and look for failed runs and credential errors. See [Runbook index: escalation](/course-hub-docs/operations/#escalation).

## Next steps

- [Preview a plan without writing](/course-hub-docs/how-to/preview-a-plan/)
