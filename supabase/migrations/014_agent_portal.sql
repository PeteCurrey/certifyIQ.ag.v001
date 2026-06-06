-- ─────────────────────────────
-- AGENT ACCOUNTS
-- ─────────────────────────────
CREATE TABLE agent_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users UNIQUE,

  -- Agency details
  agency_name text NOT NULL,
  trading_name text,
  agency_type text DEFAULT 'independent'
    CHECK (agency_type IN (
      'independent', 'franchise', 'online', 'hybrid', 'corporate'
    )),
  website text,
  phone text,
  email text NOT NULL,

  -- Billing
  billing_preference text DEFAULT 'agency'
    CHECK (billing_preference IN ('agency', 'vendor')),
  billing_day integer DEFAULT 1
    CHECK (billing_day BETWEEN 1 AND 28),
  vat_registered boolean DEFAULT false,
  vat_number text,
  billing_email text,
  stripe_customer_id text,
  stripe_payment_method_id text,
  payment_terms_days integer DEFAULT 7,

  -- CRM connection (which system they use)
  crm_type text
    CHECK (crm_type IN (
      'alto', 'street', 'reapit', 'dezrez', 'loop', 'manual', null
    )),
  crm_connected boolean DEFAULT false,
  crm_connected_at timestamptz,
  crm_last_sync_at timestamptz,
  crm_sync_error text,

  -- Account status
  status text DEFAULT 'pending_setup'
    CHECK (status IN (
      'pending_setup', 'active', 'suspended', 'churned'
    )),
  onboarding_step integer DEFAULT 1,
  onboarding_complete boolean DEFAULT false,

  -- Relationship
  account_manager_id uuid REFERENCES assessors(id),
  notes text,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ─────────────────────────────
-- AGENT BRANCHES
-- One agency can have multiple branches (for chains)
-- ─────────────────────────────
CREATE TABLE agent_branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_account_id uuid REFERENCES agent_accounts(id) ON DELETE CASCADE,
  branch_name text NOT NULL,
  address_line_1 text,
  address_line_2 text,
  town text,
  postcode text,
  phone text,
  email text,
  crm_branch_id text,  -- ID of this branch in their CRM
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ─────────────────────────────
-- CRM INTEGRATIONS
-- Stores credentials per integration type
-- ─────────────────────────────
CREATE TABLE crm_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_account_id uuid REFERENCES agent_accounts(id) ON DELETE CASCADE,
  crm_type text NOT NULL,

  -- Credentials (encrypted at rest via Supabase Vault ideally,
  -- or store as env-referenced tokens)
  api_key text,           -- Alto: API key from Vebra
  api_secret text,        -- Street: OAuth client secret
  access_token text,      -- Street/Reapit: OAuth access token
  refresh_token text,     -- Street/Reapit: OAuth refresh token
  token_expires_at timestamptz,
  webhook_secret text,    -- Street/Reapit: webhook signature secret
  client_id text,         -- Reapit: client ID from Foundations portal
  customer_id text,       -- Reapit: reapit-customer header value

  -- Sync settings
  sync_sales boolean DEFAULT true,
  sync_lettings boolean DEFAULT true,
  sync_commercial boolean DEFAULT false,
  last_sync_cursor text,  -- Alto: last modified timestamp for delta polling

  is_active boolean DEFAULT true,
  last_tested_at timestamptz,
  test_status text,  -- 'success' | 'failed' | 'untested'
  test_error text,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ─────────────────────────────
-- AGENT PROPERTIES
-- One row per property synced from CRM
-- ─────────────────────────────
CREATE TABLE agent_properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_account_id uuid REFERENCES agent_accounts(id),
  agent_branch_id uuid REFERENCES agent_branches(id),

  -- CRM identifiers
  crm_property_id text,         -- ID in their CRM system
  crm_type text,                -- which CRM this came from
  crm_raw_data jsonb,           -- full raw payload from CRM (for debugging)
  source text DEFAULT 'manual'
    CHECK (source IN ('alto', 'street', 'reapit', 'manual', 'csv')),

  -- Property details
  address_line_1 text,
  address_line_2 text,
  town text,
  county text,
  postcode text NOT NULL,
  uprn text,
  property_type text,
  bedrooms integer,
  tenure text CHECK (tenure IN ('sale', 'let', 'commercial', 'unknown')),

  -- Vendor / landlord contact
  vendor_name text,
  vendor_email text,
  vendor_phone text,
  vendor_contact_preference text DEFAULT 'email'
    CHECK (vendor_contact_preference IN ('email', 'sms', 'both')),
  landlord_name text,           -- for lettings properties
  landlord_email text,
  landlord_phone text,

  -- EPC status (from EPC register auto-check)
  epc_check_status text DEFAULT 'pending'
    CHECK (epc_check_status IN (
      'pending', 'checked', 'check_failed'
    )),
  epc_check_last_run timestamptz,
  existing_epc_rating text,     -- current rating from register (A-G)
  existing_epc_expiry date,
  existing_epc_lmk_key text,   -- EPC register reference
  epc_required boolean,         -- true if no valid EPC found

  -- Job link (once an EPC job is created)
  booking_id uuid REFERENCES bookings(id),
  epc_job_status text DEFAULT 'none'
    CHECK (epc_job_status IN (
      'none', 'awaiting_contact', 'contact_sent', 'awaiting_payment',
      'payment_received', 'scheduled', 'in_progress',
      'assessment_complete', 'certificate_issued'
    )),

  -- Billing for this property
  billing_override text
    CHECK (billing_override IN ('agency', 'vendor', null)),
  -- null = use agent_accounts.billing_preference
  billing_status text DEFAULT 'not_applicable'
    CHECK (billing_status IN (
      'not_applicable', 'pending', 'awaiting_vendor_payment',
      'vendor_paid', 'on_monthly_invoice', 'invoiced', 'overdue'
    )),
  price_gbp numeric,
  vendor_payment_intent_id text,
  vendor_payment_link_sent_at timestamptz,
  vendor_payment_link_expires_at timestamptz,
  vendor_payment_reminder_count integer DEFAULT 0,

  -- Lifecycle
  instructed_at timestamptz,    -- when property was added to their CRM
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Unique constraint: one CRM property per agent account
CREATE UNIQUE INDEX agent_properties_crm_unique
  ON agent_properties(agent_account_id, crm_type, crm_property_id)
  WHERE crm_property_id IS NOT NULL;

