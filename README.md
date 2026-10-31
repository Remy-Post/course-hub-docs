# Course Hub Docs

Documentation for **Course Hub**, a personal study planner: an n8n backend with local AI on a Mac, and a Next.js web app on an Oracle Cloud VM.

**Read it:** https://remy-post.github.io/course-hub-docs/

## What's inside

| Section | For |
|---|---|
| Tutorials | Learning by doing: your first plan, running the web app locally |
| How-to guides | One task each: deploying, previewing a plan, fixing a fact, settings |
| Reference | Every API endpoint, workflow, table, setting, command and dependency |
| Explanation | Architecture, ingest rules, the planner, security, design decisions |
| Operations | Runbooks for when something breaks |

## Develop

Requires Node 22 or later and pnpm.

```bash
pnpm install
pnpm dev     # http://localhost:4321/course-hub-docs/
pnpm build   # fails on broken internal links
```

Pushing to `main` publishes the site with GitHub Actions.

## Contributing

Read [Writing these docs](https://remy-post.github.io/course-hub-docs/project/writing-these-docs/) first. It has the style guide, page templates, public-safety rules and the review checklist.

Built with [Astro Starlight](https://starlight.astro.build).
