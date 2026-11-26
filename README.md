# VisionHaus booking app

A booking and quotation request app for VisionHaus Media in Windhoek. Clients choose a package, plan a production from a brief or request equipment hire. VisionHaus reviews the resulting Zoho draft before sending a quotation. The app does not confirm reservations or create invoices.

## Run locally

Use Node.js 24 or newer and npm.

```sh
npm ci
npm run build
npm run dev
```

Open http://localhost:4173/. Run `npm run build` again after source changes, then restart the preview. Set `PORT` if that port is occupied. Local settings belong in ignored `.env.local` files.

```sh
npm test
```

Tests include a fresh production build, route and asset checks, SQL-backed submission limits and quotation calculations. They use synthetic fixtures and do not contact real clients.

## Configuration

The app loads without secrets. Submitting without D1 and a configured delivery path returns 503 and preserves the draft. Brief analysis without a provider key also returns 503.

Runtime names, with no values:

- `WEB3FORM_ACCESS_KEY`
- `GOOGLE_API_KEY`
- `OPENAI_API_KEY` (the older local alias `OPEN_AI_API_KEY` is accepted)
- `ZOHO_CLIENT_ID`
- `ZOHO_CLIENT_SECRET`
- `ZOHO_ORGANIZATION_ID`
- `ZOHO_TOKEN_KEY`
- `ZOHO_SETUP_KEY`
- `ZOHO_SALES_VAT_ID`

D1 binding: `DB`. Apply the existing schema-only migrations in `drizzle/` to an isolated preview database before testing a configured integration. See [ZOHO.md](ZOHO.md) for OAuth and recovery. Do not connect a local preview to the live database for routine UI checks.

## Structure and deployment

- `public/app.js`: startup, navigation, shared event wiring and submission coordination.
- `public/ui/`: screen renderers, brief and rental interactions, shared helpers, device storage and one browser state object.
- `public/domain.mjs` and `public/rentals.mjs`: approved catalogue and calculations.
- `worker/`: request validation, brief analysis, Zoho integration and D1 submission limits.
- `scripts/build.mjs`: esbuild bundles the Worker using real imports and exports.
- `DESIGN.md`: current visual direction. `anti-slop/`: dated audits.

`dist/` is generated and ignored. Build during deployment, then package `dist/server/index.js` and `.openai/hosting.json` with the Sites publishing workflow. Source commits do not need generated output. Preserve the `DB` binding and migrations.

The current Sites manifest uses a Worker with D1. Its documented packaging contract does not expose an `ASSETS` binding alongside that Worker; static-only mode forbids D1. This build therefore retains a self-contained Worker with gzip-compressed public assets. Responses decompress those assets and preserve the existing headers. No CDN, storage account or hosting migration was added. Static assets can move to file hosting when a supported binding is available.

The service-worker cache version is derived from sorted asset paths and bytes. Its shell list includes all browser modules so the module split does not break offline reloads. Submission still requires a connection; offline mode does not accept requests.

Lucide path geometry is retained in `public/icons.mjs`, under the notice in `public/vendor/LUCIDE-LICENSE`. Only the icons used by this UI are shipped.
