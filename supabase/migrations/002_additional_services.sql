-- 1. Extend service_type enum on bookings table
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_service_type_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_service_type_check
  CHECK (service_type IN (
    'domestic','commercial','desktop_review',
    'on_construction_design','on_construction_as_built','on_construction_full',
    'air_tightness_domestic','air_tightness_commercial',
    'commercial_level3','commercial_level4','commercial_level5'
  ));

-- 2. Add extra columns to bookings table
ALTER TABLE bookings
  ADD COLUMN commercial_epc_level integer,       -- 3, 4, or 5
  ADD COLUMN building_use_type text,             -- retail | office | industrial | warehouse | healthcare | education | hospitality | other
  ADD COLUMN floor_area_sqm numeric,             -- needed for commercial quoting
  ADD COLUMN drawings_uploaded boolean DEFAULT false,  -- for SAP/new build jobs
  ADD COLUMN sap_stage text,                     -- 'design' | 'as_built' | 'both'
  ADD COLUMN air_test_plot_count integer DEFAULT 1,   -- number of plots to test
  ADD COLUMN quote_required boolean DEFAULT false,    -- Level 5 and complex commercial
  ADD COLUMN quoted_price_gbp numeric;           -- manually entered after quote

-- 3. Create sap_assessments table
CREATE TABLE sap_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) UNIQUE,
  assessor_id uuid REFERENCES assessors(id),
  stage text NOT NULL,  -- 'design' | 'as_built'
  status text DEFAULT 'not_started', -- not_started | in_progress | design_complete | awaiting_air_test | as_built_complete | epc_issued
  
  -- Project info
  project_name text,
  developer_name text,
  architect_name text,
  building_control_ref text,
  plot_count integer DEFAULT 1,

  -- Design stage inputs (from drawings)
  dwelling_type text,      -- house | flat | bungalow | conversion
  storey_count integer,
  total_floor_area_sqm numeric,
  wall_construction text,
  wall_uvalue numeric,
  roof_construction text,
  roof_uvalue numeric,
  floor_construction text,
  floor_uvalue numeric,
  window_uvalue numeric,
  window_gvalue numeric,
  door_uvalue numeric,
  air_permeability_design_target numeric,   -- typically 5.0 m³/h/m²
  heating_system text,
  heating_fuel text,
  hot_water_system text,
  ventilation_type text,
  renewable_technology text[],
  
  -- As-built stage
  air_permeability_tested numeric,          -- actual result from ATTMA test
  air_test_certificate_ref text,
  air_test_date date,
  as_built_variations text,                 -- any changes from design spec
  
  -- Outputs
  ter_score numeric,     -- Target Emission Rate
  der_score numeric,     -- Dwelling Emission Rate
  tfee_score numeric,    -- Target Fabric Energy Efficiency
  dfee_score numeric,    -- Dwelling Fabric Energy Efficiency
  sap_score numeric,
  epc_band text,
  pea_issued_date date,
  pea_ref text,
  epc_issued_date date,
  epc_ref text,

  -- Files
  drawings_url text,           -- uploaded architect drawings
  pea_document_url text,
  epc_document_url text,

  assessor_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. Create air_tightness_tests table
