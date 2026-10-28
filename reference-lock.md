# VisionHaus packages and custom production · V6

Primary target supplied by owner: Ronas IT Healthcare Telemedicine Mobile App Design
https://dribbble.com/shots/27059975-Healthcare-Telemedicine-Mobile-App-Design
Observed the full image in browser. Preserve compact app header, light canvas, soft grouped controls, photo-led browse content and decisive black pill actions. Adapt medical categories to production packages. Do not copy medical illustrations, purple branding, premium upsells or serif text: these conflict with the owner's production brand / no-editorial direction.

Secondary supplied target:
https://www.behance.net/gallery/252018337/Smart-Travel-Mobile-App-UIUX-Design
Unavailable through search retrieval and direct content fetch (403). Not visually reviewed. No implementation claim is based on unseen Behance content.

## Decision ledger

- Home content: owner's explicit six-package request. Six photo-led offers with starting prices; no equipment/configuration form on Home. Two columns on phone and three on desktop, with compact category chips.
- Navigation: Home owns fixed packages; My Plan owns the separate custom scope builder. Saved owns package favourites; Studio has contact and draft controls.
- Canvas #f5f6f8, surface white, text #191b20, primary action #1a1c21: from healthcare reference's light surfaces and black actions. Blue #396dce is restricted to selected controls and functional kit/status accents, preserving owner constraints against purple/neon.
- Typography: compact system sans, 25–28px titles, 13–16px core controls. No editorial serif or oversized marketing headings.
- Photos: retained representative local Unsplash assets, not presented as VisionHaus portfolio images. Photos label packages, no decorative AI artwork.
- Motion: 120ms control feedback, 200ms disclosures, 240ms screen entry. Price changes animate only the price. Reduced-motion disables motion.
- Scope rules: solo locks speaker count to one, conversation/full coverage permits two to four speakers. Episodes 1–17. Episodes/day derives ceil(episodes/perDay), and time checks flag overfull recording days. Full-event recording and short highlights are separate outputs. Setup derives cameras, operators, tripods and audio, then adds only relevant toggles and extras.
- Pricing: rate card read from current VisionHaus_RateCard_2026.pdf in Library. Photography half-day6500/full-day11500, editing950/hour min2 or5500/day, videographer3500/hour min3 or11500/day, event12500/premium24500. Reel/music/podcast starting tiers come from owner-supplied conversation pricing. All remain starting estimates pending quotation. Unpriced crew, kit, edit scope and extras are flagged instead of assigned fabricated prices. Package inclusions are never billed twice.
- Equipment inventory: rate card identifies one FX3 and tripod plus RØDE, H5, Sigma lenses, Sirui, softboxes, GoPros, filters and matte box. Multi-camera requests are not advertised as guaranteed owned inventory; extra equipment is sourced/confirmed. No fake live availability.
- Submission: no server email service exists. A validated review opens a mail composer addressed to the rate-card contact info@visionhausmedia.com.na, containing the complete request. Completion explicitly says sending must finish in email and cannot be confirmed here. Plain-text download is available. No silent claim of automatic submission, saved server records or confirmed booking.

## Validation
- JavaScript syntax and domain tests passed. Tests cover solo constraints, all 17 episodes, six days at three episodes/day, package multiplication, derived operators/tripods, service-specific extras, event output and complete brief text.
- Browser checked desktop home and embedded 390px and 320px views. At 320px, both content and client width were 305px after the browser scrollbar.
- Exercised My Plan > Video > Podcast > solo > 17 episodes (increment disabled), two/day > full coverage > Setup (three cameras/operators/tripods) > Extras > complete Review.
- Exercised ready-made podcast > three cameras > package Details > Extras and confirmed N$11,000 starting estimate. Included items remain in a single package price line.
- Email provider is not connected. No test email sent, no claim of server delivery. No real mobile installation certification.

## V7 · Built from the inspected references

Now visually inspected all supplied Behance image URLs, including b8a242252018337.6a44f4304f4ea.png, and the full Dribbble composition. This supersedes the unavailable-Behance limitation above.

Behance is dominant for home/detail: compact greeting and round actions; two-line rounded sans heading with a restrained yellow-green highlight; horizontal icon category pills; vertically stacked white-framed photo cards with slim name/price strips; floating black navigation with active icon/label capsule. No generic two-column catalogue or large equipment banner. Grey-white canvas, photo cards preserve media role, and the black navigation remains visually distinct. The accent #e3ef8c reflects the selected Behance example, replacing previous blue-only home direction. Dribbble owns booking date strip, rounded option pills and compact setup surfaces, using muted periwinkle selection.

Functional changes: seven-day preferred date strip mirrors the native date field and retains date selection for any later date. Header search action jumps to packages. Existing package/custom/pricing rules unchanged. Package and builder screens use their own back/header composition.

Verification: syntax and domain checks passed; browser inspected 390px and 320px home. Opened podcast package, entered booking, selected Thu29 and observed date field2026-10-29 and selected pill in rendered UI. No server email changes.

## V8 · Rentals and service catalogue

Home now has Packages / Rentals, with six production offers retained. Rentals has 20 entries copied from the current rate card, category filters, half-day/daily/weekly selector, bounded quantities and a separate kit/date/review flow. Published equipment quantities are not live availability. Modifiers exclude fixtures. Bundle dependencies remove separately selected FX3/lens/matte-box/ND/tripod, modifier components or single GoPros included in a five-pack. Selecting a bundle cannot reserve beyond the shared published inventory.

