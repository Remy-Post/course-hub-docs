---
title: Settings
description: Every ch_settings key, with its default, its meaning, who can edit it and the ranges each side accepts.
---

Settings live in the `ch_settings` table as string key–value pairs. The setup workflow seeds them once and keeps existing rows.

## Editable settings

**Backend range** is what `POST settings` accepts (`JS_SETTINGS_IN` in `build.py`). **Web app range** is what the Settings form allows (`src/features/settings/fields.ts`). Where they differ, the backend wins and the save fails.

| Key | Default | Meaning | Backend range | Web app range |
|---|---|---|---|---|
| `wake` | `07:00` | First block of a full-day plan | `HH:MM`, 24-hour | Same |
| `sleep` | `22:15` | When the sleep block starts | `HH:MM` | Same |
| `study_default` | `90` | Usual study block, in minutes | **60–180**, step 5 | 25–180 ⚠️ |
| `study_min` | `60` | Shortest study block | **30–120**, step 5 | 15–120 ⚠️ |
| `study_max` | `180` | Longest continuous study | **60–180**, step 5 | 30–240 ⚠️ |
| `walk_after` | `30` | Walk after a study block | **5–60**, step 5 | 0–60 ⚠️ |
| `lookahead_days` | `21` | How far ahead deadlines count | **3–60** | 1–60 ⚠️ |
| `morning_plan_enabled` | `true` | Plan today at 6:00 AM | `"true"` or `"false"` | Switch |
| `tasks_enabled` | `true` | Keep a Google Task per assessment | `"true"` or `"false"` | Switch |
| `labels_enabled` | `true` | Local AI writes step lists for blocks | `"true"` or `"false"` | Switch |
| `decision_default` | `around` | Choice used when a conflict question expires | `around`, `push`, `ignore` | Select |
| `sms_enabled` | `false` | Text conflict questions with Twilio | `"true"` or `"false"` | Not shown |
| `sms_to`, `sms_from` | empty | Phone numbers | `+1` and 10 digits, or empty | Not shown |
| `twilio_account_sid` | empty | Used only by the SMS poll fallback | `AC` and 32 hex characters, or empty | Not shown |

⚠️ marks a range mismatch. See [Known issues](/course-hub-docs/project/known-issues/).

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
