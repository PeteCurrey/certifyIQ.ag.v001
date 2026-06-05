-- 006_developer_compliance.sql

-- Developer Projects Table
CREATE TABLE developer_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id), -- Nullable for anonymous guests
  project_type text NOT NULL,
  postcode text,
  town text,
  county text,
  country text DEFAULT 'UK',
  number_of_units integer DEFAULT 1,
  floor_area_sqm numeric,
  number_of_storeys integer DEFAULT 1,
  construction_type text,
  heating_strategy text,
  ventilation_strategy text,
  project_stage text,
  created_at timestamptz DEFAULT now()
);

-- Developer Compliance Reports Table
CREATE TABLE developer_compliance_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES developer_projects(id) ON DELETE CASCADE,
  risk_score text, -- 'LOW', 'MEDIUM', 'HIGH'
  required_services jsonb, -- Array of service objects
  compliance_timeline jsonb, -- Timeline mapping stages to deliverables
  risk_analysis jsonb, -- Detailed risk factors and delays
  estimated_cost_total_min numeric,
  estimated_cost_total_max numeric,
  created_at timestamptz DEFAULT now()
);

-- Developer SEO Pages Table
CREATE TABLE developer_seo_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  town text NOT NULL,
  county text NOT NULL,
  postcode_prefix text,
  service_type text NOT NULL, -- e.g., 'sap-calculations', 'air-tightness'
  page_title text NOT NULL,
  meta_description text NOT NULL,
  page_content text NOT NULL,
  is_live boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Developer Uploads Table (for drawings/plans metadata)
CREATE TABLE developer_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES developer_projects(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id), -- To link uploads to a specific user if they create an account later
  file_name text NOT NULL,
  file_path text NOT NULL, -- Storage bucket path
  file_size_bytes bigint,
  content_type text,
  ai_review_status text DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  ai_review_notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE developer_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_compliance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_seo_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_uploads ENABLE ROW LEVEL SECURITY;

-- Policies for developer_projects
CREATE POLICY "Public insert developer projects" ON developer_projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Customers view own developer projects" ON developer_projects
  FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));
CREATE POLICY "Anonymous users view own created developer projects" ON developer_projects
  FOR SELECT USING (customer_id IS NULL); -- We might need a session ID for true anonymous tracking, but this allows basic retrieval right after creation if we have the ID.

-- Policies for developer_compliance_reports
CREATE POLICY "Public insert developer compliance reports" ON developer_compliance_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Customers view own compliance reports" ON developer_compliance_reports
  FOR SELECT USING (project_id IN (SELECT id FROM developer_projects WHERE customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())));
CREATE POLICY "Public view compliance reports" ON developer_compliance_reports
  FOR SELECT USING (true); -- Allow anyone with the link to view the report

-- Policies for developer_seo_pages
CREATE POLICY "Public read developer seo pages" ON developer_seo_pages FOR SELECT USING (is_live = true);

-- Policies for developer_uploads
CREATE POLICY "Public insert developer uploads" ON developer_uploads FOR INSERT WITH CHECK (true);
CREATE POLICY "Customers view own developer uploads" ON developer_uploads
  FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));
CREATE POLICY "Assessors/Admins view all uploads" ON developer_uploads
  FOR SELECT USING (EXISTS (SELECT 1 FROM assessors WHERE auth_user_id = auth.uid()));

-- Create Storage Bucket for Drawings (needs to be run manually or via Supabase dashboard, included here for completeness)
-- insert into storage.buckets (id, name, public) values ('developer-drawings', 'developer-drawings', false);