Pricing assumptions made explicit in UI: daily dates count inclusively; half-day up to4 hours requires same-date return; weekly minimum5 days uses full seven-day blocks with part-used final blocks billed as a block. Delivery, deposit and insurance are excluded and subject to approval. Rental drafts expire locally after7 days; no server reservation or payment. Validated request opens email app, with download fallback and no false sent confirmation.

Services added inside existing categories: birthday reel, club-night video, monthly content, livestreaming, brand commercial, crew hire, nightlife photography, colour grading, sound cleanup/mixing. Unknown rates show Quote required, including request exports. Published corporate, commercial, brand commercial, nightlife and event-photo package prices have dedicated pricing lines rather than generic crew-day substitutes. Photographer crew/day remains distinct from photo packages. No extra Home cards.

Validation: syntax checks and both domain/rental suites passed. Rental tests cover all20 entries, quantities, bundle exclusions, invalid dates, half-day restrictions, weekly blocks, delivery address requirements, restoration and quote-only services. Browser checked390/320px rental views, category filter, FX3 then bundle replacement, dates Nov1–2 yielding N$9,600, review and required contact validation. 320px content and client widths both305px after scrollbar. No email sent during verification.

## V9 · Client-requested icon UI and concise catalogue

Owner supplied Vision_Haus_Media_Full_Service_Catalogue(1).md, read from attached workspace file. Selected a limited subset, not the suggested ten-category/full-list expansion. Added product video, documentary, tourism/hospitality film, property/fashion photography and photo editing/retouching as quote-only choices. Existing primary four production categories remain; My Plan defaults visibly to Video with8 common projects in a two-column grid. Remaining projects are behind More project options. Excluded VFX, green-screen production/compositing, video restoration/enhancement, DCP and FPV. Rentals remain limited to confirmed rate-card inventory.

All stock package/detail/saved photography removed from UI and source asset files. Six Home packages use compact Lucide icon rows, one title, one short description, price and save control. Kept owner's approved Packages/Rentals switch, brand and discovery copy. Renamed All to All packages. Detail screens use matching service icon and scope controls. Rentals keep their existing icon list.

Contact: didi@visionhausmedia.com.na in Studio and both production/rental email composers; added https://visionhausmedia.com.na/ website link. No outgoing mail sent during testing.

Brief capture: home and builder entry accepts a brief up to6000 characters and service category, then carries it into the custom plan's notes. It does not infer requirements or call AI. The UI's expandable explanation explicitly identifies AI planning as not connected. An actual model integration requires server-side credentials and a model service. Intended boundary: model suggests structured scope/crew/kit/schedule; deterministic approved pricing calculates known amounts, flags unknown rates and leaves availability for review. No invented AI results, server persistence or quote certainty.

Validation: syntax and existing domain/rental tests passed. Browser reviewed320/390px icon home and populated My Plan grid. Brief 'A four-person podcast with three cameras and six episodes.' survived category/project selection into Extras notes.320px content/client both305px after scrollbar. Studio contact/email/website verified in browser.

## V10 · Direct server-side request submission

Replaced production and rental mail-composer handoffs with same-origin POST /api/requests, pending states, inline recoverable errors and success reference only after email-provider acceptance. Migrated static source from dist to public; custom dependency-free Worker ESM embeds all public assets. Site identity/audience unchanged.

Email handler fixes destination to didi@visionhausmedia.com.na and sets reply_to to the validated client email. Server validates inputs and restores/recalculates the approved production/rental brief. Client totals and recipient overrides are ignored. JSON/body limits, origin checks, bounded per-worker abuse guard, provider timeout and Resend idempotency header included. The abuse guard is per instance, not a shared/global rate limiter. No live availability, payment or durable inbox database is claimed.

Required runtime secrets: RESEND_API_KEY and EMAIL_FROM (verified sender). Sites environment was empty during implementation. Without these the endpoint returns503, leaves the draft intact and never shows submitted. No real email-provider send or inbox delivery has been verified. Live delivery remains blocked until provider configuration.

Tests cover origin, contact and rental validation, server pricing, fixed recipient, Reply-To, idempotency, rate guard, missing configuration, provider failures and success through a mock. Browser exercised Submit on a production request, received the unconfigured-service error without opening an email app, and retained entered name/email and configuration. No real email was sent.


## V11 · Web3Forms submission

Replaced Resend with Web3Forms using the existing WEB3FORM_ACCESS_KEY runtime setting. The key is a public form identifier bound in Web3Forms to the receiving inbox; it is not a secret API token. Free-plan Web3Forms submissions must originate in the browser. The same-origin endpoint validates inputs and recalculates the approved brief, then returns prepared form fields. The browser posts these to the fixed Web3Forms endpoint, stays inside the app, and only completes after an HTTP success with success === true. Client-supplied recipient/subject/total overrides are ignored during preparation. The email field supplies Reply-To. Server guards and draft retention remain.

Web3Forms does not offer the previous Resend idempotency guarantee: retries retain the same reference for recognition but may generate duplicate emails, especially after an uncertain network result. Prepared browser fields can be modified by a caller, so emailed requests and estimates remain subject to studio review. No durable booking, payment or confirmed reservation is created.
