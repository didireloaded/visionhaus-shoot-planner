CREATE TABLE zoho_connection (
 id INTEGER PRIMARY KEY CHECK (id = 1),
 refresh_token TEXT NOT NULL,
 organization_name TEXT NOT NULL,
 currency_id TEXT NOT NULL,
 connected_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE zoho_oauth_states (
 nonce TEXT PRIMARY KEY,
 expires_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE quote_requests (
 id TEXT PRIMARY KEY,
 reference TEXT NOT NULL UNIQUE,
 brief TEXT NOT NULL,
 customer_id TEXT,
 estimate_id TEXT,
 lease_until INTEGER NOT NULL DEFAULT 0,
 status TEXT NOT NULL DEFAULT 'pending',
 created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE quote_rate_limits (
 bucket TEXT PRIMARY KEY,
 attempts INTEGER NOT NULL,
 expires_at INTEGER NOT NULL
);
