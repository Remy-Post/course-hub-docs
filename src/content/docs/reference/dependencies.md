---
title: Dependencies
description: Every dependency of the backend, the web app and these docs, with exact versions and where each is pinned.
---

Versions as of 2026-10-31, checked against the running containers and the lockfiles.

## Backend (Mac)

| Component | Version | Pinned in | Notes |
|---|---|---|---|
| n8n | `2.45.4` | `stack/build-stack.py` → `compose.yml` | 2.45.7 was available on 2026-10-31. Update only after testing. |
| n8n runners | `2.45.4` | Same | Must match n8n exactly |
| MongoDB | `8.0` | `build-stack.py` | Replaced Atlas on 2026-10-31 |
| Caddy | `2.10-alpine` | `build-stack.py` | |
| cloudflared | `2026.10.0` | `build-stack.py` | 2026.10.7 was available |
| n8n sandbox service | `1.8.1` | `sandbox/.env` | |
| SearXNG | `latest` | `sandbox/compose.yml` | Not pinned |
| Colima, Docker, Lima | Homebrew | Not pinned | `checkup.sh` reports when they're outdated |
| Ollama | Native app | Not pinned | `checkup.sh` checks for new releases daily |
| Python | 3.13 | Homebrew | Runs `build.py` and `build-stack.py` |
| esbuild | `0.28.2` | `seed/course-hub/site/package.json` | Builds the local site |
| three | `0.186.1` | Same | 3D look of the local site |

### Local AI models

| Model | Used for |
|---|---|
| `gpt-oss:20b` | Course extraction (preferred, about 14.6 GB) |
| `qwen3.5:9b` | Extraction fallback (about 9.7 GB), plan step lists, Morning Digest line, SMS Hub writers |
| `llama3.2:latest` | Reading free-text SMS replies |
| `qwen3.6:35b-a3b` | n8n Assistant and general chat |
| `nomic-embed-text` | Embeddings. Installed, but no Course Hub workflow uses it. |

## Web app

Exact versions from `pnpm-lock.yaml`.

| Package | Version | Role |
|---|---|---|
| `next` | `16.4.3` | Framework: App Router, Server Actions, Cache Components |
| `react`, `react-dom` | `19.3.1` | UI runtime, including `<ViewTransition>` |
| `zod` | `4.6.7` | Validates every API response and every action input |
| `server-only` | `0.0.1` | Fails the build if server code reaches the client |
| `tailwindcss`, `@tailwindcss/turbopack` | `4.3.3` | Styling |
| `typescript` | `5.9.3` | Type checking |
| `vitest` | `5.0.5` | Tests |
| `eslint` / `eslint-config-next` | `9.39.5` / `16.4.3` | Linting |
| `babel-plugin-react-compiler` | `1.0.0` | React Compiler |
| `@types/node`, `@types/react`, `@types/react-dom` | `24.19.2`, `19.3.0`, `19.3.0` | Types |

Runtime: Node 24 (`node:24-alpine`, arm64) and pnpm `11.24.0`.

## Oracle VM

| Component | Version |
|---|---|
| OS | Ubuntu 24.04.4 LTS, arm64, 2 vCPU, about 12 GB RAM |
| cloudflared | `2026.10.7` |
| Caddy | `2-alpine`. Serves an unrelated personal site, not Course Hub. |

## These docs

| Package | Version | Role |
|---|---|---|
| `astro` | `7.4.4` | Static site framework |
| `@astrojs/starlight` | `0.42.8` | Docs theme, search (Pagefind) and navigation |
| `starlight-links-validator` | `0.27.0` | Fails the build on broken internal links |
| `astro-mermaid`, `mermaid` | `2.2.0`, `12.2.0` | Diagrams |

## Next steps

- [Health checks](/course-hub-docs/operations/health-checks/), which report outdated versions.
- [Design decisions](/course-hub-docs/explanation/design-decisions/)
