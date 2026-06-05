-- customers
CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users,
  full_name text,
  email text UNIQUE,
  phone text,
  customer_type text DEFAULT 'homeowner', -- homeowner | landlord | agent
  company_name text, -- nullable, for agents
  created_at timestamptz DEFAULT now()
);

-- properties
CREATE TABLE properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id),
  address_line_1 text,
  address_line_2 text,
  town text,
  county text,
  postcode text,
  uprn text, -- nullable — Universal Property Reference Number
  property_type text, -- detached | semi | terraced | flat | bungalow | commercial
  bed_count integer,
  floor_area_sqm numeric,
  construction_year integer,
  current_epc_rating text, -- nullable — A–G, from last known EPC
  current_epc_expiry date, -- nullable
  epc_register_ref text, -- nullable
  created_at timestamptz DEFAULT now()
);

-- assessors (admin users)
CREATE TABLE assessors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users,
  full_name text,
  email text UNIQUE,
  phone text,
  accreditation_body text DEFAULT 'elmhurst' NOT NULL,
  accreditation_number text,
  accreditation_expiry date,
  service_area_postcodes text[], -- array of postcode prefixes e.g. ['S40','S41','S42','DE4']
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- bookings
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref text UNIQUE, -- CIQ-YYYYMMDD-XXXX
  property_id uuid REFERENCES properties(id),
  customer_id uuid REFERENCES customers(id),
  assessor_id uuid REFERENCES assessors(id), -- nullable until assigned
  service_type text, -- domestic | commercial | desktop_review
  status text DEFAULT 'pending_payment',
  preferred_date date,
  preferred_time_slot text, -- morning | afternoon | any
  confirmed_datetime timestamptz, -- nullable
  price_gbp numeric,
  stripe_payment_intent_id text, -- nullable
  stripe_payment_status text,
  special_instructions text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- assessments (RdSAP 10 data capture — the live assessment form)
CREATE TABLE assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) UNIQUE,
  assessor_id uuid REFERENCES assessors(id),
  status text DEFAULT 'not_started', -- not_started | in_progress | complete | exported
  started_at timestamptz,
  completed_at timestamptz,
  -- Property & construction
  property_type text,
  property_age_band text,
  detachment_type text,
  storey_count integer,
  floor_area_ground numeric,
  floor_area_first numeric,
  floor_area_second numeric,
  floor_area_total numeric,
  -- Walls
  wall_type text,
  wall_insulation text,
  wall_insulation_thickness_mm integer,
  -- Roof
  roof_type text,
  roof_insulation_location text,
  roof_insulation_thickness_mm integer,
  -- Floor
  floor_type text,
  floor_insulation text,
  -- Windows
  window_type text,
  window_area_percentage text,
  -- Heating
  main_heat_type text,
  main_heat_fuel text,
  boiler_type text, -- nullable
  boiler_efficiency_band text, -- nullable
  boiler_age_band text, -- nullable
  main_heat_controls text[],
  secondary_heat_type text, -- nullable
  secondary_heat_fuel text, -- nullable
  -- Hot water
  hot_water_source text,
  solar_hw_panel boolean DEFAULT false,
  solar_hw_panel_area_sqm numeric, -- nullable
  -- Ventilation
  ventilation_type text,
  -- Lighting
  low_energy_lighting_pct integer, -- 0–100
  -- Renewables
  solar_pv boolean DEFAULT false,
  solar_pv_kwp numeric, -- nullable
  solar_pv_facing text, -- nullable
  wind_turbine boolean DEFAULT false,
  wind_turbine_kw numeric, -- nullable
  -- Survey notes
  assessor_notes text,
  ai_flags jsonb DEFAULT '[]', -- array of AI-flagged data anomalies
  photos_uploaded integer DEFAULT 0,
  floorplan_sketch_url text, -- nullable
  data_export_json jsonb, -- nullable
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- certificates
CREATE TABLE certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id),
  assessment_id uuid REFERENCES assessments(id),
  property_id uuid REFERENCES properties(id),
  current_rating text, -- A–G
  potential_rating text, -- A–G
  current_score integer, -- SAP score 1–100
  potential_score integer,
  energy_cost_current_gbp numeric,
  energy_cost_potential_gbp numeric,
  co2_current_tonnes numeric,
  co2_potential_tonnes numeric,
  primary_energy_indicator_current numeric,
  primary_energy_indicator_potential numeric,
  recommendations jsonb, -- array of improvement recommendations
  valid_from date,
  valid_until date,
  lodge_date date,
  lodgement_ref text, -- nullable
  pdf_url text, -- nullable
  issued_by_assessor_id uuid REFERENCES assessors(id),
  created_at timestamptz DEFAULT now()
);

