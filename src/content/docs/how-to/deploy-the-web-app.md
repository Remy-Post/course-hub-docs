---
title: Deploy the web app
description: Ship a change to the public web app by pushing to main, or deploy your local HEAD by hand.
---

Use this guide to ship a change to the web app on the Oracle VM. The usual path is a push to `main`. The manual path ships your local `HEAD` without pushing.

## Before you start

- The change passes `pnpm lint && pnpm typecheck && pnpm test && pnpm build` locally.
- If you changed an API schema, the fixtures are updated. See [Update the API contract](/course-hub-docs/how-to/update-the-api-contract/).

## Option A: push to main (recommended)

1. Commit and push to `main`:

   ```bash
   git push origin main
   ```

2. GitHub Actions runs the four checks on the push.
3. Within about a minute, the VM's `n8n-hub-autodeploy` timer notices that `main` moved. It builds the new image while the old container keeps serving, swaps it in, and waits up to 90 seconds for the health check.

A push is usually live 1–2 minutes later.

### Verify

```bash
ssh ubuntu@<vm-host> cat ~/n8n-hub-autodeploy/deployed
```

The output is the full SHA of your commit. To watch the deploy as it happens:

```bash
ssh ubuntu@<vm-host> journalctl -fu n8n-hub-autodeploy
```

Look for `n8n-hub <sha> is live and healthy`.

## Option B: deploy your local HEAD

Use this when you want to ship without pushing, for example to test a branch on the real VM.

1. Commit your change. The script refuses to run with uncommitted changes.
2. Run:

   ```bash
   scripts/deploy.sh
   ```

The script sends `git archive HEAD` over SSH to `~/n8n-hub` on the VM, keeps the server's `.env`, builds the image natively on arm64, restarts the container, and waits up to 60 seconds for it to report healthy.

:::caution
The manual script has **no automatic rollback**. If the health check times out, it prints the last 50 log lines and exits with an error, and the new container stays in place. To recover, redeploy a known-good commit, or push to `main` and let autodeploy take over.
:::

### Verify

The script ends with `n8n-hub <rev> is healthy`. Then:

```bash
curl -s https://<web-host>/api/health
```

returns `{"ok":true}`.

## If the deploy fails

See [Web deploy failed](/course-hub-docs/operations/web-deploy-failed/).

## Next steps

- [Design decisions](/course-hub-docs/explanation/design-decisions/), for why deploys pull from GitHub instead of being pushed by CI.
- [Commands](/course-hub-docs/reference/commands/)