-- ─────────────────────────────
-- VENDOR OUTREACH LOG
-- Tracks every contact attempt with vendor/landlord
-- ─────────────────────────────
CREATE TABLE vendor_outreach_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_property_id uuid REFERENCES agent_properties(id),
  booking_id uuid REFERENCES bookings(id),
  outreach_type text CHECK (outreach_type IN ('email', 'sms')),
  recipient_email text,
  recipient_phone text,
  template_name text,       -- which Resend template was used
  resend_email_id text,     -- Resend message ID for delivery tracking
  subject text,
  status text DEFAULT 'sent'
    CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'failed')),
  sent_at timestamptz DEFAULT now()
);

-- ─────────────────────────────
-- MONTHLY INVOICES
-- ─────────────────────────────
CREATE TABLE agent_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_account_id uuid REFERENCES agent_accounts(id),
  invoice_ref text UNIQUE,  -- AVR-INV-AGYYYYMM-XXXX
  invoice_period_start date,
  invoice_period_end date,
  status text DEFAULT 'draft'
    CHECK (status IN (
      'draft', 'issued', 'sent', 'paid', 'overdue', 'void'
    )),
  subtotal_gbp numeric DEFAULT 0,
  vat_gbp numeric DEFAULT 0,
  total_gbp numeric DEFAULT 0,
  job_count integer DEFAULT 0,
  stripe_invoice_id text,
  stripe_payment_intent_id text,
  stripe_payment_link text,
  due_date date,
  paid_at timestamptz,
  issued_at timestamptz,
  pdf_url text,             -- Supabase storage path
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE agent_invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_invoice_id uuid REFERENCES agent_invoices(id) ON DELETE CASCADE,
  agent_property_id uuid REFERENCES agent_properties(id),
  booking_id uuid REFERENCES bookings(id),
  address text,
  service_type text,
  completed_date date,
  price_gbp numeric,
  vat_gbp numeric DEFAULT 0,
  description text
);

-- ─────────────────────────────
-- RLS POLICIES
-- ─────────────────────────────

ALTER TABLE agent_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_outreach_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_invoice_items ENABLE ROW LEVEL SECURITY;

-- Agents see only their own data
CREATE POLICY "agent_sees_own_account" ON agent_accounts
  FOR ALL USING (auth_user_id = auth.uid());

CREATE POLICY "agent_sees_own_branches" ON agent_branches
  FOR ALL USING (
    agent_account_id IN (
      SELECT id FROM agent_accounts WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "agent_sees_own_integrations" ON crm_integrations
  FOR ALL USING (
    agent_account_id IN (
      SELECT id FROM agent_accounts WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "agent_sees_own_properties" ON agent_properties
  FOR ALL USING (
    agent_account_id IN (
      SELECT id FROM agent_accounts WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "agent_sees_own_invoices" ON agent_invoices
  FOR SELECT USING (
    agent_account_id IN (
      SELECT id FROM agent_accounts WHERE auth_user_id = auth.uid()
    )
  );

-- Assessors (admin) see all
CREATE POLICY "assessor_full_access_agent_accounts" ON agent_accounts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid()
            AND role = 'assessor')
  );

CREATE POLICY "assessor_full_access_agent_branches" ON agent_branches
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid()
            AND role = 'assessor')
  );

CREATE POLICY "assessor_full_access_crm_integrations" ON crm_integrations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid()
            AND role = 'assessor')
  );

CREATE POLICY "assessor_full_access_agent_properties" ON agent_properties
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid()
            AND role = 'assessor')
  );

CREATE POLICY "assessor_full_access_vendor_outreach_log" ON vendor_outreach_log
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid()
            AND role = 'assessor')
  );

CREATE POLICY "assessor_full_access_agent_invoices" ON agent_invoices
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid()
            AND role = 'assessor')
  );

CREATE POLICY "assessor_full_access_agent_invoice_items" ON agent_invoice_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid()
            AND role = 'assessor')
  );

-- Add to profiles role check
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('customer', 'assessor', 'agent'));
