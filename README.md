# Tino Muzambi Portfolio

A static, recruiter-focused portfolio built with Next.js 16, React 19, strict TypeScript and Tailwind CSS v4.

The application uses local typed content and has no CMS, database, analytics script or build-time network dependency. Human-readable pages and machine-readable resources are generated from the same canonical content module.

## Requirements

- Node.js 22.13 or newer (see [`.nvmrc`](./.nvmrc))
- npm 10.9 or newer

## Local development

```sh
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No environment variables are required.

## Architecture

```text
app/                    App Router pages, metadata routes and JSON endpoints
content/portfolio.ts    Canonical, typed public portfolio content
lib/public-data.ts      Shared résumé, project and Person JSON-LD projections
public/llms.txt         Plain-text discovery guide for AI agents
types/                  Content contracts
tests/                  Content-integrity and machine-output tests
```

The visible portfolio is semantic server-rendered HTML. `/resume.json` and `/projects.json` expose the same content in stable JSON shapes; `/llms.txt` points agents to those resources. Metadata includes canonical links, Open Graph, Twitter, robots, sitemap and Person JSON-LD.

Contact is deliberately handled through a public `mailto:` path on `/contact`. This keeps delivery reliable without exposing client credentials or requiring a server-side mail account.

## Updating content

Edit [`content/portfolio.ts`](./content/portfolio.ts). Keep claims evidence-based and update `contentSnapshotDate` in [`lib/public-data.ts`](./lib/public-data.ts) when facts change. The current dataset was transcribed from the public portfolio snapshot and Tino's public project repositories on 2026-09-06.

The content tests enforce unique identifiers, safe public URLs, shared JSON projections and the intended lead-project ordering.

## Quality gate

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

GitHub Actions runs the same commands using `npm ci`. The production build is deterministic and does not need fixture flags or secrets.

## Design foundation

The reference presentation is intentionally restrained: IBM Plex Sans, a slate-and-blue technical palette, structured evidence instead of decorative cards, visible keyboard focus, reduced-motion support and print styles. The content, routes and accessibility semantics are independent of those tokens so alternate visual treatments can replace `app/globals.css` without duplicating data or weakening machine readability.
