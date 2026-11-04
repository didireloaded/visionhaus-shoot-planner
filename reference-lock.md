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


## V12 · Original-project review and careful refinement

Reviewed the original Build Booking System history and all five pages of VisionHaus_RateCard_2026.pdf in the owner’s ChatGPT Library on 28 October 2026. Preserved the approved six package families, icon-led home, separate Rentals route, no-signup flow, all published amounts and quantity limits. Web3Forms recipient was changed to the verified didi@visionhausmedia.com.na address in its dashboard and confirmed after reload.

Shared calendar validation now rejects impossible dates and past production dates in both client and Worker; malformed service names return validation errors instead of crashing restoration. Date strip uses Windhoek calendar days independent of the visitor’s timezone. Request briefs now include the selected setting, custom finished runtime and non-podcast location hours. Reel/music package settings follow Outdoor/Indoor/Both. Podcast package inclusions reflect the chosen episode count. Crew hire no longer shows unrelated video-outcome questions. The production confirmation states the rate-card 50% deposit requirement.

Design lock remains V9’s compact Lucide icon lists, system sans, light canvas, periwinkle selected controls, lime primary package actions and floating black tabs. Refinements darken selected-state text, increase small-screen helper text, expand save/rental touch targets and use 16px mobile input text to avoid iOS focus zoom. No new visual direction, stock imagery or top-level feature was added. Refero live research was unavailable; original owner-approved references and bundled craft guidance grounded this bounded pass.

Pricing decisions held for owner clarification: travel 25–50 km, corporate standard/premium scope selection, crew-specific billing and kit inclusions, and paid-media buyouts (25–75%). Keep these in formal quote review rather than inventing charges. AI planning, Zoho quotations, automatic customer email copies, live availability and payments remain future integrations.

## V13 · Recovered original package pricing source

Located the complete “Rate card creation assistance” chat at https://chatgpt.com/c/6a511bc2-d264-83ea-8641-772a326e15af. Owner's 10 July 2026 instruction sets reels at 1,800/2,500/3,500 tax inclusive with 3/6/7 hours and 3/4/5 revisions; reel overrun is 250/hour. On 22 July the owner fixes music-video scope at outdoor 3 hours/2 locations/2 revisions, indoor 6 hours/3 revisions, both full production/6 revisions, with 550/hour overrun. On 13 August the owner updates music-video prices to 6,800/9,500/15,000 and above. On 6 October the owner explicitly updates podcasts to 6,000/8,500/11,000 per episode. The original card says tax inclusive; podcast priority/next-day editing at 1,500 per episode was directly requested on 25 August. Latest card states a standard episode up to 30 minutes.

Preserved base amounts; corrected package tax labels, added source-backed overrun disclosures without precharging future overtime, wired podcast priority editing into shared pricing and Worker brief recalculation, and defaulted new podcast requests to 30 minutes with longer episodes flagged for review. Podcast basic titles/motion graphics are included; extra graphics means work beyond those inclusions.

10-episode discounts 50,000/72,000/95,000 were assistant suggestions after the October increase, not an explicit owner-approved rule; do not silently apply. Earlier 20,000/10-episode deal predates the new per-episode rates and needs owner resolution. Influencer reels were requested but remain absent; the 3,500 influencer tier has ambiguous scope. Posting/scheduling fees remain unconfirmed.

Read /Users/visionhaus/Downloads/Vision_Haus_Media_Full_Service_Catalogue.md and original Production Services List chat. The app contains 38 category/project choices (some repeat across categories), not the entire master catalogue. Preserve the earlier selective implementation until owner confirms further services, availability and prices. Do not claim free-form notes constitute a separately implemented service. Confirmed rental inventory remains the 20 entries in the 2026 card.

Additional sources checked: 2024 Didi Reloaded Social Media Pricelist (historic, conflicting figures), 2024 Didi Reloaded Films Production Rate Card (historic crew/rental/editing figures), and VISIONHAUS X RELOADED STUDIOS RATE CARD Google Doc (explicitly MOCK PRICES; never use as approved production pricing). See outputs pricing checklist for details.


## V14 · Official VisionHaus identity

