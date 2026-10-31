---
title: Web deploy failed
description: Recover when a push to main doesn't go live, or the web app breaks after a deploy.
---

## When to use

- You pushed to `main` and the change isn't live after 3 minutes.
- The site returns errors after a deploy.

## Prerequisites

SSH access to the VM: `ssh ubuntu@<vm-host>`.

## Check

```bash
ssh ubuntu@<vm-host> 'journalctl -u n8n-hub-autodeploy -n 60 --no-pager; echo; cat ~/n8n-hub-autodeploy/deployed; cat ~/n8n-hub-autodeploy/failed 2>/dev/null'
```

| You see | Meaning |
|---|---|
| `failed` contains your commit, and the log says `build` | The image didn't build. The old version is still serving. |
| `failed` contains your commit, and the log says `health check` | The new container didn't become healthy. Autodeploy restored the previous image. |
| `deployed` is your commit | It deployed. Check the browser cache, or whether the Mac is offline. |
| No new log lines | The timer isn't running. |

## Fix

**Build failed.** Reproduce it locally with `pnpm build`, fix it, and push. A new commit clears the skip.

**Health check failed.** Read the container logs printed in the journal. Usually a missing or wrong `.env` value, or a startup crash. Fix and push.

**Timer not running:**

```bash
ssh ubuntu@<vm-host> 'systemctl status n8n-hub-autodeploy.timer --no-pager'
```

If it's inactive, run `scripts/autodeploy/install.sh` from the Mac. It's safe to re-run.

**Retry the same commit** after fixing the VM, such as an `.env` change, without pushing:

```bash
ssh ubuntu@<vm-host> rm ~/n8n-hub-autodeploy/failed
```

## Verify

```bash
curl -s https://<web-host>/api/health
```

returns `{"ok":true}`, and `deployed` shows the new commit.

## Roll back

Autodeploy already rolls back a failed health check. To return to an older commit on purpose, revert it on `main` and push:

```bash
git revert <bad-commit> && git push origin main
```

If you deployed by hand with `scripts/deploy.sh`, there is no automatic rollback. Check out the last good commit and run `scripts/deploy.sh` again.

## Escalate

If the container is healthy but pages fail, the problem is probably the API. Go to [Site shows stale data](/course-hub-docs/operations/mac-offline/).

## Next steps

- [Deploy the web app](/course-hub-docs/how-to/deploy-the-web-app/)
