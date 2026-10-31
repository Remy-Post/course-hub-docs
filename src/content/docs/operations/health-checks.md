---
title: Health checks
description: What watches Course Hub automatically, and how to check its health yourself in under a minute.
---

## When to use

- After a reboot, a deploy, or a long gap.
- Whenever you want to know whether everything is fine.

## What runs automatically

**The watchdog** (`bin/watchdog.sh`, every 5 minutes) does, in order:

1. Reopens Ollama if its API doesn't answer.
2. If n8n's `/healthz` fails twice, 30 seconds apart: starts Colima and the stack if Docker is down, otherwise restarts n8n and the runners.
3. Between 6:05 AM and noon, if today has no plan yet, requests a catch-up plan once. It holds off idle sleep with `caffeinate -i` while that runs.
4. Outside 6:00–7:30 AM, at most every 30 minutes, retries a deferred ingest scan once a model fits in memory.
5. Between 2:00 and 5:00 AM, takes the nightly backup.
6. Refreshes the health report if it's missing, older than 60 minutes, or someone pressed **Check up**.

**Failure alerts:** every Course Hub workflow sends failures to `gmailOrgAlert001`, which emails you. It must stay published.

## Check it yourself

### Quick check (30 seconds)

```bash
~/.n8n-server/bin/n8nctl status
curl -s -o /dev/null -w "local site %{http_code}\n" localhost:8080/hub
curl -s https://<web-host>/api/health
```

Expected: every service up, `local site 200`, and `{"ok":true}`.

### Full check (about 4 seconds to run)

```bash
~/.n8n-server/bin/checkup.sh
```

The report covers:

| Area | Checks |
|---|---|
| Services | Every Compose service's state and restart count, launchd jobs, Ollama |
| Reachability | The site answers `200`. The Twilio host does **not** serve the site (`404`). |
| Updates | Latest n8n, Ollama and cloudflared releases (cached for a day), and `brew outdated` for the toolchain |
| Runs | Failed executions in the last 24 hours |
| Data | Files that failed to read, Data Tables count vs. MongoDB count, any scan waiting for memory |
| Freshness | Last ingest, last backup, today's plan |
| Machine | Free disk, memory used, watchdog interventions |

The same report is available on the Settings tab of the local site (**Check up**) and from `GET /webhook/hub/api/checkup`.

:::tip
In Claude Code on the Mac, say "check up" to run the `n8n-checkup` skill. It runs the same checks and explains the result.
:::

### Web app

```bash
ssh ubuntu@<vm-host> 'docker ps --format "{{.Names}} {{.Status}}"; cat ~/n8n-hub-autodeploy/deployed; ls ~/n8n-hub-autodeploy/failed 2>/dev/null'
```

Expected: `n8n-hub ... (healthy)`, the commit you expect, and no `failed` file.

## Roll back

Health checks don't change anything, so there's nothing to roll back.

## Escalate

If a check fails, open the runbook for that symptom from the [Runbook index](/course-hub-docs/operations/).

## Next steps

- [Commands](/course-hub-docs/reference/commands/)
