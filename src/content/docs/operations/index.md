---
title: Runbook index
description: Start from the symptom and jump to the runbook that fixes it.
---

Find your symptom and open its runbook. Every runbook has the same shape: **When to use** → **Check** → **Fix** → **Roll back** → **Escalate**.

| Symptom | Runbook |
|---|---|
| "Your Mac is asleep. Showing data from…" or "Your Mac is asleep or offline" | [Site shows stale data](/course-hub-docs/operations/mac-offline/) |
| A push to `main` didn't go live, or the site broke after a deploy | [Web deploy failed](/course-hub-docs/operations/web-deploy-failed/) |
| No study blocks on the calendar this morning, or an alert email from the planner | [Plan wrote nothing](/course-hub-docs/operations/plan-wrote-nothing/) |
| A file changed but facts didn't update, or a scan is waiting for memory | [AI scan is waiting](/course-hub-docs/operations/ai-waiting-for-memory/) |
| Data lost or corrupted, or n8n won't start after an update | [Backup and restore](/course-hub-docs/operations/backup-and-restore/) |
| You just want to know whether everything is fine | [Health checks](/course-hub-docs/operations/health-checks/) |

## Rules for every incident

1. **Read `~/.n8n-server/AGENT-LOG.md` first.** Another session may be deploying or holding the files you need.
2. **Don't deploy during a run.** `deploy.sh` refuses for this reason. Override it with `FORCE=1` only if you accept killing the run.
3. **Never print or paste secrets** from `stack/secrets.env`, `stack/env/*`, the VM's `.env` or the Keychain.
4. **Don't send email or texts** while testing unless you mean to.
5. **Log what you did** at the top of `AGENT-LOG.md` when you're done.

## Escalation

Course Hub has one operator, its owner. When a runbook doesn't fix the problem:

1. Run `~/.n8n-server/bin/checkup.sh` and keep the output.
2. Note the failing workflow's last run with `bin/n8n-exec.py <workflowId>`.
3. Open a Claude Code session in `~/.n8n-server`, give it both outputs, and point it at `CLAUDE.md` and `AGENT-LOG.md`.

## Next steps

- [Health checks](/course-hub-docs/operations/health-checks/)
