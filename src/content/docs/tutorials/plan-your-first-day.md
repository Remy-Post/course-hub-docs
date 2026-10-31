---
title: Plan and wrap up your first day
description: Use the web app to preview a study plan, put it on your calendar, and log an evening check-in.
---

In this tutorial you plan a 3-hour study session, preview it, put it on your calendar, and then log a wrap-up at the end of the day. It takes about 10 minutes.

**What you'll do**

1. Read today's overview on the home screen.
2. Answer the six-step plan quiz and preview the result.
3. Commit the plan to your **Study Blocks** calendar.
4. Log a wrap-up check-in.

## Prerequisites

- The Mac is awake and n8n is running. If the home screen says "Your Mac is asleep", see [Site shows stale data](/course-hub-docs/operations/mac-offline/).
- You can open `https://<web-host>` or, on the Mac, `http://localhost:8080/hub`. This tutorial uses the web app.
- The **Study Blocks** calendar exists. The one-time setup workflow creates it.

:::caution
Step 3 creates **real Google Calendar events**. Everything before it is a dry run and writes nothing.
:::

## 1. Read the home screen

Open `https://<web-host>`. The home screen shows:

- **Now / Next**: the current study block with a progress ring, or the next one. It updates every 30 seconds.
- **At a glance**: assessments due in the next 14 days, facts waiting to be checked, and study minutes planned today.
- **Five flows**: Plan my time, Wrap up my day, Check my facts, Courses and Settings.

:::tip
Press `?` to see every keyboard shortcut. On the home screen, keys `1` to `5` open the flows.
:::

## 2. Answer the plan quiz

Press `1`, or select **Plan my time**. The flow has six steps. `Enter` continues and `Esc` goes back.

1. **Amount.** Choose **3h**, then **Now**.
2. **How you're doing.** Set your sleep hours, then rate sleep quality, energy, focus and stress from 1 to 5. Low energy or little sleep makes the planner use shorter blocks.
3. **Priorities.** Select any courses that feel urgent. For each assessment due within 14 days that is worth 5% or more, rate your confidence.
4. **Style.** Choose **Deep** (90 minutes of study, then a 30-minute walk) or **Sprint** (up to 3 hours straight), and optionally one experiment to try, such as "Phone in another room". Select **Preview my plan**.
5. **Preview.** You see the proposed blocks. Nothing has been written yet; this was a `dry_run`.

If the preview says there is a **conflict**, your 3 hours overlap a calendar event. You'll choose how to handle it in the next step.

### Verify the preview

The preview lists blocks such as "Study 90 min → Walk 30 min → Study 60 min", each with a course, an assessment and a "Show steps" toggle. If every block names a course, the planner found your deadlines.

## 3. Put it on your calendar

Select **Put it on my calendar**. The Mac runs the planner again, this time for real, and writes the blocks to **Study Blocks**. This can take up to a few minutes, because the local AI writes a short step list for each block.

If the result is a conflict, choose one option:

| Choice | Effect |
|---|---|
| **Work around it** | Plans only the free parts of your 3 hours |
| **Push later** | Extends the session past the event, up to your sleep time |
| **Ignore** | Plans straight through the event |

### Verify the commit

Open Google Calendar on your phone. The **Study Blocks** calendar shows the new events, colored by course. The home screen's **Now / Next** card shows the first block.

## 4. Wrap up your day

In the evening, press `2` on the home screen, or select **Wrap up my day**.

1. Confirm how many blocks you finished. The count is filled in from today's plan.
2. Rate your focus from 1 to 5 and pick anything that got in the way.
3. Select **Save**.

### Verify the check-in

The confirmation screen appears. Tomorrow's 6:00 AM plan reads this check-in.

## What you learned

- Every plan has a free **preview** before anything is written.
- A conflict is a question, not an error. You answer it on the site, or by SMS if SMS is turned on.
- The evening wrap-up feeds the morning plan.

## Next steps

- [Confirm or fix a fact](/course-hub-docs/how-to/fix-a-fact/) so plans use the right weights and dates.
- [How the planner works](/course-hub-docs/explanation/planner/)
- [Change settings](/course-hub-docs/how-to/change-settings/), such as your wake time or block length.
