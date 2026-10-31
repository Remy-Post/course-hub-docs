---
title: Design decisions
description: The main architecture decisions behind Course Hub, with the context, the choice and the trade-off for each.
---

Each decision records the context, the choice and what it costs. Add a new entry when you make a choice that a future reader would otherwise question.

## 1. Generate workflows from code

- **Context:** Workflows edited by hand in the n8n editor drift apart and can't be reviewed.
- **Decision:** `build.py` generates every Course Hub workflow, and `deploy.sh` imports it. The editor copy is disposable.
- **Trade-off:** A UI edit is lost on the next deploy. Deploys restart n8n for about 20 seconds.

## 2. Run n8n in Docker on the Mac (2026-10-31)

- **Context:** n8n ran natively under launchd, and before that on the VM. The data, the course files and the GPU are on the Mac.
- **Decision:** One Compose stack on Colima: n8n, runners, MongoDB, Caddy and cloudflared. Ollama stays native for Metal.
- **Trade-off:** virtiofs carries no file events, so the file watcher polls (about 3 seconds, 3% of a core). SQLite must live in a named volume, because its WAL locking isn't safe over virtiofs. Rollback to native stays possible with `stack/rollback.sh`.

## 3. Prove every weight and date

- **Context:** A local model sometimes invented contacts or weights, and n8n's Information Extractor retried *without* the document, which made it worse.
- **Decision:** A plain LLM chain plus a hand-written validator. Each number must match a verbatim quote on the item's own line. Anything else is dropped or flagged.
- **Trade-off:** More facts need your review, but no invented number reaches your calendar.

## 4. Pick the model by free memory

- **Context:** The Mac is also your daily machine. A 15 GB model loaded at the wrong time causes heavy swapping.
- **Decision:** A memory probe every minute. Each run picks the best model that keeps memory at or below 80%, or waits.
- **Trade-off:** Scans can be delayed, and a fallback reading is upgraded later.

## 5. Fail loudly instead of succeeding silently

- **Context:** On 2026-10-31, deleted Google credentials made every Google node return an error item. The 6:00 AM plan wrote nothing and still reported success.
- **Decision:** An unreadable calendar returns `503` and fails the run. A run that writes no blocks fails. The tasks clock doesn't move on a failed read.
- **Trade-off:** More alert emails, each of which means something.

## 6. Keep the browser away from n8n

- **Context:** The API returns private fields, and n8n has no per-field access control.
- **Decision:** The web app calls the API only from the server, through Cloudflare Access, and validates and filters every response.
- **Trade-off:** Every new field needs a schema change and a fixture update.

## 7. No `use cache` for Course Hub data

- **Context:** Next.js 16 can cache data at build time.
- **Decision:** Reads happen at request time. Resilience comes from a last-good fallback in memory, not from a cache.
- **Trade-off:** The fallback is lost on every container restart, so the first request after a deploy, while the Mac sleeps, shows "Your Mac is asleep or offline".

## 8. Pull-based autodeploy

- **Context:** Pushing from CI would need SSH credentials in GitHub and an open port.
- **Decision:** The VM checks GitHub every minute with a read-only deploy key, builds while the old container keeps serving, and rolls back on a failed health check.
- **Trade-off:** Up to a minute of delay, and a failed commit is skipped until the next push.

## 9. Docs on Starlight

- **Context:** Material for MkDocs, the usual choice, reaches end of life on 2026-11-05. Its successor, Zensical, is still young.
- **Decision:** Astro Starlight: actively released, built-in local search, works on GitHub Pages, and matches the JavaScript tooling of the web app.
- **Trade-off:** One more Node project to keep updated.

## Next steps

- [Architecture](/course-hub-docs/explanation/architecture/)
- [Known issues](/course-hub-docs/project/known-issues/)