-- pricing_tiers
CREATE TABLE pricing_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type text,
  property_type text,
  min_floor_area_sqm numeric,
  max_floor_area_sqm numeric,
  price_gbp numeric,
  is_active boolean DEFAULT true
);

-- blog_posts
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE,
  title text,
  excerpt text,
  content text,
  seo_title text,
  seo_description text,
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- location_seo_pages
CREATE TABLE location_seo_pages (
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

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessors ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_seo_pages ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- customers: authenticated users see own records only
CREATE POLICY "Users can view own customer record" ON customers
  FOR SELECT USING (auth.uid() = auth_user_id);
CREATE POLICY "Users can update own customer record" ON customers
  FOR UPDATE USING (auth.uid() = auth_user_id);
CREATE POLICY "Users can insert own customer record" ON customers
  FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

-- properties: customers see own properties; assessors see all
CREATE POLICY "Customers view own properties" ON properties
  FOR SELECT USING (
    customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
    OR 
    EXISTS (SELECT 1 FROM assessors WHERE auth_user_id = auth.uid())
  );
CREATE POLICY "Customers insert own properties" ON properties
  FOR INSERT WITH CHECK (
    customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
    OR 
    EXISTS (SELECT 1 FROM assessors WHERE auth_user_id = auth.uid())
  );
CREATE POLICY "Customers update own properties" ON properties
  FOR UPDATE USING (
    customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
    OR 
    EXISTS (SELECT 1 FROM assessors WHERE auth_user_id = auth.uid())
  );

-- bookings: customers see own bookings; assessors see all
CREATE POLICY "Customers view own bookings" ON bookings
  FOR SELECT USING (
    customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
    OR 
    EXISTS (SELECT 1 FROM assessors WHERE auth_user_id = auth.uid())
  );
CREATE POLICY "Customers insert own bookings" ON bookings
  FOR INSERT WITH CHECK (
    customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
    OR 
    EXISTS (SELECT 1 FROM assessors WHERE auth_user_id = auth.uid())
  );
CREATE POLICY "Customers update own bookings" ON bookings
  FOR UPDATE USING (
    customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
    OR 
    EXISTS (SELECT 1 FROM assessors WHERE auth_user_id = auth.uid())
  );

-- assessments: assessors only (create + update + read)
CREATE POLICY "Assessors manage assessments" ON assessments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM assessors WHERE auth_user_id = auth.uid())
  );

-- certificates: customers see their own (read); assessors see all
CREATE POLICY "Customers view own certificates" ON certificates
  FOR SELECT USING (
    property_id IN (
      SELECT id FROM properties 
      WHERE customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
    )
    OR 
    EXISTS (SELECT 1 FROM assessors WHERE auth_user_id = auth.uid())
  );

-- assessors: service_role only for create/update; authenticated read own record
CREATE POLICY "Assessors view own record" ON assessors
  FOR SELECT USING (auth.uid() = auth_user_id);
-- public can see pricing, blog, seo
CREATE POLICY "Public pricing tiers" ON pricing_tiers FOR SELECT USING (true);
CREATE POLICY "Public blog posts" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Public location pages" ON location_seo_pages FOR SELECT USING (true);

-- STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES ('assessment-photos', 'assessment-photos', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('floorplan-sketches', 'floorplan-sketches', false);

-- STORAGE POLICIES
-- photos
CREATE POLICY "Assessors can upload photos" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'assessment-photos' AND 
  EXISTS (SELECT 1 FROM assessors WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Assessors can view photos" ON storage.objects FOR SELECT USING (
  bucket_id = 'assessment-photos' AND 
  EXISTS (SELECT 1 FROM assessors WHERE auth_user_id = auth.uid())
);

-- certificates
CREATE POLICY "Assessors can upload certificates" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'certificates' AND 
  EXISTS (SELECT 1 FROM assessors WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Customers and Assessors can view certificates" ON storage.objects FOR SELECT USING (
  bucket_id = 'certificates' AND 
  (
    EXISTS (SELECT 1 FROM assessors WHERE auth_user_id = auth.uid())
    OR
    EXISTS (SELECT 1 FROM customers WHERE auth_user_id = auth.uid())
  )
);

-- floorplans
CREATE POLICY "Assessors can upload floorplans" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'floorplan-sketches' AND 
  EXISTS (SELECT 1 FROM assessors WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Assessors can view floorplans" ON storage.objects FOR SELECT USING (
  bucket_id = 'floorplan-sketches' AND 
  EXISTS (SELECT 1 FROM assessors WHERE auth_user_id = auth.uid())
);
