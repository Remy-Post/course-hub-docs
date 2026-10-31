---
title: Data model
description: The 17 n8n Data Tables and 5 MongoDB collections, with their columns, types and enums.
---

n8n Data Tables (`ch_*`) are the source of truth, and every workflow reads from them. MongoDB holds a one-way mirror of five collections.

Source: the `TABLES` dictionary in `build.py` and `seed/course-hub/atlas/setup.js`.

## Data Tables

Types: **s** string, **n** number, **b** boolean, **d** date. Unmarked columns are strings.

### Course facts

| Table | Columns | Written by |
|---|---|---|
| `ch_courses` | `course_code section title term credits:n delivery school campus location meets lms_url passing_rule materials late_policy communication source_file source_rank:n needs_review:b review_note run_id updated_at:d` | Ingest |
| `ch_contacts` | `contact_id course_code role name email alt_emails office_hours office source_file source_rank:n needs_review:b run_id updated_at:d` | Ingest |
| `ch_meetings` | `meeting_id course_code kind days start_time end_time start_date end_date location delivery busy:b source updated_at:d` | Setup (from the registrar timetable) |
| `ch_assessments` | `assessment_id course_code kind title group_name is_group:b weight:n group_weight:n count:n drop_lowest:n due_at:d all_day:b date_status date_text window_end:d format status task_id task_hash source_file source_rank:n source_quote date_source needs_review:b review_note run_id updated_at:d` | Ingest, override, tasks sync, task done |
| `ch_topics` | `topic_id course_code week_no:n week_start date_text topic readings source_file run_id` | Ingest |
| `ch_overrides` | `override_id course_code entity entity_key field value source created_at:d` | `POST override` |

### Ingest cache

| Table | Columns | Purpose |
|---|---|---|
| `ch_doc_facts` | `fact_key path sha256 course_code rank:n doc_type task status note result model updated_at:d` | One row per document and task (`path\|task`). Unchanged documents keep their facts. |
| `ch_ingest_registry` | `path sha256 course_code doc_type source_rank:n status items:n chars:n pages:n note model last_ingested_at:d` | One row per watched file, used to detect changes |

### Planning

| Table | Columns | Written by |
|---|---|---|
| `ch_plans` | `plan_id scope source status window_start:d window_end:d decision request_json notes blocks:n study_minutes:n created_at:d` | Planner |
| `ch_plan_blocks` | `event_id plan_id start:d end:d block_type category title course_code assessment_id status` | Planner |
| `ch_decisions` | `code plan_id status request_json conflict_text sms_sid reply choice created_at:d expires_at:d resolved_at:d` | Planner, Decision |
| `ch_quiz` | `quiz_id created_at:d scope energy:n focus:n stress:n sleep_hours:n sleep_quality:n meds style urgent confidence_json location experiment notes plan_id` | Planner |
| `ch_checkins` | `checkin_id date blocks_done:n blocks_planned:n focus:n derailers experiment notes created_at:d` | `POST checkin` |
| `ch_block_library` | `key title category minutes:n min_minutes:n max_minutes:n anchor days color remind:b description sort:n` | Setup (from `seed/block-library.json`) |

### Control

| Table | Columns | Purpose |
|---|---|---|
| `ch_settings` | `key value note` | See [Settings](/course-hub-docs/reference/settings/) |
| `ch_sync_state` | `key value updated_at:d` | Keys `ingest_deferred`, `sms_seen`, `tasks_last_check` |
| `ch_locks` | `key run_id expires_at:d` | Single-writer lock. Only `ingest` uses it, with a 45-minute stale timeout. |

## Enums

Data Tables don't enforce enums. The Code nodes and the MongoDB validators do.

| Field | Values |
|---|---|
| `ch_assessments.kind` | `assignment quiz lab test midterm final project presentation participation essay discussion other` |
| `ch_assessments.date_status` | `confirmed tentative ambiguous tba announced_later` |
| `ch_assessments.status` | `open done dismissed removed group` |
| `ch_plans.scope` | `1h 3h 5h day week` |
| `ch_courses.delivery` | `in_person online hybrid` or empty |

## MongoDB

A local `mongo:8.0` container (database `n8n`, app user `n8n_app` with `readWrite` on `n8n` only) replaced MongoDB Atlas on 2026-10-31. The Atlas cluster still exists but is no longer written to.

| Collection | Validator | Indexes |
|---|---|---|
| `ch_courses` | `course_code` required, pattern `^[A-Z]{4}-[0-9]{4}$`; `delivery` enum | unique `course_code` |
| `ch_assessments` | `assessment_id`, `status` required; `kind`, `date_status`, `status` enums; `weight` and `group_weight` 0–100 | unique `assessment_id`; `{course_code, kind}`; `{status, due_at}` |
| `ch_plans` | `plan_id` required; `scope` enum | unique `plan_id`; `created_at` descending |
| `ch_quiz` | none | unique `quiz_id`; `created_at` descending |
| `ch_checkins` | none | unique `checkin_id`; `date` descending |

Validators are set only when a collection is created, because `n8n_app` can't run `collMod`. Every MongoDB write continues on error so it never blocks the Data Tables write. A check node then fails the workflow if any write errored.

`bin/checkup.sh` compares the `ch_assessments` count in Data Tables with MongoDB. On 2026-10-31 both were 72.

## Next steps

- [Ingest and source precedence](/course-hub-docs/explanation/ingest/)
- [Backup and restore](/course-hub-docs/operations/backup-and-restore/)
