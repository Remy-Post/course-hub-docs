---
title: Commands
description: Every operator command on the Mac and the VM, and the web app's pnpm scripts.
---

## On the Mac: `~/.n8n-server/bin/`

Every script checks `~/.n8n-server/RUNTIME` (`docker` or `native`) and does the right thing for each.

| Command | Usage | Does |
|---|---|---|
| `n8nctl` | `status \| start \| stop \| restart \| logs \| backup \| update [ver] \| open \| disable \| enable \| sandbox-key \| sandbox-logs` | Controls the n8n stack |
| `n8n-sql` | `n8n-sql [--json \| --write] "<SQL>"` | Queries the n8n SQLite database, even while n8n is stopped |
| `n8n-cli.sh` | `n8n-cli.sh <n8n CLI args>` | Runs the n8n CLI with the server's environment. In Docker, files are passed as tar streams. |
| `n8n-exec.py` | `n8n-exec.py <workflowId \| executionId> [node] [--json]` | Shows each node's status in the newest run, or one node's items |
| `checkup.sh` | `checkup.sh [--quiet]` | Full health report. Writes `~/.n8n-files/course-hub/checkup.json`. |
| `watchdog.sh` | Run by launchd every 5 min | See [Health checks](/course-hub-docs/operations/health-checks/) |
| `sysmem.sh` | Run by launchd every minute | Writes the memory probe `sysmem.json` |
| `ollama-env.sh` | Run by launchd at login | Sets Ollama's environment and restarts it only if the config changed |
| `install-checkup-helper.sh` | `[--remove]` | Optional launchd job that answers the site's Check up button in about 5 s |

Examples:

```bash
~/.n8n-server/bin/n8nctl status
~/.n8n-server/bin/n8n-sql "select id, active, name from workflow_entity where id like 'ch%'"
~/.n8n-server/bin/n8n-exec.py chPlanner0000001
```

## On the Mac: Course Hub

```bash
cd ~/.n8n-server/seed/course-hub
node test-planner.mjs      # planner rules: 28 checks in 6 scenarios
./deploy.sh                # build, import and publish (n8n down about 20 s)
FORCE=1 ./deploy.sh        # deploy even while a run is active
CH_SETUP=1 ./deploy.sh     # also publish the setup webhooks
CH_TEST=1 ./deploy.sh      # also publish the test webhook
```

## On the Mac: the stack

| Command | Does |
|---|---|
| `python3 stack/build-stack.py` | Regenerates `compose.yml`, `Caddyfile` and the per-service env files |
| `python3 stack/build-stack.py --preflight` | Builds an isolated test stack (n8n on `:5680`, site on `:8081`) |
| `stack/tunnel-up.sh` | Sets up the Cloudflare Tunnel routes. **Restarts n8n**, because it runs `deploy.sh`. |
| `stack/rollback.sh` | Switches back to native (launchd) n8n. See [Backup and restore](/course-hub-docs/operations/backup-and-restore/). |

## On the Oracle VM

| Command | Does |
|---|---|
| `journalctl -fu n8n-hub-autodeploy` | Follow autodeploy |
| `cat ~/n8n-hub-autodeploy/deployed` | The deployed commit |
| `rm ~/n8n-hub-autodeploy/failed` | Retry a failed commit without pushing |
| `docker inspect -f '{{.State.Health.Status}}' n8n-hub` | Container health |
| `curl -s 127.0.0.1:3010/api/health` | Smoke-test the app on the VM, without going through the tunnel |

## Web app: `pnpm` scripts

| Script | Runs |
|---|---|
| `pnpm dev` | `next dev` on `:3000` |
| `pnpm build` | `next build` (standalone output) |
| `pnpm start` | `next start` |
| `pnpm lint` | ESLint, with Next's core-web-vitals and TypeScript rules |
| `pnpm typecheck` | `next typegen && tsc --noEmit` |
| `pnpm test` | `vitest run` |
| `scripts/deploy.sh` | Ship local `HEAD` to the VM |
| `scripts/autodeploy/install.sh` | Set up or repair autodeploy. Safe to re-run. |

## Next steps

- [Configuration](/course-hub-docs/reference/configuration/)
- [Runbook index](/course-hub-docs/operations/)
