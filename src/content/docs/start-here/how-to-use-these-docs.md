---
title: How these docs are organized
description: The five sections of these docs, what each is for, and the placeholders used for private values.
---

These docs follow the [Diátaxis](https://diataxis.fr/) framework, plus a section of runbooks for operations. Each page is one type, so you can tell from the sidebar what kind of help you'll get.

| Section | Use it when you want to… | Shape of each page |
|---|---|---|
| **Tutorials** | learn by doing, start to finish | What you'll do → Prerequisites → Steps → Verify → Next steps |
| **How-to guides** | finish one specific task | Goal → Before you start → Steps → Verify → Next steps |
| **Reference** | look up an exact name, field, limit or command | Tables and code, no narrative |
| **Explanation** | understand why it works the way it does | Context → Design → Trade-offs |
| **Operations** | fix something that's broken right now | When to use → Check → Fix → Roll back → Escalate |

## Placeholders for private values

This site is public, so it never shows secrets, addresses or personal data. Wherever a real value is needed, you'll see a placeholder:

| Placeholder | Means | Where the real value lives |
|---|---|---|
| `<web-host>` | Public hostname of the web app | Private repo `README.md` |
| `<api-host>` | Hostname of the Access-protected API tunnel | Private repo `.env.example`, `~/.n8n-server/stack/tunnel-up.sh` |
| `<hooks-host>` | Hostname that only accepts Twilio's inbound SMS | `~/.cloudflared/config.yml` on the Mac |
| `<vm-host>` | The Oracle VM's SSH address | Private repo `scripts/deploy.sh` |
| `<courses-folder>` | Folder that holds the course files | `~/.n8n-server/stack/compose.yml` (bind mount) |
| `COMP-1234` | An example course code | Your real codes are in the `ch_courses` table |

## Sources of truth

Every claim in these docs comes from reading the code and checking the live system on 2026-10-31. When the docs and the code disagree, **the code wins**. Report the gap using [Writing these docs](/course-hub-docs/project/writing-these-docs/).

| Topic | Source of truth |
|---|---|
| Backend workflows, API, tables, settings | `~/.n8n-server/seed/course-hub/build.py` |
| Planner rules | `~/.n8n-server/seed/course-hub/planner-core.js` and `test-planner.mjs` |
| Docker stack on the Mac | `~/.n8n-server/stack/build-stack.py` (generates `compose.yml` and `Caddyfile`) |
| Web app | `src/` in `Remy-Post/n8n-hub`, especially `src/lib/hub-api/schemas.ts` |
| Running state and recent changes | `~/.n8n-server/AGENT-LOG.md` |

## Next steps

- [What Course Hub is](/course-hub-docs/start-here/overview/)
- [Glossary](/course-hub-docs/project/glossary/)
