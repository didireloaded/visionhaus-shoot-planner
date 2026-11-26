# VisionHaus booking app: design direction

Source: the 2026 company profile (`assets/visionhaus/visionhaus-company-profile.pdf`). The app should read as part of the same brand.

Design Read: a booking and quotation app for brands, artists and event organisers, in the company-profile language (warm paper pages, navy panels, one blue accent, heavy two-line headlines). Dial: ENERGY 2 / RHYTHM 2 / MOTION 1.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#f6f3ec` | Page background, from the profile pages |
| `--navy` | `#082744` | Text, primary buttons, header, price docks, summary panel |
| `--accent` | `#0b6fa8` | Accent on light surfaces: headline second line, links, selection marks. 4.9:1 on paper |
| `--accent-on-navy` | `#1fa4e7` | The profile's brand blue. Only on navy (5.4:1). It fails on paper (2.5:1) |
| `--muted` | `#55606e` | Secondary text. 5.8:1 on paper |

One accent. Selected options are solid navy, so the blue stays rare enough to mean "act here" or "you are here".

## Type

Platform sans (SF, Segoe, Roboto) at weight 800 for headlines, matching the profile's heavy grotesk without a font download. Minimum text size 12px; body 15px.

## Shape

Panels 16px radius, cards 12px, controls 10px. Only the filter chips are fully round.

## Imagery

Package photos are stills from VisionHaus productions, cropped from the company profile into `public/work/`. The profile pages are flattened images, so some stills are small (about 550px wide). Replace them with original exports when available, same file names.

## Motion

Feedback only: colour transitions on controls, a slight photo zoom on hover, a settle animation on the confirmation tick. Everything is off under `prefers-reduced-motion`.

## Rules for changes

- No new colours outside the tokens in `public/style.css`.
- No em dashes, generic calls to action or invented claims in UI text.
- Client names, credits and awards must come from the company profile or the owner.

## Product and interaction brief

Audience: brands, artists and event organisers requesting production in Windhoek, plus approved equipment-hire clients. Primary tasks: choose a priced package, describe a custom production and request kit with dates. Navigation: Packages, My Plan, Saved and Studio. Contact details appear at Review; prices and unresolved scope stay visible before submission.

The production profile remains the visual reference. Keep photo-led package browsing, the profile's two-line headline and navy summary panels. Phone navigation docks to the bottom with content clearance; desktop navigation stays in the header. Use labelled controls, visible focus, readable text and reduced-motion support. Preserve loading, validation, failed-submit and confirmed-draft states. Do not add splash screens, decorative icon tiles or invented portfolio content.

My Plan keeps scope, equipment, extras and Review as distinct steps. A package's included items are not billed a second time. A starting estimate is not a final quotation. Extras awaiting review are disclosed and excluded from the priced total. Multi-camera requests do not promise owned or available inventory. See the domain modules and tests for the approved rates, rather than duplicating them in design notes.

## Browser module boundaries

`public/app.js` initializes one `app` state object and owns root navigation, rendering and submission. Screen modules import that state; they do not keep competing copies. Brief and rental modules own their screen interactions. Shared helpers provide escaped text and the small SVG icon set. Tests import those functions directly without parsing source text.

The images in `public/work/` remain unchanged. No higher-resolution source files were supplied for this refactor. The Podcasts card intentionally describes its image as a filmed interview in alt text; it is not presented as a podcast recording. Replace it only with an owner-supplied original.
