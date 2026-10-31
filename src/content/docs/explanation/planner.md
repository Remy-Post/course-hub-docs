---
title: How the planner works
description: The 5-minute grid, the order blocks are placed in, how the planner picks what to study, and how conflicts are handled.
---

The planner is a pure function, `planBlocks()` in `seed/course-hub/planner-core.js`. It makes no network calls, reads no clock and uses no randomness: the same input always gives the same plan. The n8n workflow gathers the inputs, calls it, and writes the result.

## A day is a grid

A day is split into **5-minute cells**. A full-day plan assigns every cell from wake to sleep, so nothing is left unplanned. Blocks are placed in this order:

1. **Fixed events.** Busy events from your personal and school calendars, plus registrar timetable classes. A class that is already on a calendar isn't counted twice. An exam window longer than 4 hours counts as a deadline, not as blocked time.
2. **Commutes and sign-ins.** A bus block before and after in-person classes. Classes less than 150 minutes apart share one commute. A Zoom sign-in block before online classes.
3. **Routine anchors** from `ch_block_library`: meals, cleaning, prep, shower, night routine and sleep. Each one goes at its anchor time, or moves up to 60 minutes if that slot is busy.
4. **Study and walks** fill every remaining free run: a study block of `study_default` minutes, then a `walk_after` walk. Leftovers of 20 minutes or more become a notes block; shorter ones are absorbed into the walk.

Low energy or little sleep shortens study blocks to `study_min`. Sprint style allows up to `study_max` in one stretch.

## Picking what to study

Each study block goes to the assessment with the highest score:

```text
score = weight
      × (e^(−days_until_due / 7) + 0.15)
      × certainty(date_status)
      × (1 + (3 − your_confidence) × 0.25)
      × 1.35 if you marked the course urgent
      × kind_factor
      × 0.55 ^ (times already picked this session)
```

| Date status | Certainty | | Kind | Factor |
|---|---|---|---|---|
| confirmed | 1.0 | | final | 1.2 |
| tentative | 0.85 | | midterm, test | 1.1 |
| ambiguous | 0.75 | | project, assignment, essay | 1.0 |
| announced_later | 0.7 | | quiz | 0.9 |
| tba | 0.6 | | presentation, lab | 0.8 |
| | | | other | 0.7 |
| | | | discussion | 0.5 |
| | | | participation | 0.3 |

Past-due items are skipped. Items due after `lookahead_days` are skipped unless they're exams. To mix subjects, the top pick is swapped for the best item from a **different course** whenever that item scores at least 60% as high.

## Conflicts

Conflicts apply to 1-hour, 3-hour and 5-hour sessions. If the session overlaps a fixed event and no decision was given, the planner returns `status: "conflict"` with no blocks, and the workflow asks you:

| Decision | Effect |
|---|---|
| `around` (default) | Plan only the free parts of the window |
| `push` | Extend the window past the conflict, up to your sleep time |
| `ignore` | Plan straight through and note the overlap |

Full-day and week plans never ask. Fixed events are simply planned around.

## Step lists

Every study block gets a short step list: 3 steps, or 4 for an exam, sized to the block. If `labels_enabled` is on, the local AI (`qwen3.5:9b`) tries to write a better one. Its answer is used only if the label is 6 words or fewer and it has 2–4 steps that each start with "N min". Otherwise the built-in list stays.

## Time and dates

Plans use `America/Toronto`. A future `start` plans that whole day from wake time. "Now" after bedtime rolls over to tomorrow. The tests include a week that spans the Nov 1 daylight-saving change, and that day still gets a full 16-hour plan.

## Tests

`node test-planner.mjs` runs 28 checks in 6 scenarios:

- a Monday with a lecture and a lab;
- a free 3-hour Saturday (exactly Study 90 → Walk 30 → Study 60);
- a 3-hour session that collides with two classes, under each decision;
- a full week across daylight-saving time, including a check that the output is identical byte for byte;
- low energy, and rollover after bedtime;
- a future-dated day plan.

## Next steps

- [Preview a plan without writing](/course-hub-docs/how-to/preview-a-plan/)
- [Settings](/course-hub-docs/reference/settings/)
