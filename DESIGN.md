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