Replaced the fabricated vh. header/Studio placeholder and hand-drawn favicon with the actual transparent logo from https://visionhausmedia.com.na/assets/assets/logo-cream.6c76e5522dc6dab4724431e22b878d27.png and official lens favicon from https://visionhausmedia.com.na/favicon.ico. Original logo artwork is stored unchanged in public/visionhaus-logo.png. Header/Studio display the cream artwork on charcoal with object-fit:contain; no logo redrawing or recolouring. App icons are aspect-preserving, padded raster exports from that artwork. Header text can truncate on small widths to preserve action targets. Service-worker cache bumped so the updated artwork is available offline.


## V15 · Logo without black backing

Owner requested removal of the black logo background. Header and Studio now display the original transparent official artwork with a dark CSS treatment directly on the light app canvas, without a backing tile. App icon exports also use dark artwork on the light canvas. Original artwork remains unchanged.


## V19 · Owner pricing decisions, 29 October 2026

Owner supplied Birthday reels indoor 2500/outdoor 1800; Product video indoor from3500/outdoor from2000 (complex lighting/set design quoted); Documentary from20000 including camera gear; Tourism/hospitality from9000; Livestreaming from25000; Property and Fashion photography2000/hour (Fashion mapping explicitly confirmed); grading series7000/episode and once-off/film12000; sound once-off5000 or7000/episode; base photo retouching1800 with scope/image count confirmed; interview from4500; testimonial3500; conference video15000; wedding film from25000; property video5500. Combined event/conference15000 video+15000 photo; combined brand content5000 video+5000 photo.

Conference cutdowns2000 EACH, captions1800/request, non-podcast rush2000/request, extra retouch250/image. Source footage/drive costs remain individually quoted. Owner clarified new prices are EX VAT, and motion graphics plus setup P027–P035 are1800 PER SHOOT. Quantities for cutdowns/retouched images and episode pricing are restored/validated server-side. Ordinary new custom projects default to one camera, extra cameras are separately selected and priced beyond inclusions. Existing event-premium live editor/drone and included cameras are not double billed. Existing tax-inclusive reel/music/podcast bases and1500/episode podcast priority remain intact.

Authoritative attached VisionHaus_Monthly_Content_Retainers_2026.pdf sets Essential10000/6hours, Growth25000/16hours, Professional40000/28hours, Media Partner65000/45hours per month EX VAT. Added a tier selector under Monthly content, no new Home cards. Capacity guides are not cumulative deliverable promises. Minimum3months, monthly advance payment, event hours within allocation, up to20% UNUSED hours rollover one month only, travel within25km central Windhoek and organic social/website rights; full original PDF available from the retainer scope. Inquiry only, no automatic recurring charge or contract.