CREATE TABLE air_tightness_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id),
  assessor_id uuid REFERENCES assessors(id),
  status text DEFAULT 'scheduled', -- scheduled | in_progress | passed | failed | remedial_required | retest_required

  -- Property details
  property_address text,
  postcode text,
  building_type text,       -- new_build_dwelling | new_build_commercial | retrofit
  construction_type text,   -- timber_frame | masonry | steel_frame | modular | other
  floor_area_sqm numeric,
  storey_count integer,
  plot_number text,          -- for multi-plot developments
  development_name text,     -- e.g. "Meadow View Phase 2"

  -- Test parameters
  attma_standard text DEFAULT 'TS1',  -- TS1 (domestic) or TS2 (commercial)
  test_method text DEFAULT 'pressurisation',  -- pressurisation | depressurisation | average
  design_target_m3_h_m2 numeric,  -- from SAP/SBEM design stage
  building_envelope_area_sqm numeric,
  internal_volume_m3 numeric,

  -- Test results
  test_date date,
  test_time time,
  temperature_internal numeric,
  temperature_external numeric,
  wind_speed_description text,  -- calm | light | moderate (subjective assessment)
  barometric_pressure_pa numeric,
  baseline_pressure_pa numeric DEFAULT 50,

  -- Results (each is flow at 50Pa)
  pressurisation_result_m3_h numeric,
  depressurisation_result_m3_h numeric,
  average_result_m3_h numeric,
  air_permeability_m3_h_m2 numeric,   -- THE KEY RESULT
  pass_fail text,                      -- 'pass' | 'fail'
  regulatory_limit_m3_h_m2 numeric DEFAULT 8.0,

  -- Failure details (if applicable)
  failure_areas text[],    -- where leakage was detected
  remedial_notes text,
  retest_required boolean DEFAULT false,
  retest_date date,
  retest_result_m3_h_m2 numeric,
  retest_pass_fail text,

  -- Certificate
  attma_certificate_ref text,
  certificate_issued_date date,
  certificate_url text,

  -- Equipment
  fan_type text DEFAULT 'Minneapolis BlowerDoor',
  equipment_calibration_ref text,
  ukas_calibration_date date,

  assessor_notes text,
  photos_url text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 5. Extend pricing_tiers with new tiers
INSERT INTO pricing_tiers (service_type, property_type, min_floor_area_sqm, max_floor_area_sqm, price_gbp, is_active) VALUES
  -- Commercial EPC Level 3 (by floor area)
  ('commercial_level3', 'commercial', 0,    100,  150, true),
  ('commercial_level3', 'commercial', 101,  250,  250, true),
  ('commercial_level3', 'commercial', 251,  500,  350, true),
  ('commercial_level3', 'commercial', 501,  1000, 450, true),
  -- Commercial Level 4 (quote basis, these are guides)
  ('commercial_level4', 'commercial', 0,    500,  450, true),
  ('commercial_level4', 'commercial', 501,  1000, 650, true),
  ('commercial_level4', 'commercial', 1001, 9999, 0,   false),  -- quote required
  -- Level 5 always quote
  ('commercial_level5', 'commercial', 0,    9999, 0,   false),  -- quote required
  -- SAP / On-Construction
  ('on_construction_design',    'new_build', 0, 9999, 195, true),
  ('on_construction_as_built',  'new_build', 0, 9999, 150, true),
  ('on_construction_full',      'new_build', 0, 9999, 295, true),
  -- Air Tightness Testing (per plot)
  ('air_tightness_domestic',   'new_build', 0,   150, 120, true),
  ('air_tightness_domestic',   'new_build', 151, 300, 145, true),
  ('air_tightness_domestic',   'new_build', 301, 999, 175, true),
  ('air_tightness_commercial', 'commercial', 0,  500, 225, true),
  ('air_tightness_commercial', 'commercial', 501,9999, 0,  false); -- quote

-- 6. Add ATTMA fields to assessors
ALTER TABLE assessors
  ADD COLUMN attma_registration boolean DEFAULT false,
  ADD COLUMN attma_level integer; -- 1 or 2

-- 7. RLS enablement and policies
ALTER TABLE sap_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE air_tightness_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Assessors manage sap_assessments" ON sap_assessments
  FOR ALL USING (EXISTS (SELECT 1 FROM assessors WHERE auth_user_id = auth.uid()));

CREATE POLICY "Customers view own sap_assessments" ON sap_assessments
  FOR SELECT USING (
    booking_id IN (SELECT id FROM bookings WHERE customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()))
    OR EXISTS (SELECT 1 FROM assessors WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Assessors manage air_tightness_tests" ON air_tightness_tests
  FOR ALL USING (EXISTS (SELECT 1 FROM assessors WHERE auth_user_id = auth.uid()));

CREATE POLICY "Customers view own air_tightness_tests" ON air_tightness_tests
  FOR SELECT USING (
    booking_id IN (SELECT id FROM bookings WHERE customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()))
    OR EXISTS (SELECT 1 FROM assessors WHERE auth_user_id = auth.uid())
  );
