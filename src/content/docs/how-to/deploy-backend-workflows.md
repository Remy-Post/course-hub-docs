---
title: Deploy backend workflows
description: Regenerate the Course Hub n8n workflows from build.py and import them safely.
---

Use this guide after you change `build.py`, a prompt, the planner, or the local site. One script rebuilds every Course Hub workflow and imports it into n8n.

:::danger[Generators own the workflows]
Edit `seed/course-hub/build.py`, never the generated `workflows/*.json` or the workflow in the n8n editor. The next deploy overwrites both.
:::

## Before you start

- Read `~/.n8n-server/AGENT-LOG.md`. If another session lists a deploy in **Working now**, wait. Only one session may deploy at a time.
- Add your own row to **Working now** saying you're about to deploy.
- Check that the planner tests pass:

  ```bash
  cd ~/.n8n-server/seed/course-hub
  node test-planner.mjs
  ```

  The script exits with code 1 if any check fails.

## Steps

1. Deploy:

   ```bash
   cd ~/.n8n-server/seed/course-hub
   ./deploy.sh
   ```

2. The script:
   1. runs `python3 build.py` to regenerate every workflow;
   2. copies `site/index.html` to `~/.n8n-files/course-hub/site/`;
   3. **refuses to continue** if any execution has been running in the last 3 hours, because the restart would kill it;
   4. stops the watchdog and n8n, imports and publishes the workflows, and starts n8n again.

   n8n is down for about **20 seconds**.

### Options

| Command | Effect |
|---|---|
| `FORCE=1 ./deploy.sh` | Deploy even while an execution is running. The running execution is killed. See [If you force-killed a scan](#if-you-force-killed-a-scan). |
| `CH_SETUP=1 ./deploy.sh` | Also publish the one-time setup webhooks (`hub/api/setup*`). |
| `CH_TEST=1 ./deploy.sh` | Also publish the test webhook `hub/api/test/task`. |

## Verify

1. The script prints the active state of every `ch*` workflow at the end. The six core workflows and the error workflow must be active.
2. Wait about 15 seconds, because a request right after a deploy can still run the old version.
3. Load the site:

   ```bash
   curl -s -o /dev/null -w "%{http_code}\n" localhost:8080/hub/api/overview
   ```

   The result is `200`.

## If you force-killed a scan

Killing an ingest mid-run doesn't lose data you already had, because a failed or missing read never replaces a document's last good result. But the run stops partway:

- Some courses may be written and others not, and the MongoDB mirror may lag behind the Data Tables.
- The `ingest` lock stays held until it goes stale after **45 minutes**, so any scan started before then sees the lock as busy and does nothing.

After 45 minutes, run `{"remerge":true}` to rebuild every course from the cache and resync MongoDB. Then run a normal scan (`{}`) to read any files the killed run didn't reach. See [Re-scan course files](/course-hub-docs/how-to/rescan-course-files/).

A killed planner run can leave some of a plan's blocks on the calendar. Plan the same window again: a new plan replaces its own earlier blocks.

## Finish

Remove your **Working now** row and add a log entry at the top of `AGENT-LOG.md`: what changed, what you tested, and what's left.

:::caution[SMS routing]
SMS Hub rewires the "3a · SMS reply in" workflow with a patch (`seed/sms-hub/course-hub-link.patch`). `build.py` still wires it to the Decision workflow directly. After a Course Hub deploy, check that SMS replies still reach the SMS router. See [Known issues](/course-hub-docs/project/known-issues/).
:::

## Next steps

- [Workflows reference](/course-hub-docs/reference/workflows/)
- [Backup and restore](/course-hub-docs/operations/backup-and-restore/)
