---
title: What Course Hub is
description: What Course Hub does, its two parts, and where each one runs.
---

Course Hub is a personal study planner for one student. It reads course outlines from a folder of course files, stores the weights and dates it can back with a quote, and puts study blocks on a Google Calendar every morning.

## What it does

- **Reads your courses.** Every night at 3:30 AM, and whenever a course file changes, it reads syllabi and other course documents with a local AI model. It keeps a weight or date only if it finds the exact words in the document.
- **Plans your day.** At 6:00 AM it time-locks the day on a 5-minute grid: classes and calendar events first, then routines, then study blocks with walks between them. You can also ask for a 1-hour, 3-hour, 5-hour, day or week plan at any time.
- **Keeps a task per assessment.** Each weighted assessment gets a Google Task in a "Coursework" list. Check it off on your phone and its future study blocks are removed.
- **Asks before it overwrites your time.** If a short session overlaps an event, it asks whether to work around it, push it later or ignore it, on the site or by SMS.
- **Learns from check-ins.** A 30-second evening wrap-up records what you finished and what got in the way, and that feeds the next plan.

## The two parts

| Part | What it is | Where it runs | Source |
|---|---|---|---|
| **Backend** | n8n 2.45.4 workflows, local AI (Ollama), n8n Data Tables, a MongoDB mirror and a local site | One Mac, in Docker on Colima, plus Ollama installed directly on macOS | `~/.n8n-server` (generator: `seed/course-hub/build.py`) |
| **Web app** | A Next.js 16 site that walks you through one task at a time | An Oracle Cloud VM, in Docker, reached through a Cloudflare Tunnel | GitHub `Remy-Post/n8n-hub` (private) |

There are two ways to open the hub:

- **Local site:** `http://localhost:8080/hub` on the Mac, served by Caddy. The older address `http://localhost:5678/webhook/hub` still works.
- **Web app:** `https://<web-host>`, available from any device. The real hostname is in the private repository's README.

:::note
You may have seen `localhost:8091/hub` mentioned. Nothing serves or references port 8091 as of 2026-10-31; the local site is on port **8080**. The only other port defined for the site is 8081, used by an isolated test stack (`build-stack.py --preflight`).
:::

## Who these docs are for

- **You, the owner and only user**: using the planner, fixing facts, changing settings.
- **You, the operator**: deploying, checking health, recovering when the Mac sleeps or a deploy fails.
- **Any developer or AI coding session** that changes the code: the reference and explanation sections describe how the parts fit together and what must not break.

## What Course Hub doesn't do

- It is single-user. There are no accounts, and the web app has no sign-in (see [Security model](/course-hub-docs/explanation/security-model/)).
- It never writes to calendars other than **Study Blocks**, and it doesn't send email or SMS unless the settings allow it.
- It doesn't back-fill a missed run on its own. The watchdog sends a catch-up plan request if the Mac slept through 6:00 AM.

## Next steps

- [How these docs are organized](/course-hub-docs/start-here/how-to-use-these-docs/)
- [Plan and wrap up your first day](/course-hub-docs/tutorials/plan-your-first-day/)
- [Architecture](/course-hub-docs/explanation/architecture/)
