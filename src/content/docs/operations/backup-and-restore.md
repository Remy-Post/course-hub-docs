---
title: Backup and restore
description: What the nightly backup holds, how to take one now, and how to restore or roll back to native n8n.
---

## When to use

- Before a risky change, such as an n8n upgrade or a schema migration.
- After data loss or corruption.
- When the Docker stack won't start and you need n8n back now.

## What is backed up

The watchdog takes one backup a night, between 2:00 and 5:00 AM, into `~/n8n-backups/<YYYY-MM-DD-HHMM>/` (mode `700`). Backups are kept for **14 days**.

| Item | How |
|---|---|
| n8n database (workflows, credentials, Data Tables, executions) | A consistent `VACUUM INTO` copy of SQLite from the named volume |
| MongoDB `n8n` database | `mongodump --archive --gzip` |
| `stack/secrets.env` | File copy. It holds `N8N_ENCRYPTION_KEY`, without which credentials can't be decrypted. |

`~/n8n-backups/pre-docker-2026-10-31` holds the state before the Docker move. The 14-day prune never removes it.

:::caution
Backups sit on the same Mac. Copy one somewhere else from time to time, encrypted, because it contains your credentials' encryption key.
:::

## Take a backup now

```bash
~/.n8n-server/bin/n8nctl backup
```

### Verify

A new folder in `~/n8n-backups/` holds the database copy, the Mongo archive and the secrets file.

## Restore the n8n database

1. Announce the restore in `AGENT-LOG.md`.
2. Stop n8n: `~/.n8n-server/bin/n8nctl stop`.
3. Copy the backed-up SQLite file into the `n8n_data` volume, replacing `database.sqlite`, with a one-off container that mounts the volume.
4. Make sure `stack/secrets.env` holds the **same** `N8N_ENCRYPTION_KEY` as the backup.
5. Start n8n: `~/.n8n-server/bin/n8nctl start`.

:::note
This procedure is not scripted yet. Step 3 depends on the volume name in `stack/compose.yml`. Rehearse it on the preflight stack (`build-stack.py --preflight`) before you need it.
:::

## Restore MongoDB

MongoDB is a mirror. Usually the faster fix is to rebuild it from the Data Tables with `{"remerge":true}`, or `{"force":true}` for a full scan. To restore the archive instead, stream it into the `mongo` container with `mongorestore --archive --gzip --drop`.

## Roll back to native n8n

```bash
~/.n8n-server/stack/rollback.sh
```

The script sets `RUNTIME` to `native`, stops the Docker stack (its volumes are kept), starts the launchd n8n with the `~/.n8n` data frozen at the 2026-10-31 cut-over, and redeploys Course Hub for the native credentials.

:::caution
The native data is from 2026-10-31. Anything written in Docker since then isn't in it. To go back to Docker, you'd re-run `stack/cutover.sh`, which is a one-time script and exits if `RUNTIME` is already `docker`.
:::

## Escalate

If the encryption key is lost, saved credentials can't be recovered. Reconnect each one in the n8n editor.

## Next steps

- [Configuration: key files](/course-hub-docs/reference/configuration/#key-files)
