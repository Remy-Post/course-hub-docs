---
title: Writing these docs
description: The style guide, page templates and review checklist for these docs, and the community documentation skills they're based on.
---

Use this page when you add or change a page. It sets the rules that keep the docs consistent and correct.

## Where these rules come from

The rules combine the common ground of the five most popular community documentation skills for AI agents, checked on 2026-10-31:

| Skill | Repository | Popularity signal | What it contributes |
|---|---|---|---|
| `doc-coauthoring` | `anthropics/skills` | about 186k repo stars | Gather context first, build section by section, test with a reader who has no context |
| `documentation-writer` | `github/awesome-copilot` | about 41k repo stars | Diátaxis: tutorial, how-to, reference, explanation. Outline before drafting. |
| `documentation` | `anthropics/knowledge-work-plugins` | about 34k repo stars, about 7.7k installs | Required sections for READMEs, API docs, runbooks, architecture docs and onboarding guides |
| `docs-writer` | `tech-leads-club/agent-skills` | about 7k repo stars | Read the code first. A detailed style guide. Verify every link. |
| `docs-writer` | `philschmid/ia-agents` | Small repo, widely re-listed | The first-scroll rule, progressive disclosure, honest limitations |

What all of them share:

1. Know the reader and what they need before writing.
2. Pick the page type first, and let it set the structure.
3. Base every claim on the code or the running system.
4. Put the most useful content first.
5. Show commands and examples rather than describing them.
6. Write in active voice, second person, present tense.
7. Keep sentences short, with one idea each.
8. End every page with a verify step or next steps.
9. State limitations and trade-offs openly.
10. Treat outdated docs as bugs, and check links on every change.

## Page types and templates

| Type | Folder | Required structure |
|---|---|---|
| Tutorial | `tutorials/` | What you'll do → Prerequisites → numbered Steps, each with Verify → What you learned → Next steps |
| How-to | `how-to/` | One sentence on the goal → Before you start → Steps → Verify → Next steps |
| Reference | `reference/` | One sentence on scope → Source file → tables. No narrative, no opinions. |
| Explanation | `explanation/` | Context → how it works (with a diagram if it helps) → trade-offs or limitations → Next steps |
| Runbook | `operations/` | When to use → Prerequisites → Check → Fix → Verify → Roll back → Escalate |

## Style rules

- **Voice.** "You", present tense, active voice: "The planner writes the blocks", not "The blocks are written".
- **Sentences.** Under about 25 words, one idea per paragraph. Lead each section with its point.
- **Headings.** Sentence case. Use headings to make the page scannable.
- **Steps.** A numbered list only for steps in order. Start each step with a verb. Put any condition before the instruction: "If the preview shows a conflict, choose…".
- **Words.** Use "must" for requirements and "we recommend" for advice; avoid a vague "should". Don't use "please", "simply", "just" or "easy". Write "for example" instead of "e.g.". Spell out an abbreviation the first time.
- **Examples.** Use real names (`COMP-1234`, `study_default`), never "foo" or "bar".
- **Code.** Every code block has a language tag. Commands must be copy-and-paste runnable.
- **Callouts.** `:::note` for useful context, `:::tip` for shortcuts, `:::caution` for something that can go wrong, `:::danger` for data loss or a security risk.
- **Links.** Descriptive link text, never "click here". Use site-absolute paths starting with `/course-hub-docs/`.
- **Tables.** Short cells, under about 15 words.

## Public-safety rules

This site is public. Never include:

- secrets, tokens, keys or Keychain values;
- IP addresses, real hostnames of the hub, tunnel ids or webhook path ids;
- phone numbers, email addresses, calendar ids or task-list ids;
- real course codes, the school's name, or course content.

Use the placeholders from [How these docs are organized](/course-hub-docs/start-here/how-to-use-these-docs/#placeholders-for-private-values).

## Review checklist

Check every changed page before you push.

**Scope and reader**
- [ ] The page is one type, and it's in that type's folder.
- [ ] The first screen says what the page is for.

**Accuracy**
- [ ] Every fact was checked against the code or the live system. Name the source file for reference pages.
- [ ] Commands, versions and field names were copied, not typed from memory.
- [ ] Limitations are stated.

**Structure and style**
- [ ] The required sections for the type are present.
- [ ] Active voice, short sentences, no banned words.
- [ ] The page ends with Verify or Next steps.

**Safety and links**
- [ ] Nothing from the public-safety list is on the page.
- [ ] `pnpm build` passes. The link validator fails the build on broken internal links.
- [ ] The sidebar in `astro.config.mjs` includes any new page.

**Final pass**
- [ ] Read the whole page once more, start to finish, and remove anything that doesn't help the reader.
- [ ] Test it on a fresh reader: give only the page to someone, or to an AI with no context, and ask the questions a reader would ask.

## Keep the docs current

When a change in `build.py`, `planner-core.js`, `stack/` or the web app changes behavior, update the matching page in the same piece of work. If you find a mismatch you can't fix now, add it to [Known issues](/course-hub-docs/project/known-issues/).

## Develop locally

```bash
pnpm install
pnpm dev     # http://localhost:4321/course-hub-docs/
pnpm build   # static site in dist/, with link validation
```

Pushing to `main` publishes the site to GitHub Pages through `.github/workflows/deploy.yml`.

## Next steps

- [How these docs are organized](/course-hub-docs/start-here/how-to-use-these-docs/)
