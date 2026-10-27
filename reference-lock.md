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
