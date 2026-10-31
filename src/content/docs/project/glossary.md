---
title: Glossary
description: Terms used across Course Hub and these docs.
---

| Term | Meaning |
|---|---|
| **Assessment** | Anything that counts toward a grade: an assignment, quiz, lab, test, midterm, final, project, presentation, participation, essay or discussion. Stored in `ch_assessments`. |
| **Block** | One scheduled piece of a plan, such as a study, walk, bus, meal or sleep block. Stored in `ch_plan_blocks`, and written to the Study Blocks calendar. |
| **Block library** | The routine blocks (meals, cleaning, prep, shower, night routine, sleep) with their anchor times and lengths. Stored in `ch_block_library`. |
| **Check-in / wrap-up** | The 30-second evening summary of blocks done, focus and what got in the way. Stored in `ch_checkins`. |
| **Conflict** | A 1-hour, 3-hour or 5-hour session that overlaps a fixed event. You answer it with *around*, *push* or *ignore*. |
| **Coursework** | The Google Tasks list that holds one task per open, weighted assessment. |
| **Data Tables** | n8n's built-in tables, stored in n8n's SQLite database. Course Hub's source of truth. |
| **Dry run** | A plan request with `dry_run: true`. It plans normally and writes nothing. |
| **Fixed event** | A calendar event or class that the planner treats as busy and plans around. |
| **Ingest** | The workflow that reads course documents and extracts facts from them. |
| **Last good** | The web app's in-memory copy of the most recent successful API answer, shown when the Mac is offline. |
| **Override** | A fact you confirmed or corrected. Rank 0, so it outranks every document. Stored in `ch_overrides`. |
| **Rank** | How much a source is trusted. Lower is stronger: overrides 0, syllabus 1, course page 2, intro documents 3, transcripts 4. |
| **Remerge** | Re-applying the merge rules to cached readings without reading files or calling the AI. |
| **Revalidate** | Re-checking stored readings against the current validation rules without calling the AI. |
| **`RULES_VERSION`** | A number in `build.py`. Bump it when prompts or validation change, so every file is read once more. |
| **Second look** | A short follow-up AI check on a fact the validator couldn't prove. |
| **Service token** | The Cloudflare Access credential that lets the web app's server call `<api-host>`. |
| **Task runners** | A separate container (`n8nio/runners`, same version as n8n) that runs the JavaScript and Python in n8n Code nodes, isolated from the main n8n process. |
| **Study Blocks** | The personal Google Calendar that Course Hub writes plans to. It's the only calendar it changes. |
| **Watchdog** | `bin/watchdog.sh`, which runs every 5 minutes to keep services up, catch up a missed morning plan, retry deferred scans and take backups. |

## Next steps

- [What Course Hub is](/course-hub-docs/start-here/overview/)
