---
title: Confirm or fix a fact
description: Confirm or correct an assessment's weight, date or status. Your fix outranks the syllabus on every later scan.
---

When Course Hub can't fully prove a weight or date, it flags the assessment for review. Use this guide to confirm it or correct it. A correction is stored as an **override**, which outranks every document on later scans.

## Before you start

The home screen's **Facts to check** count is above zero.

## In the web app

1. Press `3` on the home screen, or select **Check my facts**.
2. Each card shows one flagged fact: the weight or date, and the exact syllabus quote it came from.
3. Do one of the following:
   - If it's right, select **Looks right**.
   - If it's wrong, select **Fix date** or **Fix weight**, enter the correct value, and save.
4. Repeat until you see "All caught up".

### Verify

The **Facts to check** count on the home screen goes down. On the course's page, the assessment no longer shows a review marker.

## From the command line

Send an override straight to the Mac:

```bash
curl -s -X POST localhost:5678/webhook/hub/api/override \
  -H 'Content-Type: application/json' \
  -d '{"entity":"assessment","entity_key":"<assessment_id>","field":"weight","value":"15","course_code":"COMP-1234","source":"manual"}'
```

`field` must be `due_at`, `weight`, `date_status` or `title`. See the [`POST override` reference](/course-hub-docs/reference/hub-api/#post-override) for the rules.

### Verify

The response is `{"ok": true, "override": {…}}`. The assessment updates immediately. You don't need to wait for a scan.

## What happens to the fix

- It's written to `ch_overrides` with rank 0, the highest rank.
- The live `ch_assessments` row is patched at once, and `needs_review` is cleared.
- Every later ingest applies the override over anything a document says.

## Next steps

- [Ingest and source precedence](/course-hub-docs/explanation/ingest/)
- [Re-scan course files](/course-hub-docs/how-to/rescan-course-files/)
