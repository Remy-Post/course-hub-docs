---
title: Run the web app locally
description: Clone the Next.js web app, point it at the n8n API on your Mac, and see live data in under 5 minutes.
---

In this tutorial you run the web app on your Mac against the local n8n API, then run the same checks CI runs. It takes under 5 minutes once Node is installed.

**What you'll do**

1. Install dependencies.
2. Point the app at the local API.
3. Start the dev server and see live data.
4. Run the four checks CI runs.

## Prerequisites

- Node.js 24 or later (`engines.node` is `>=24`).
- pnpm 11. The repo pins `pnpm@11.24.0` in `packageManager`. Running `corepack enable` installs the right version.
- Read access to `Remy-Post/n8n-hub` on GitHub.
- n8n is running on the Mac. Check it with `curl -s localhost:5678/healthz`.

## 1. Install dependencies

```bash
git clone https://github.com/Remy-Post/n8n-hub.git
cd n8n-hub
pnpm install
```

## 2. Point the app at the local API

```bash
cp .env.example .env.local
```

Edit `.env.local` so it talks to n8n directly, with no Cloudflare Access token:

```ini title=".env.local"
HUB_API_URL=http://localhost:5678/webhook/hub/api
CF_ACCESS_CLIENT_ID=
CF_ACCESS_CLIENT_SECRET=
```

The app sends Access headers only when both `CF_ACCESS_*` values are set, so leaving them empty is correct locally.

## 3. Start the dev server

```bash
pnpm dev
```

Open `http://localhost:3000`.

### Verify

- The home screen shows today's date and your blocks or deadlines.
- `http://localhost:3000/api/health` returns `{"ok":true}`.
- If you see "Your Mac is asleep or offline", n8n isn't answering. Run `curl -s localhost:5678/webhook/hub/api/overview | head -c 200` to check the API directly.

:::caution
In the Plan flow, **Put it on my calendar** writes real Google Calendar events, even locally. Use the preview step for testing.
:::

## 4. Run the checks CI runs

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

### Verify

All four pass. On 2026-10-31, `pnpm test` ran 3 files and 11 tests. `pnpm typecheck` also generates the typed-route definitions.

## What you learned

- All data comes through `src/lib/hub-api/` on the server. The browser never calls n8n.
- The only configuration is three server-side environment variables, none of them `NEXT_PUBLIC_*`.

## Next steps

- [Web app reference](/course-hub-docs/reference/web-app/)
- [Update the API contract](/course-hub-docs/how-to/update-the-api-contract/) when you change an n8n endpoint.
- [Deploy the web app](/course-hub-docs/how-to/deploy-the-web-app/)
