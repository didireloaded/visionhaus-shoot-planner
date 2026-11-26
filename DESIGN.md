# VisionHaus booking app: retained live design

The owner's 26 November direction supersedes the navy and paper redesign: retain the published app's light canvas, compact icon package cards, transparent logo and black navigation with a lime selection indicator. Keep the added Studio information and functional improvements. Do not introduce the rejected photo-led redesign.

## Product brief

VisionHaus Media serves brands, musicians, event organisers and equipment-hire clients in Windhoek. The three primary tasks are choosing a package, describing a custom production and requesting equipment with dates. Navigation remains Home, My Plan, Saved and Studio. Package scope and prices precede contact details at Review. Preserve the existing tokens in `public/style.css`, desktop composition and touch layout.

Keep real company-profile credits in Studio. No invented clients, awards, prices, response times or portfolio examples. Work stills remain available but are not introduced into the retained icon-based package layout. The transparent logo gains a lossless WebP source with PNG fallback.

## Interaction and accessibility

Use labelled native controls, visible focus, input text of at least 16px, reduced-motion handling and safe-area clearance. Browser Back retains draft data and walks through screen and step URLs. No personal details belong in URLs. Confirmation and summary dialogs use native modal focus containment; phone sheets add a drag handle. Offline submission preserves the request and explains that it has not been sent. Updates wait for explicit Refresh.

My Plan retains scope, equipment, extras and Review. Included package items are not billed twice. Starting estimates are not final quotations. Price-pending extras are excluded from the priced total and disclosed. Do not alter rates or the Zoho draft-only flow to suit presentation.

## Ownership

`public/app.js` initializes one shared `app` object and owns rendering and submission. Screen modules own their markup and interactions. `ui/navigation.mjs` owns URL state, `ui/pwa.mjs` owns installation/update behavior, and the worker owns server validation and durable submission limits. DOM reconciliation retains controls during same-screen selection changes; typing persists without rendering.

Motion explains tab changes and drilldowns, with no essential information dependent on it. Existing live palette and shape language take priority over example library styles. No framework or UI library is required.
