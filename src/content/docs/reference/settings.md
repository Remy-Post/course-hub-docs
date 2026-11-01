---
title: Settings
description: Every ch_settings key, with its default, its meaning, who can edit it and the range it accepts.
---

Settings live in the `ch_settings` table as string key–value pairs. The setup workflow seeds them once and keeps existing rows.

## Editable settings

**Range** is what `POST settings` accepts (`JS_SETTINGS_IN` in `build.py`). The Settings form uses the same ranges (`src/features/settings/fields.ts`), and `test/settings.test.ts` in the web app fails if they drift apart. **In the web app** says how the form shows the key.

| Key | Default | Meaning | Range | In the web app |
|---|---|---|---|---|
| `wake` | `07:00` | First block of a full-day plan | `HH:MM`, 24-hour | Time |
| `sleep` | `22:15` | When the sleep block starts | `HH:MM` | Time |
| `study_default` | `90` | Usual study block, in minutes | 60–180, step 5 | Number |
| `study_min` | `60` | Shortest study block | 30–120, step 5 | Number |
| `study_max` | `180` | Longest continuous study | 60–180, step 5 | Number |
| `walk_after` | `30` | Walk after a study block | 5–60, step 5 | Number |
| `lookahead_days` | `21` | How far ahead deadlines count | 3–60 | Number |
| `morning_plan_enabled` | `true` | Plan today at 6:00 AM | `"true"` or `"false"` | Switch |
| `tasks_enabled` | `true` | Keep a Google Task per assessment | `"true"` or `"false"` | Switch |
| `labels_enabled` | `true` | Local AI writes step lists for blocks | `"true"` or `"false"` | Switch |
| `decision_default` | `around` | Choice used when a conflict question expires | `around`, `push`, `ignore` | Select |
| `sms_enabled` | `false` | Text conflict questions with Twilio | `"true"` or `"false"` | Not shown |
| `sms_to`, `sms_from` | empty | Phone numbers | `+1` and 10 digits, or empty | Not shown |
| `twilio_account_sid` | empty | Used only by the SMS poll fallback | `AC` and 32 hex characters, or empty | Not shown |

## Set by setup or by hand

These can't be changed through the API.

| Key | Default | Meaning |
|---|---|---|
| `tz` | `America/Toronto` | Time zone for plans |
| `term_start` | From `seed/timetable-2026F.json` | Monday of week 1 |
| `no_class_dates` | From the timetable | Comma-separated dates: study week and holidays |
| `study_calendar_id` | Set by setup | The Study Blocks calendar |
| `academic_calendar_id` | Set by setup | The school's calendar |
| `tasks_list_id` | Set by setup | The Coursework task list |
| `colors_json` | One Google Calendar color per course | JSON map of course code to color id |
| `ai_memory_cap_pct` | `80` | The AI picks a model that keeps memory use at or below this percentage. Clamped to 50–95. |

## Next steps

- [Change settings](/course-hub-docs/how-to/change-settings/)
- [How the planner works](/course-hub-docs/explanation/planner/)
