---
title: Update the API contract
description: Change an n8n endpoint and the web app together, without breaking the public site or leaking private fields.
---

The web app validates every n8n response with zod schemas. If you change what an endpoint returns, change the schema and the test fixtures in the same piece of work. Otherwise the web app falls back to stale data, or shows "Couldn't load this".

## Before you start

- Decide whether the web app needs the new field at all. The schemas deliberately drop anything the UI doesn't use.
- The new field must not be private: no phone numbers, Twilio fields, calendar or task-list ids, or full file paths.

## Steps

1. **Change the endpoint** in `~/.n8n-server/seed/course-hub/build.py`, then [deploy the backend](/course-hub-docs/how-to/deploy-backend-workflows/).
2. **Capture a real response** on the Mac:

   ```bash
   curl -s localhost:5678/webhook/hub/api/overview > test/fixtures/overview.json
   ```

3. **Redact the fixture.** Remove or replace phone numbers, Twilio fields, calendar ids and anything personal before you commit.
4. **Update the schema** in `src/lib/hub-api/schemas.ts`. Use the `text`, `flag` and `num` helpers so a missing field degrades instead of failing.
5. **Add or update a test** in `test/schemas.test.ts`. If the endpoint returns anything private, assert that the schema drops it, the way the existing `to`/`from` test does.
6. **Run the checks:**

   ```bash
   pnpm lint && pnpm typecheck && pnpm test && pnpm build
   ```

7. **Deploy the backend first, then the web app.** A web app that expects a field the Mac doesn't send yet only gets defaults. A Mac that sends extra fields is harmless.

## Verify

- `pnpm test` passes.
- The page that uses the field renders it with live data.
- In the browser, view the page source or the network payload and confirm the private fields are absent.

## New endpoints

A new endpoint is reachable from the web app only if it's in the tunnel's allow-list. The `hub-api` route in `~/.n8n-server/stack/tunnel-up.sh` matches only `overview`, `courses`, `settings`, `plan`, `decision`, `checkin`, `override` and `checkup`. Add it there, re-run the script, and announce it in `AGENT-LOG.md` first, because the script restarts n8n.

## Next steps

- [Hub API reference](/course-hub-docs/reference/hub-api/)
- [Security model](/course-hub-docs/explanation/security-model/)
