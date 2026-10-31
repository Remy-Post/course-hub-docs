---
title: Re-scan course files
description: Re-read course documents after a file changes, after a rules change, or for one course only.
---

Course Hub scans course files every night at 3:30 AM, and within a few seconds whenever a course file changes. Use this guide when you need a scan now, or a special kind of scan.

## Before you start

- You're on the Mac. The `ingest` endpoint is **not** routed through the public tunnel, so the web app's **Re-scan** buttons don't work. See [Known issues](/course-hub-docs/project/known-issues/).
- Check memory with `n8nctl status`. A full scan loads a model of about 10–15 GB. If memory is tight, the scan waits. See [AI scan is waiting](/course-hub-docs/operations/ai-waiting-for-memory/).

## Pick the right scan

| You want to… | Body | Uses AI? |
|---|---|---|
| Read only files that changed | `{}` | Yes, for changed files only |
| Re-read every file | `{"force":true}` | Yes, for every file |
| Re-read one course | `{"course":"COMP-1234"}` | Yes, for that course |
| Re-apply merge rules after a `build.py` merge change | `{"remerge":true}` | No. Takes seconds. |
| Re-check stored readings against new validation rules | `{"revalidate":true}` | No. Add `"course"` to limit it. |

## Run it

Choose the body from the table. Examples:

```bash
# re-apply merge rules (no AI)
curl -s -X POST localhost:5678/webhook/hub/api/ingest \
  -H 'Content-Type: application/json' -d '{"remerge":true}'

# re-check stored readings for one course after a validation change (no AI)
curl -s -X POST localhost:5678/webhook/hub/api/ingest \
  -H 'Content-Type: application/json' -d '{"revalidate":true,"course":"COMP-1234"}'

# re-read one course's files with the AI
curl -s -X POST localhost:5678/webhook/hub/api/ingest \
  -H 'Content-Type: application/json' -d '{"course":"COMP-1234"}'
```

The request returns at once, and the scan continues in the background. Only one scan runs at a time: a scan holds the `ingest` lock in `ch_locks`, and the lock is treated as stale after 45 minutes.

## Verify

1. Check the last run of the ingest workflow:

   ```bash
   ~/.n8n-server/bin/n8n-exec.py chIngest00000001
   ```

   Every node shows success.
2. The `Summary` node reports `files`, `courses`, `assessments`, `needs_review` and `errors`. `errors` should be `0`.

:::note
If a MongoDB write fails, the run fails on purpose at the end so the alert email goes out, even though the Data Tables were written. Fix MongoDB, then run `{"remerge":true}` to sync the mirror again.
:::

## Next steps

- [Ingest and source precedence](/course-hub-docs/explanation/ingest/)
- [Confirm or fix a fact](/course-hub-docs/how-to/fix-a-fact/)
