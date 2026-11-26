# VisionHaus quotation connection

The booking UI stays unchanged. The client sees “Request submitted. VisionHaus will review your brief and reply with a quotation.” A connected Zoho Books account creates a **draft**, for the owner to review, complete and send from Books. No invoice, payment, calendar reservation, CRM or Mail integration is required.

## Setup

Server-only Sites secrets: `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_ORGANIZATION_ID`, `ZOHO_TOKEN_KEY` (32 random bytes in hex), `ZOHO_SETUP_KEY` (random owner-only setup password). `ZOHO_SALES_VAT_ID` identifies the organisation’s existing 15% sales VAT (validated before quote creation). Keep `WEB3FORM_ACCESS_KEY` for the existing inbox notification. Never put credentials in source or client assets.

The registered US Zoho server application redirects to `/api/zoho/callback` on this site's exact HTTPS origin. Open `/zoho-connect`, enter the owner setup key and approve the displayed Zoho permissions. The account must have access to the existing VisionHaus Books organisation with NAD currency. OAuth consent activates quotation creation; until then the existing Web3Forms flow continues.

Scopes are Books contacts READ/CREATE, estimates READ/CREATE and settings READ. Settings READ verifies the organisation and currency. No invoice, payment or bank scope is requested. Zoho's CREATE estimate scope also permits some estimate status/email actions; this application only creates drafts.

The refresh token is encrypted with AES-GCM in the site D1 database. OAuth state is single-use, expires in ten minutes and is bound to an HttpOnly browser cookie. Setup is protected by the owner key and cannot replace an existing connection. A GET to `/api/zoho/status` with the setup key as a Bearer header returns connection status without credentials.

## Behaviour and recovery

All prices are recalculated from restored, validated domain state. Books drafts contain approved starting prices, tax-inclusive treatment, structured service scope, package inclusions and selected extras. The full brief and internal review checklist stay in D1 and the owner notification, rather than client-facing notes. The configured existing Sales VAT ID is validated at 15% and applied to lines. When a quotation includes a tax-inclusive package, all its rates use the inclusive basis: ex-VAT extras are multiplied by 1.15. Fully ex-VAT quotations keep the exclusive basis. Two-decimal rates preserve the client-facing gross totals without adding VAT twice. The owner reviews the draft before sending. Unknown services use a zero-rate draft line whose description states that scope and price must be agreed; unpriced extras are listed for review, never treated as a final free service. Quotes remain drafts, including fully priced packages.

D1 persists full briefs, external references, customer and estimate IDs. A canonical server hash deduplicates the same brief across retries and Worker instances; UI step changes do not create a new request. A two-minute lease prevents overlapping external writes. Before every retry, Books is searched for the external reference to reconcile a successful remote write whose response was lost. Retry Submit after two minutes if creation is not confirmed. A client only sees success once a Books draft is confirmed (or Web3Forms accepted a request while Zoho is not connected). Supplemental inbox notification failure does not undo a confirmed draft.

The integration uses native Worker fetch/Web Crypto and D1 SQL, with no runtime dependencies. Schema-only SQL migrations live in `drizzle/` using Sites' migration journal format. `npm test` exercises migration SQL with Node 24 SQLite plus mocked Zoho responses; no real customers are contacted by tests. After OAuth, verify a clearly labelled internal test draft in Books before claiming live end-to-end acceptance.

New requests receive a shared atomic sequence (`VH-Company-001`), independent of Books QT numbering. Retries retain their reference, including historic hash references. Company, contact person and optional billing address are mapped separately for new customers. Existing customer records and the organisation PDF template are not rewritten.

## Submission abuse limits

`/api/requests` uses atomic counters in the existing `quote_rate_limits` D1 table, following the brief limiter's bucket pattern. It permits 36 validated attempts per connecting IP per hour and 150 total per UTC day. The hourly count has the same aggregate allowance as the former six-per-ten-minute guard; Zoho's existing per-ten-minute protection is unchanged. Rejected attempts do not call a quotation provider. Buckets store SHA-256 IP hashes and expire at fixed window boundaries. Expired rows are pruned. Missing or unavailable D1 returns 503 and leaves the browser draft available for retry. There is no per-instance memory fallback.

## Briefs and customer records

Brief analysis processes up to 50,000 extracted characters from text PDFs, with a limit of 8 MB and 30 pages. It returns a short editable summary and catalogue-backed scope. OpenAI is tried first, with Google as fallback. Neither provider supplies trusted amounts: the application calculates prices from approved domain state. The original source text remains separate from client-facing quotation descriptions. Readable PDF text is supported; scanned images and visual page layout are not analysed.

A request token distinguishes an intentional new enquiry from a retry. Company and requester matching does not add an unverified address to another customer's recipients. A same-company requester can receive a separate customer profile while retaining the legal company name. Existing customer billing details still require owner review. Do not change Zoho's Billing Address Format or invoice templates as part of app maintenance.

The only owner notification recipient is didi@visionhausmedia.com.na. Web3Forms acceptance does not prove inbox receipt. Notification delivery remains unverified until actual receipt is checked; this refactor does not change that provider configuration.
