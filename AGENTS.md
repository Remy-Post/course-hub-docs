## This repo

Documentation for Course Hub (the n8n backend on Remy's Mac and the public Next.js web app). Built with Astro Starlight and published publicly on GitHub Pages.

- **Public site: never commit secrets or personal data.** No IP addresses, tokens, phone numbers, email addresses, calendar ids, Keychain values, file paths under a home folder that reveal course content, or real course data. Use placeholders such as `<vm-host>` and `<your-email>`.
- Pages live in `src/content/docs/`, sorted by Diátaxis: `tutorials/`, `how-to/`, `reference/`, `explanation/`, plus `operations/` (runbooks).
- Every factual claim should trace to a file in `~/.n8n-server` or `~/Projects/n8n-hub`. When the code changes, update the page and its `lastUpdated` date.
- Check before pushing: `pnpm build` (fails on broken internal links).

## Development

```
pnpm install
pnpm dev        # http://localhost:4321/course-hub-docs/
pnpm build      # static site in dist/, with link validation
```

Full Astro docs: https://docs.astro.build · Starlight: https://starlight.astro.build
