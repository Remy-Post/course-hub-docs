// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import starlightLinksValidator from 'starlight-links-validator';

// Published to GitHub Pages at https://remy-post.github.io/course-hub-docs/
export default defineConfig({
	site: 'https://remy-post.github.io',
	base: '/course-hub-docs',
	integrations: [
		// must come before starlight so ```mermaid blocks are handled first
		mermaid({ theme: 'neutral', autoTheme: true }),
		starlight({
			title: 'Course Hub Docs',
			description:
				'How Course Hub works, how to run it, and how to fix it: the n8n backend on a Mac and the Next.js web app on an Oracle VM.',
			lastUpdated: true,
			editLink: { baseUrl: 'https://github.com/Remy-Post/course-hub-docs/edit/main/' },
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/Remy-Post/course-hub-docs' },
			],
			plugins: [starlightLinksValidator()],
			sidebar: [
				{
					label: 'Start here',
					items: [
						{ label: 'What Course Hub is', slug: 'start-here/overview' },
						{ label: 'How these docs are organized', slug: 'start-here/how-to-use-these-docs' },
					],
				},
				{
					label: 'Tutorials',
					items: [
						{ label: 'Plan and wrap up your first day', slug: 'tutorials/plan-your-first-day' },
						{ label: 'Run the web app locally', slug: 'tutorials/run-the-web-app-locally' },
					],
				},
				{
					label: 'How-to guides',
					items: [
						{ label: 'Deploy the web app', slug: 'how-to/deploy-the-web-app' },
						{ label: 'Deploy backend workflows', slug: 'how-to/deploy-backend-workflows' },
						{ label: 'Preview a plan without writing', slug: 'how-to/preview-a-plan' },
						{ label: 'Confirm or fix a fact', slug: 'how-to/fix-a-fact' },
						{ label: 'Re-scan course files', slug: 'how-to/rescan-course-files' },
						{ label: 'Change settings', slug: 'how-to/change-settings' },
						{ label: 'Update the API contract', slug: 'how-to/update-the-api-contract' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Hub API', slug: 'reference/hub-api' },
						{ label: 'Workflows', slug: 'reference/workflows' },
						{ label: 'Data model', slug: 'reference/data-model' },
						{ label: 'Settings', slug: 'reference/settings' },
						{ label: 'Web app', slug: 'reference/web-app' },
						{ label: 'Commands', slug: 'reference/commands' },
						{ label: 'Configuration', slug: 'reference/configuration' },
						{ label: 'Dependencies', slug: 'reference/dependencies' },
					],
				},
				{
					label: 'Explanation',
					items: [
						{ label: 'Architecture', slug: 'explanation/architecture' },
						{ label: 'Ingest and source precedence', slug: 'explanation/ingest' },
						{ label: 'How the planner works', slug: 'explanation/planner' },
						{ label: 'Security model', slug: 'explanation/security-model' },
						{ label: 'Design decisions', slug: 'explanation/design-decisions' },
					],
				},
				{
					label: 'Operations',
					items: [
						{ label: 'Runbook index', slug: 'operations' },
						{ label: 'Health checks', slug: 'operations/health-checks' },
						{ label: 'Site shows stale data', slug: 'operations/mac-offline' },
						{ label: 'Web deploy failed', slug: 'operations/web-deploy-failed' },
						{ label: 'Plan wrote nothing', slug: 'operations/plan-wrote-nothing' },
						{ label: 'AI scan is waiting', slug: 'operations/ai-waiting-for-memory' },
						{ label: 'Backup and restore', slug: 'operations/backup-and-restore' },
					],
				},
				{
					label: 'Project',
					items: [
						{ label: 'Known issues', slug: 'project/known-issues' },
						{ label: 'Glossary', slug: 'project/glossary' },
						{ label: 'Writing these docs', slug: 'project/writing-these-docs' },
					],
				},
			],
		}),
	],
});
