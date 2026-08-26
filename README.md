# Tino Muzambi Portfolio

[tinomuzambi.com](https://tinomuzambi.com) is Tino Muzambi's personal portfolio. It is a Next.js Pages Router application with Storyblok-managed content, animated React views, an API route for the contact form, and incremental static regeneration.

## Technology

- Next.js 16 and React 19
- Sass for component-oriented styles
- Storyblok for portfolio, profile, education, experience, and tools content
- GSAP and Framer Motion for the introduction and view transitions
- Nodemailer for contact-form delivery
- Vitest, jsdom, and Testing Library for automated tests
- ESLint with Next.js Core Web Vitals rules

The project intentionally remains on the Pages Router. `pages/index.jsx` builds the public page and revalidates it every 60 seconds, while `pages/api/email/index.js` implements the server-side contact endpoint.

## Requirements

- Node.js 22.12 or newer (see [`.nvmrc`](./.nvmrc))
- Yarn Classic 1.22.22

If Yarn is not already available, enable the package manager supplied with Node:

```sh
corepack enable
```

## Local setup

```sh
nvm use
yarn install --frozen-lockfile
cp .env.example .env.local
yarn dev
```

Open [http://localhost:3000](http://localhost:3000). Populate `.env.local` before testing CMS content or contact delivery. Local environment files are ignored by Git and must never be committed.

If the Vercel CLI is installed and the project is linked, the development environment can instead be retrieved with:

```sh
vercel env pull .env.local --environment=development
```

## Environment variables

| Name | Used by | Required for |
| --- | --- | --- |
| `REACT_APP_STORYBLOK_KEY` | `utils/fetch.js` | Portfolio project content |
| `REACT_APP_STORYBLOK_KEY2` | `utils/fetch.js` | About, education, experience, and tools content |
| `GMAIL_APP_PASSWORD` | `pages/api/email/index.js` | Contact-form email delivery (preferred; store as a sensitive value) |
| `GMAIL_PASS` | `pages/api/email/index.js` | Backward-compatible Gmail app-password fallback |
| `GMAIL_USER` | `pages/api/email/index.js` | Optional authenticated sender override |
| `CONTACT_EMAIL_TO` | `pages/api/email/index.js` | Optional contact recipient override |

Despite their historical `REACT_APP_` names, the Storyblok tokens are consumed during server-side static generation. Server credentials are read directly from `process.env`; they are not exposed through `next.config.js`.

CI sets `CMS_USE_FIXTURES=true` only for its deterministic production-build check. Normal development, preview, production, and ISR builds fail fast when credentials, collection responses, or required fields are malformed, which preserves the last successful render instead of caching invalid data. A valid empty Storyblok folder renders an empty section instead of blocking a cold deployment. Do not configure the fixture flag in Vercel.

The contact endpoint configures a 16 KiB parser limit, defensively checks declared body sizes, validates and escapes submissions, uses a honeypot, and applies a bounded best-effort rate limit to delivery attempts. Gmail authentication must use an app password, not the account password; whitespace copied from Google's grouped app-password display is removed before authentication. On Vercel, the limiter uses the platform-owned forwarded address; self-hosted development uses the socket address instead of trusting caller-supplied proxy headers. The limiter protects each warm serverless instance; use shared edge or datastore-backed rate limiting if globally durable abuse protection becomes necessary.

## Project structure

```text
components/          React views and reusable UI
data/                Animation variants
pages/               Pages Router entry points and API routes
public/              Static assets and web-app manifest
sass/                Global and component Sass partials
tests/               Vitest unit and component tests
utils/               Shared helpers and Storyblok data access
```

The home page obtains Storyblok data in `getStaticProps`, then passes normalized records through `ContentWrapper` to the selected portfolio view. Remote images are served by `next/image` and restricted to Storyblok's asset host.

## Scripts

| Command | Purpose |
| --- | --- |
| `yarn dev` | Start the local development server |
| `yarn build` | Create a production build |
| `yarn start` | Serve a completed production build |
| `yarn lint` | Run ESLint and fail on warnings |
| `yarn test` | Run the Vitest suite once |
| `yarn test:watch` | Run Vitest in watch mode |

Run the same quality gate as CI before opening a pull request:

```sh
yarn lint
yarn test
yarn build
```

Tests use jsdom and load DOM matchers plus automatic Testing Library cleanup from `tests/setup.js`. Place test files under `tests/` with a `.test.js`, `.test.jsx`, `.spec.js`, or `.spec.jsx` suffix.

## Pull requests

Keep pull requests focused and independently mergeable. Every PR should include:

- a concise problem statement and implementation summary;
- automated tests for changed behavior, or a clear explanation when a test is not applicable;
- the exact lint, test, and build commands run;
- before-and-after screenshots for visible UI changes; and
- deployment, migration, or environment-variable notes when applicable.

The GitHub Actions workflow runs dependency installation from the lockfile, linting, tests, and a production build for every pull request and every push to `main`.

## Deployment

Production is deployed on Vercel. Configure the environment variables above for the appropriate Vercel environments, link the repository, and let the Git integration create preview deployments for pull requests. Merges to the production branch trigger the production deployment.

Do not add `NODE_OPTIONS=--openssl-legacy-provider`: the current Next.js toolchain builds normally on Node.js 22.
