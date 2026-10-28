# VisionHaus quotation connection

The booking UI stays unchanged. The client sees “Request submitted. VisionHaus will review your brief and reply with a quotation.” A connected Zoho Books account creates a **draft**, for the owner to review, complete and send from Books. No invoice, payment, calendar reservation, CRM or Mail integration is required.

## Setup

Server-only Sites secrets: `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_ORGANIZATION_ID`, `ZOHO_TOKEN_KEY` (32 random bytes in hex), `ZOHO_SETUP_KEY` (random owner-only setup password). `ZOHO_SALES_VAT_ID` identifies the organisation’s existing 15% sales VAT (validated before quote creation). Keep `WEB3FORM_ACCESS_KEY` for the existing inbox notification. Never put credentials in source or client assets.

The registered US Zoho server application redirects to `/api/zoho/callback` on this site's exact HTTPS origin. Open `/zoho-connect`, enter the owner setup key and approve the displayed Zoho permissions. The account must have access to the existing VisionHaus Books organisation with NAD currency. OAuth consent activates quotation creation; until then the existing Web3Forms flow continues.

Scopes are Books contacts READ/CREATE, estimates READ/CREATE and settings READ. Settings READ verifies the organisation and currency. No invoice, payment or bank scope is requested. Zoho's CREATE estimate scope also permits some estimate status/email actions; this application only creates drafts.

The refresh token is encrypted with AES-GCM in the site D1 database. OAuth state is single-use, expires in ten minutes and is bound to an HttpOnly browser cookie. Setup is protected by the owner key and cannot replace an existing connection. A GET to `/api/zoho/status` with the setup key as a Bearer header returns connection status without credentials.

## Behaviour and recovery

All prices are recalculated from restored, validated domain state. Books drafts contain the approved starting prices, tax-inclusive flag, full brief and explicit review notes. The configured existing Sales VAT ID is validated at 15% and applied to lines. Mixed tax-inclusive package and ex-VAT extra amounts are normalised to one estimate basis without adding VAT twice. The owner reviews the draft before sending. Unknown services use a zero-rate placeholder clearly marked PRICE TO BE CONFIRMED; unpriced extras are listed for review, never treated as a final free service. Quotes remain drafts, including fully priced packages.

D1 persists full briefs, external references, customer and estimate IDs. A canonical server hash deduplicates the same brief across retries and Worker instances; UI step changes do not create a new request. A two-minute lease prevents overlapping external writes. Before every retry, Books is searched for the external reference to reconcile a successful remote write whose response was lost. Retry Submit after two minutes if creation is not confirmed. A client only sees success once a Books draft is confirmed (or Web3Forms accepted a request while Zoho is not connected). Supplemental inbox notification failure does not undo a confirmed draft.

The integration uses native Worker fetch/Web Crypto and D1 SQL, with no runtime dependencies. Schema-only SQL migrations live in `drizzle/` using Sites' migration journal format. `npm test` exercises migration SQL with Node 24 SQLite plus mocked Zoho responses; no real customers are contacted by tests. After OAuth, verify a clearly labelled internal test draft in Books before claiming live end-to-end acceptance.