VAT calculation now shows net/VAT/gross and applies the existing organisation Sales VAT15% ID (server secret ZOHO_SALES_VAT_ID, source verified in owner's Quote.csv export). Each Zoho create validates the configured ID/percentage using settings READ. Tax-inclusive package prices are converted to net only for mixed-basis estimates, preserving gross package amounts without double VAT. Existing historic quotations are untouched. Raw brief/long references remain the previous implementation; quotation formatting/client details changes were studied separately and are not part of this price update.

Full-event recording is still quote-only: the prior reviewed card confirms12500/24500 EVENT HIGHLIGHTS, not a distinct full-event-recording price. Birthday/product Both setting has no invented combined rate. Influencer tiers/posting fees remain unconfirmed; historical deals are not imported. New rate amounts are starting estimates where scope is variable.


## V20 · Clear price-on-review extras

Owner found selecting cutdowns/source footage appeared free. Kept existing selection and pricing rules: conference cutdowns remain2000 each; other cutdowns and source-footage costs stay job-specific. Unselected badges now say Price on review, selected badges Price pending. Selecting displays an immediate explanation in the row, with footage/storage-specific detail, and summaries/review/brief state these requests are excluded from the displayed total and priced after discussion. No modal, invented charge or extra approval step. Checked draft restoration retains the selected extras.


## V21 · Interaction polish and subtle motion

Locked target: existing compact light VisionHaus interface, per owner request to optimise and add subtle animation. Refero bundled motion.md anchors: functional feedback/continuity, 120–220ms, 2–6px movement, opacity/transform only, reduced-motion respected. Preserve all layouts, approved prices, quote behaviour and content.

Native Web Animations handle step/filter/rental transitions and changed totals; the selection check gets a short scale settle. CSS adds restrained hover, pending-explanation entry and completion feedback. No looping hero, animation library, artificial loading delay or flow gate. Reduced-motion users receive no added motion, and existing CSS overrides remain. Cache static header/nav/control markup and initialise Lucide only inside changed regions; busy-state transitions still remount controls to restore enabled state. Avoid unchanged localStorage draft writes, retaining real-change timestamps and storage error handling.


## V22 · Sliding glass navigation highlight

Owner requested the active Home/My Plan/Saved/Studio pill to slide between tabs with a liquid-glass feel. Preserve the compact black floating bar, lime selection and expanding selected label. Keep a single highlight and stable navigation buttons; animate its visible position and width over300ms, settle icon positions over240ms, add restrained translucent sheen/inner highlight. Rapid presses cancel rather than queue previous animation, resize remeasures alignment, first load and reduced motion update immediately. Existing button semantics/aria-current, visible keyboard focus and busy disabling are retained. No glass redesign elsewhere, libraries or price/booking changes.

## V23 — quotation mapping, same-day edits and working briefs (4 November 2026)
- New company/person fields and optional billing address; draft-only Zoho flow retained. Shared D1 sequence for short references, with retry/historic reference stability. Scope in line descriptions; internal brief stays in D1/email. Organisation PDF template/contact visibility still needs live visual verification.
- Reel same-day surcharges: outdoor N$600, indoor N$1,000, both N$1,500 ex VAT under the owner’s prior new-price instruction. Both base remains N$3,500. Other priced services: 25% of net base, rounded up to N$100, minimum N$600; scope/editor availability reviewed. Fast delivery and same-day edit cannot stack.
- Brief text and text-based PDF extraction build an editable plan using conservative local catalogue suggestions. No AI provider is configured; no AI claims/icons in the brief UI. PDFs up to 8 MB/30 pages/6,000 extracted characters; scanned or locked files show actionable errors. PDF.js 5.4.394 vendored with its licence, lazy-loaded only for upload.
- Shared rounded native/select-picker styling; native platform fallback on browsers without customizable select support.

## V24 — live launch verification (4 November 2026)
- Live internal request created Zoho draft QT-000108 / VH-VisionHaus-Launch-Test-001 for N$2,490; retry reused the same draft. Company/contact/billing-address mapping and VAT were verified in Books.
- Exported PDF inspected visually. Fixed app-generated duplicated extra labels and six-decimal mixed-tax rates: quotes with an inclusive package now use inclusive rates consistently; ex-VAT extras are converted to gross without changing prices. All catalogue/variant gross totals checked.
- User explicitly instructed not to change Billing Address Format. Unsaved edits were cancelled and the template closed without saving. No Zoho template settings were changed. Header email remains the existing incomplete address; approved intended address is didi@visionhausmedia.com.na.
- Web3Forms returned success=true and stored both test submissions. Form key matches runtime, recipient is verified didi@visionhausmedia.com.na. Owner reports not received; mailbox search and accessible Microsoft quarantine did not locate it. Email delivery remains unverified; do not claim full production sign-off. Requests are durably stored in D1 and Zoho drafts.

## V25 — background brief analysis (5 November 2026)
- Two owner-provided credentials are runtime secrets only: GOOGLE_API_KEY and OPENAI_API_KEY. Local OPEN_AI_API_KEY alias is supported; .env.local is ignored and excluded from publication.
- POST /api/brief analyses the full extracted source and returns a concise editable summary, requirements, questions and a catalogue-backed plan. No provider branding appears in the interface. Original text is retained internally, separate from client quotation notes.
- Google gemini-3.8-flash is primary (15s limit), OpenAI gpt-4.1-mini Responses structured outputs is fallback (25s, store:false). Both credentials authenticate; Google generation has returned availability errors. OpenAI generation and fallback were verified with synthetic briefs.
- Model amounts are never accepted. Domain restoration and approved catalogue rates calculate totals. Unsupported core scope requires a custom quotation; separately priced extras remain excluded and disclosed. Ten reels across five days correctly produces quote required and no arbitrary base estimate.
- Text-based PDFs: 8 MB / 30 pages / 50,000 extracted characters. Scanned PDFs need a text-based replacement. Per-IP limit8/hour and global150/day bound provider usage through D1. Errors preserve entered text.
- All quotation submission remains draft-only for human review. No invoice, client email, payment or reservation automation added. Zoho Billing Address Format untouched. Web3Forms owner notification delivery remains a separate launch blocker.
