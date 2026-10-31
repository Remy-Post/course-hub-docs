---
title: AI scan is waiting
description: What to do when an ingest scan is deferred because there isn't enough free memory for a local model.
---

## When to use

- You changed a course file, but its facts haven't updated.
- `checkup.sh` reports a scan waiting for memory.

## Why it happens

A scan needs about 10–15 GB for its model, and must keep total memory use at or below `ai_memory_cap_pct` (80%). If no model fits, the run records itself in `ch_sync_state.ingest_deferred`. The watchdog retries at most every 30 minutes, outside 6:00–7:30 AM.

## Check

```bash
cat ~/.n8n-files/course-hub/sysmem.json
```

Look at the used and total memory. Also check that the file is fresh: the scan treats a probe older than 5 minutes as missing.

## Fix

1. **Free memory.** Quit large apps. If another Ollama model is loaded, it unloads after 10 minutes, or you can stop it now:

   ```bash
   ollama ps
   ollama stop <model>
   ```

2. **Wait for the watchdog**, or start the scan yourself once memory is free:

   ```bash
   curl -s -X POST localhost:5678/webhook/hub/api/ingest -H 'Content-Type: application/json' -d '{}'
   ```

3. **If the probe is stale**, the `com.remy.sysmem` agent has stopped:

   ```bash
   launchctl kickstart -k gui/$(id -u)/com.remy.sysmem
   ```

## Verify

`checkup.sh` no longer reports a waiting scan, and the ingest workflow's last run succeeded (`bin/n8n-exec.py chIngest00000001`).

## Roll back

Nothing to roll back.

## Escalate

Right after a deploy, the 10-minute memory peak stays high, and scans wait for about 10 minutes. That is expected. If scans keep waiting for hours with memory free, the probe or the watchdog is broken. Check `~/.n8n-server/logs/`.

## Next steps

- [Ingest: pick a model that fits](/course-hub-docs/explanation/ingest/#3-pick-a-model-that-fits)
