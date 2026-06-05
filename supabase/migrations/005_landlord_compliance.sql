-- Compliance Reports Table
CREATE TABLE compliance_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id), -- Nullable for anonymous users
  property_id uuid REFERENCES properties(id), -- Nullable if just an ad-hoc search
  lmk_key text NOT NULL,
  address text,
  postcode text,
  current_rating text,
  potential_rating text,
  overall_score text, -- 'PASS', 'AT RISK', 'HIGH RISK', 'NON COMPLIANT'
  mees_status text,
  band_c_gap integer,
  report_data jsonb, -- Stores full compliance rules and recommendations output
  created_at timestamptz DEFAULT now()
);

-- Landlord SEO Locations
CREATE TABLE landlord_seo_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE,
  town text,
  county text,
  postcode_prefix text,
  page_title text,
  page_content text,
  is_live boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE compliance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE landlord_seo_locations ENABLE ROW LEVEL SECURITY;

-- Policies for compliance_reports
CREATE POLICY "Public insert compliance reports" ON compliance_reports FOR INSERT WITH CHECK (true);

-- Customers can view their own reports
CREATE POLICY "Customers view own compliance reports" ON compliance_reports
  FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));

-- Assessors/Admins can view all reports
CREATE POLICY "Assessors view compliance reports" ON compliance_reports
  FOR SELECT USING (EXISTS (SELECT 1 FROM assessors WHERE auth_user_id = auth.uid()));

-- Policies for landlord_seo_locations
CREATE POLICY "Public read landlord seo locations" ON landlord_seo_locations FOR SELECT USING (true);
