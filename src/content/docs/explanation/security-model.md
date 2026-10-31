---
title: Security model
description: What protects Course Hub, what's deliberately exposed, and the gaps you should know about.
---

Course Hub is a personal system, so its security goal is narrow: **keep personal data and secrets on the Mac, and keep the public surface small.** This page states what it protects, how, and where it falls short.

## Layers

| Layer | Protection |
|---|---|
| **Network** | Course Hub opens no inbound ports. On the Mac, every port binds to `127.0.0.1`. On the VM, the app's port `3000` is reachable only inside the Docker network (by cloudflared) and on loopback as `127.0.0.1:3010`. The VM's public ports 80 and 443 belong to a Caddy that serves an unrelated site. |
| **Tunnel allow-lists** | `<api-host>` forwards only 8 API paths, and `<hooks-host>` only the Twilio webhook. Setup, test and `ingest` paths return `404`. `tunnel-up.sh` checks this when it runs. |
| **Cloudflare Access** | `<api-host>` requires a service token (Service Auth policy). Only the VM holds the token. |
| **Server-only API access** | The web app calls the API only from server code. `import "server-only"` makes the build fail if that code reaches the client. No `NEXT_PUBLIC_*` variables exist. |
| **Response filtering** | zod schemas keep only the fields the UI uses. Phone numbers, Twilio fields, calendar and task ids, meeting times and the school name never reach the browser. File paths are cut to the file name. |
| **Input validation** | Every Server Action validates its input with zod, and n8n validates it again. Settings writes accept only allow-listed keys. |
| **Rate limiting** | 30 writes per minute per IP, in a fixed window. |
| **Headers** | Strict CSP, HSTS with preload, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy: same-origin`, a restrictive `Permissions-Policy`, and `X-Robots-Tag: noindex`. |
| **Container** | Read-only filesystem, non-root `node` user, all capabilities dropped, `no-new-privileges`, and a memory limit. |
| **Secrets** | `600` files and the macOS Keychain. Autodeploy uses a read-only deploy key that exists only on the VM. Nothing secret is in GitHub. |

## Known gaps

:::danger[The web app has no sign-in]
Anyone who knows `<web-host>` can read your schedule and **make changes**: commit plans to your calendar, answer conflict questions, change settings and override facts. The site isn't indexed and its hostname isn't published, but that is obscurity, not access control. These public docs use a placeholder for the hostname for this reason.
:::

- **The rate limiter can be fooled.** If `cf-connecting-ip` is missing, it falls back to `x-forwarded-for`, which a client can set. Cloudflare always sets `cf-connecting-ip` in production, so in practice the risk is small. Still, don't reuse this key for access control.
- **CSP allows inline scripts.** Next.js streams page data in inline scripts, and nonces would force every page to render dynamically. The app renders no user-supplied HTML, which limits the risk.
- **`GET settings` and `POST decision` return private fields.** Only the web app's filtering keeps them from the browser. Any new consumer must filter them too.

### Planned fix

`docs/write-lock-by-ip.md` in the web app repo designs a write lock. Writes would be allowed only from listed IPs, using `cf-connecting-ip` only, and a "View only" banner would show for everyone else. **It is not implemented yet.** Cloudflare Access on `<web-host>` itself, with a one-time PIN by email, would be a stronger fix that needs no code.

## Reporting a problem

This is a personal project. If you find a security issue, open an issue on this docs repository **without** details, and the owner will contact you.

## Next steps

- [Architecture](/course-hub-docs/explanation/architecture/)
- [Known issues](/course-hub-docs/project/known-issues/)
