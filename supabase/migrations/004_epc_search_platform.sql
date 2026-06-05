-- EPC Searches Table
CREATE TABLE epc_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  postcode text,
  address_query text,
  lmk_key text, -- nullable, set if they click a specific result
  rating text, -- nullable, rating of the viewed property
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- EPC Leads Table
CREATE TABLE epc_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  search_id uuid REFERENCES epc_searches(id),
  lmk_key text,
  action_taken text, -- 'booked_replacement', 'callback_requested'
  created_at timestamptz DEFAULT now()
);

-- EPC SEO Locations
CREATE TABLE epc_seo_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  county text,
  town text,
  postcode_prefix text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE epc_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE epc_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE epc_seo_locations ENABLE ROW LEVEL SECURITY;

-- Policies
-- Anyone can insert a search/lead
CREATE POLICY "Public insert searches" ON epc_searches FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert leads" ON epc_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read seo locations" ON epc_seo_locations FOR SELECT USING (true);

-- Only assessors/admins can read searches/leads
CREATE POLICY "Assessors read searches" ON epc_searches
  FOR SELECT USING (EXISTS (SELECT 1 FROM assessors WHERE auth_user_id = auth.uid()));
CREATE POLICY "Assessors read leads" ON epc_leads
  FOR SELECT USING (EXISTS (SELECT 1 FROM assessors WHERE auth_user_id = auth.uid()));
