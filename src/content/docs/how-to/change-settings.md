---
title: Change settings
description: Change your wake and sleep times, block lengths and automations from the web app or the API.
---

Use this guide to change how plans are built: wake and sleep times, block lengths, the deadline window, and which automations run.

## In the web app

1. Press `5` on the home screen, or select **Settings**.
2. Change a value. Each row saves on its own when you leave the field. You don't need a Save button.
3. Wait for **Saved** next to the row. If it shows an error, the old value comes back.

**Advanced** holds the automation switches: the 6:00 AM plan, a Google Task per assessment, local-AI step lists, and what happens when a conflict question expires.

Number fields only accept what the Mac accepts: for example, a study block of 60–180 minutes in steps of 5. See the [Settings reference](/course-hub-docs/reference/settings/) for every range.

## Settings the web app doesn't show

SMS and Twilio settings (`sms_enabled`, `sms_to`, `sms_from`, `twilio_account_sid`) are never sent to the public site. Change them on the local page at `http://localhost:8080/hub`, or with the API:

```bash
curl -s -X POST localhost:5678/webhook/hub/api/settings \
  -H 'Content-Type: application/json' \
  -d '{"sms_enabled":"true"}'
```

Values are strings, including `"true"` and `"false"`.

## Verify

```bash
curl -s localhost:5678/webhook/hub/api/settings
```

The key shows the new value. The next plan uses it.

## Next steps

- [Settings reference](/course-hub-docs/reference/settings/)
- [Preview a plan without writing](/course-hub-docs/how-to/preview-a-plan/) to see the effect.
