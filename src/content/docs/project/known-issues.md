---
title: Known issues
description: Bugs, gaps and stale docs found while writing these docs on 2026-10-31, each with its impact and a suggested fix.
---

These were found by reading the code and checking the live system on 2026-10-31. Each entry gives its impact and a suggested fix. Remove an entry when it's fixed.

## Bugs and gaps

### The web app can't reach the API (in progress)

- **Impact:** high. The public web app shows "Your Mac is asleep or offline" on every page, and every write fails.
- **Cause:** `<api-host>` has no DNS record yet, so the web app's server can't resolve it. The tunnel's ingress rule for it exists on the Mac. On 2026-10-31 at 13:22, a session was setting up this route.
- **Fix:** finish the route with `cloudflared tunnel route dns`, and create the Access application with a Service Auth policy. Then check with [Site shows stale data](/course-hub-docs/operations/mac-offline/).

### The web app has no access control

- **Impact:** high. Anyone with the link can change your calendar and settings.
- **Fix:** put Cloudflare Access (one-time PIN by email) in front of `<web-host>`, or build the IP write lock designed in `docs/write-lock-by-ip.md`. See [Security model](/course-hub-docs/explanation/security-model/).

### A mixed settings save drops invalid keys silently

- **Impact:** low. The web app saves one key at a time, so it isn't affected. A script that sends several keys gets `200` even if some were rejected.
- **Fix:** return the rejected keys alongside `saved`.

### A Course Hub deploy can undo SMS Hub's routing

- **Impact:** medium. `build.py` wires "3a · SMS reply in" straight to the Decision workflow. SMS Hub changes that with `seed/sms-hub/course-hub-link.patch`. A Course Hub deploy without the patch sends SMS replies past the SMS router.
- **Fix:** move the routing choice into `build.py` itself, for example as a constant that points at `smsRouter0000001`.

### The last-good cache is lost on every web deploy

- **Impact:** low. After a deploy, if the Mac is asleep, pages show "Your Mac is asleep or offline" instead of the last data.
- **Fix:** accept it, or persist the last good answers to the container's tmpfs or a small volume.

### Restoring the n8n database isn't scripted

- **Impact:** medium. In a real data loss, you'd be working the restore out by hand under pressure.
- **Fix:** add `n8nctl restore <backup-folder>`, which copies `database.sqlite` into the `n8n_data` volume with a one-off container, and rehearse it on the preflight stack. See [Backup and restore](/course-hub-docs/operations/backup-and-restore/).

### The manual web deploy has no rollback

- **Impact:** low. `scripts/deploy.sh` leaves a container that fails its health check in place.
- **Fix:** reuse autodeploy's `n8n-hub:previous` tag-and-restore step.

## Stale documentation in the source repositories

| Where | What's stale | Current truth |
|---|---|---|
| User mentions of `localhost:8091/hub` | Nothing serves port 8091 | `localhost:8080/hub` (Caddy) |
| `~/.n8n-server/README.md`, "MongoDB Atlas" section | Describes Atlas as the live database | A local `mongo:8.0` container since 2026-10-31. Atlas is untouched and unused. |
| `~/.n8n-server/README.md`, services table | launchd `com.remy.n8n` runs n8n | n8n runs in Docker. `com.remy.n8n` is disabled. |
| `seed/course-hub/README.md` | "28 checks" and "30/30" in different places | `test-planner.mjs` has 28 checks |
| `seed/course-hub/README.md`, Files | Points at `tunnel/setup-tunnel.sh` | `stack/tunnel-up.sh`. The old script would drop the API route. |

## Next steps

- [Writing these docs](/course-hub-docs/project/writing-these-docs/), for how to report a new issue.
