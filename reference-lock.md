# iOS PWA reference lock

Primary: https://dribbble.com/shots/27654880-Travel-Booking-App-Mobile-UI-UX-Design
Preserve cool near-white canvas, strong service photography, compact headings, pill controls, four bottom tabs and blue primary booking actions.

Secondary: https://dribbble.com/shots/27747040-Travel-Booking-App-Mobile-UI
Borrow compact selection chips and rounded detail-sheet composition.

Secondary: https://dribbble.com/shots/27784544-Flight-Reservation-App-Mobile-UI
Borrow grouped booking summary. Do not copy its dark canvas or serif typography.

Secondary: https://dribbble.com/shots/26929035-Doctor-Appointment-Booking-App-Healthcare-Mobile-app
Borrow compact icon-led settings and detail hierarchy. Do not copy testimonials, practitioner claims or medical content.

Owner constraints: no emojis, use Lucide icons, no editorial look or oversized headings, minimal reading. PWA with iOS-style behaviour, adapted desktop layout.

Imagery: representative Unsplash photographs, downloaded locally. Not VisionHaus portfolio work. Sources: photo-1492684223066-81342ee5ff30, photo-1478737270239-2f02b77fc618, photo-1492619375914-88005aa9e8fb, photo-1542038784456-1ea8e935640e.

Lucide assets: runtime-provided lucide package, local UMD bundle, included license. No CDN dependency for icons.

Rates remain illustrative. No live submission, email, payments, availability or Zoho integration.

## Verification

- Reviewed all four user-supplied references in the browser, including the primary shot at full image size.
- Desktop and embedded 390px / 320px viewport render checks completed.
- 320px viewport had no horizontal document overflow (305px client and content width after scrollbar).
- Explored a service, opened its details, configured podcast scope, added an extra and completed the demo brief.
- Saved a podcast service and verified it appeared in Saved.
- Confirmed native mobile estimate disclosure opens and exposes the production summary.
- Fixed an overbroad navigation selector that bound to the body's view attribute and reset expanded state on click.
- Existing domain tests passed for pricing changes, removals, dependency resets and invalid draft restoration.
- No real-device installation, keyboard or offline certification is claimed.

## Home simplification · 27 October 2026

Owner selected Evergo service list, Dev Design category choices and Purrweb rounded iOS controls from the latest reference set. This supersedes the photo-feed home direction, while retaining service detail and builder behaviour.

Home now contains four icon-led rows and an optional resume-draft action. Search, filters and the 17-item photo catalogue are removed from the home screen. Category selection reveals a compact project list. Explore always returns to the four-choice home. Lucide icons remain throughout.

Validated 320px and 390px browser viewport renders, no horizontal overflow at 320px, category-to-podcast navigation, builder entry, retained draft and Explore return. Domain checks continue to pass. No backend changes.

## Animated app redesign · 27 October 2026

Direct build from the three owner-selected sources. Evergo owns the quiet four-category entry; Dev Design supplies large icon choices; Purrweb supplies rounded iOS controls. Keep the previously selected cool white canvas and blue action role. Home becomes a two-by-two choice surface, not a catalogue feed. Each tile is a navigation target; no nested cards or marketing content.

Decision ledger: compact system type from the iOS brief; 26px home title, 15px service names; white canvas and grouped pale-blue service surface; blue only for navigation, selection and primary actions. Local Lucide line icons are functional service labels. No new decorative imagery. Existing service photography retained on detail screens.

Motion: 120ms press feedback, 200ms estimate and option state changes, 280ms scene entry. Animate route/section changes only, never every render or typed character. Native disclosure gets a 200ms reveal. Reduced-motion suppresses spatial movement and animation. No new dependency, no auto-looping decoration.

V5 validation: JavaScript syntax and existing pricing/domain tests passed. Browser reviewed home at embedded 320px and 390px widths and desktop entry; navigated Video > Podcast > Build, changed people from 2 to 3 and observed estimate change from N$9,700 to N$9,950. No physical-device verification claimed.
