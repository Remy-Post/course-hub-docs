---
title: Site shows stale data
description: What to do when the web app says your Mac is asleep, or shows data with an old time.
---

## When to use

The web app shows one of these messages:

- "Your Mac is asleep. Showing data from HH:MM; changes are paused." The app is serving its last good answer.
- "Your Mac is asleep or offline." The app has no saved answer yet, usually right after a web deploy.

Every write fails with "Your Mac is asleep or offline, so nothing was changed."

## Prerequisites

Physical or remote access to the Mac.

## Check

Run these on the Mac, in order. Stop at the first one that fails.

1. **Is the Mac awake and online?** Open any web page.
2. **Is n8n up?**

   ```bash
   curl -s localhost:5678/healthz
   ```

3. **Is the tunnel container up?**

   ```bash
   docker --context colima ps --filter name=cloudflared --format '{{.Names}} {{.Status}}'
   ```

4. **Does the API answer through the tunnel?**

   ```bash
   curl -s -m 15 -o /dev/null -w "%{http_code}\n" https://<api-host>/webhook/hub/api/overview
   ```

   | Result | Meaning |
   |---|---|
   | `403`, or a redirect to an Access login | Expected without the service token. The tunnel and Access work. |
   | `530` or `502` | Cloudflare can't reach the Mac's tunnel |
   | `000` | The hostname doesn't resolve. Its DNS route is missing. This was the state on 2026-10-31. |

## Fix

| Failed check | Fix |
|---|---|
| 1. Mac asleep | Wake it. The watchdog catches up a missed 6:00 AM plan between 6:05 AM and noon. |
| 2. n8n down | `~/.n8n-server/bin/n8nctl restart`. If Docker itself is down, run `colima start`, or wait up to 5 minutes for the watchdog. |
| 3. cloudflared down | `cd ~/.n8n-server/stack && docker --context colima compose --profile tunnel up -d cloudflared` |
| 4. `530` or `502` | Re-run `stack/tunnel-up.sh`. It **restarts n8n**, so say so in `AGENT-LOG.md` first. |
| 4. `000` | Create the DNS route: `cloudflared tunnel route dns n8n-hooks <api-host>`. Then check that the Access application and its Service Auth policy exist for `<api-host>`. |

## Verify

Refresh the web app. The "asleep" line disappears, and the home screen shows the current time's data.

## Roll back

Nothing to roll back. These fixes only start services.

## Escalate

If n8n starts and then stops again, run `n8nctl logs` and see [Backup and restore](/course-hub-docs/operations/backup-and-restore/). To stop overnight sleep from skipping the 6:00 AM plan with the lid closed, run `sudo pmset repeat wakeorpoweron MTWRFSU 05:50:00` once.

## Next steps

- [Architecture: a request end to end](/course-hub-docs/explanation/architecture/#a-request-end-to-end)
