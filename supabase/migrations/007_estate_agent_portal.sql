-- =====================================================
-- 007: Estate Agent Portal
-- =====================================================

-- Agencies (the top-level B2B client account)
CREATE TABLE IF NOT EXISTS agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company_registration TEXT,
  website TEXT,
  logo_url TEXT,
  primary_contact_name TEXT,
  primary_contact_email TEXT,
  primary_contact_phone TEXT,
  billing_type TEXT NOT NULL DEFAULT 'pay_per_job', -- pay_per_job | monthly_credit | corporate
  credit_balance_gbp NUMERIC(10,2) DEFAULT 0,
  monthly_credit_limit_gbp NUMERIC(10,2) DEFAULT 0,
  white_label_enabled BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agency Branches
CREATE TABLE IF NOT EXISTS agency_branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  branch_name TEXT NOT NULL,
  address_line_1 TEXT,
  town TEXT,
  county TEXT,
  postcode TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  is_head_office BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agency Users (links Supabase auth.users to agency & branch, with a role)
CREATE TABLE IF NOT EXISTS agency_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES agency_branches(id) ON DELETE SET NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'negotiator', -- admin | manager | negotiator
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agency Properties (the CRM property record)
CREATE TABLE IF NOT EXISTS agency_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES agency_branches(id) ON DELETE SET NULL,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  town TEXT,
  county TEXT,
  postcode TEXT NOT NULL,
  property_type TEXT, -- house | flat | commercial | new_build
  bedrooms INT,
  floor_area_sqm NUMERIC(8,2),
  current_epc_rating TEXT,
  epc_expiry_date DATE,
  epc_lmk_key TEXT,
  compliance_status TEXT DEFAULT 'unknown', -- compliant | at_risk | non_compliant | unknown
  tenant_name TEXT,
  tenant_email TEXT,
  vendor_name TEXT,
  vendor_email TEXT,
  access_notes TEXT,
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agency Jobs (orders/bookings placed via the portal)
CREATE TABLE IF NOT EXISTS agency_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_ref TEXT UNIQUE,
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES agency_branches(id) ON DELETE SET NULL,
  property_id UUID REFERENCES agency_properties(id) ON DELETE SET NULL,
  ordered_by_user_id UUID REFERENCES agency_users(id) ON DELETE SET NULL,
  service_type TEXT NOT NULL, -- domestic_epc | landlord_epc | commercial_epc | new_build_epc | sap | air_tightness | floor_plan | photography | drone | virtual_tour | inventory | consultancy
  status TEXT NOT NULL DEFAULT 'booked', -- booked | assessor_assigned | in_progress | awaiting_report | completed | cancelled | rebook_required
  booked_date DATE,
  booked_time_slot TEXT,
  assessor_id UUID REFERENCES assessors(id) ON DELETE SET NULL,
  price_gbp NUMERIC(8,2),
  is_billed BOOLEAN DEFAULT FALSE,
  access_notes TEXT,
  special_instructions TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-generate job ref
CREATE OR REPLACE FUNCTION generate_agency_job_ref()
RETURNS TRIGGER AS $$
BEGIN
  NEW.job_ref := 'AG' || TO_CHAR(NOW(), 'YYMM') || UPPER(SUBSTRING(NEW.id::TEXT, 1, 6));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_agency_job_ref ON agency_jobs;
CREATE TRIGGER set_agency_job_ref
  BEFORE INSERT ON agency_jobs
  FOR EACH ROW
  EXECUTE FUNCTION generate_agency_job_ref();

-- Agency Documents (stored files attached to properties/jobs)
CREATE TABLE IF NOT EXISTS agency_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  property_id UUID REFERENCES agency_properties(id) ON DELETE CASCADE,
  job_id UUID REFERENCES agency_jobs(id) ON DELETE SET NULL,
  document_type TEXT, -- epc | floor_plan | photo | drone | sap_report | invoice | compliance_report
  file_name TEXT,
  file_path TEXT,
  file_url TEXT,
  file_size_bytes INT,
  is_downloadable BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agency Messages (communications stored per agency)
CREATE TABLE IF NOT EXISTS agency_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES agency_users(id) ON DELETE SET NULL,
  to_team TEXT DEFAULT 'support', -- support | assessors | compliance
  job_id UUID REFERENCES agency_jobs(id) ON DELETE SET NULL,
  subject TEXT,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agency AI Interactions (compliance assistant conversations)
CREATE TABLE IF NOT EXISTS agency_ai_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES agency_users(id) ON DELETE SET NULL,
  property_id UUID REFERENCES agency_properties(id) ON DELETE SET NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Estate Agent SEO Pages
CREATE TABLE IF NOT EXISTS estate_agent_seo_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  town TEXT,
  county TEXT,
  postcode_prefix TEXT,
  page_title TEXT,
  meta_description TEXT,
  page_content TEXT,
  schema_markup JSONB,
  is_live BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_ai_chats ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Agency Users can only see their own agency's data
CREATE POLICY "agency_users_own_agency" ON agency_users
  FOR ALL USING (
    auth.uid() IN (
      SELECT auth_user_id FROM agency_users WHERE agency_id = agency_users.agency_id
    )
  );

CREATE POLICY "agency_properties_own_agency" ON agency_properties
  FOR ALL USING (
    agency_id IN (
      SELECT agency_id FROM agency_users WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "agency_jobs_own_agency" ON agency_jobs
  FOR ALL USING (
    agency_id IN (
      SELECT agency_id FROM agency_users WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "agency_documents_own_agency" ON agency_documents
  FOR ALL USING (
    agency_id IN (
      SELECT agency_id FROM agency_users WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "agency_messages_own_agency" ON agency_messages
  FOR ALL USING (
    agency_id IN (
      SELECT agency_id FROM agency_users WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "agency_ai_chats_own_agency" ON agency_ai_chats
  FOR ALL USING (
    agency_id IN (
      SELECT agency_id FROM agency_users WHERE auth_user_id = auth.uid()
    )
  );
