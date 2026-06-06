-- Extend service_type to include new services
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_service_type_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_service_type_check
  CHECK (service_type IN (
    'domestic', 'commercial_level3', 'commercial_level4', 'commercial_level5',
    'commercial_dec', 'commercial_tm44',
    'on_construction_design', 'on_construction_as_built',
    'on_construction_full', 'air_tightness_domestic',
    'air_tightness_commercial', 'desktop_review',
    'water_calculation', 'overheating_assessment', 'brukl_report'
  ));

-- Add VAT and payment method fields to bookings
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS vat_applicable boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS vat_amount_gbp numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_inc_vat_gbp numeric,
  ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'stripe'
    CHECK (payment_method IN ('stripe', 'bacs', 'agent_monthly', 'quote')),
  ADD COLUMN IF NOT EXISTS bacs_invoice_ref text,
  ADD COLUMN IF NOT EXISTS bacs_invoice_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS bacs_payment_received_at timestamptz,
  ADD COLUMN IF NOT EXISTS company_name text,
  ADD COLUMN IF NOT EXISTS company_address text,
  ADD COLUMN IF NOT EXISTS vat_number text,
  ADD COLUMN IF NOT EXISTS purchase_order_number text,
  -- Commercial-specific fields
  ADD COLUMN IF NOT EXISTS floor_area_sqm numeric,
  ADD COLUMN IF NOT EXISTS ac_system_kw numeric,
  ADD COLUMN IF NOT EXISTS ac_unit_count integer,
  ADD COLUMN IF NOT EXISTS building_use_type text;

-- Update pricing_tiers with commercial EPC bands
DELETE FROM pricing_tiers WHERE service_type LIKE 'commercial%';

INSERT INTO pricing_tiers (service_type, property_type,
  min_floor_area_sqm, max_floor_area_sqm, price_gbp, is_active)
VALUES
  -- Commercial EPC Level 3 (prices exc VAT)
  ('commercial_level3', 'commercial', 0,    100,  185,  true),
  ('commercial_level3', 'commercial', 101,  250,  275,  true),
  ('commercial_level3', 'commercial', 251,  500,  375,  true),
  ('commercial_level3', 'commercial', 501,  750,  475,  true),
  ('commercial_level3', 'commercial', 751,  1000, 595,  true),
  ('commercial_level3', 'commercial', 1001, 9999, 0,    false), -- quote
  -- Commercial EPC Level 4 (all quote)
  ('commercial_level4', 'commercial', 0,    9999, 0,    false),
  -- Commercial EPC Level 5 (all quote)
  ('commercial_level5', 'commercial', 0,    9999, 0,    false),
  -- Display Energy Certificate (by floor area, exc VAT)
  ('commercial_dec', 'public_building', 250,  999,  245,  true),
  ('commercial_dec', 'public_building', 1000, 2500, 395,  true),
  ('commercial_dec', 'public_building', 2501, 9999, 0,    false), -- quote
  -- TM44 (by AC unit count, exc VAT)
  ('commercial_tm44', 'commercial', 0, 9999, 0, false); -- always quote

-- NEW TABLE: tm44_assessments
CREATE TABLE IF NOT EXISTS tm44_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id),
  assessor_id uuid REFERENCES assessors(id),
  status text DEFAULT 'not_started',

  -- Building details
  building_name text,
  building_type text,
  total_floor_area_sqm numeric,
  ac_floor_area_sqm numeric,

  -- AC system details
  total_system_kw numeric,
  unit_count integer,
  system_types text[],
  oldest_system_install_year integer,
  refrigerant_types text[],

  -- Inspection findings
  units_data jsonb DEFAULT '[]',

  -- Results
  overall_efficiency_rating text,
  key_recommendations jsonb DEFAULT '[]',
  estimated_annual_saving_gbp numeric,
  estimated_co2_saving_tonnes numeric,

  -- Certification
  landmark_certificate_ref text,
  certificate_issued_date date,
  next_inspection_due date,
  certificate_url text,

  assessor_notes text,
  ai_flags jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- NEW TABLE: dec_assessments
CREATE TABLE IF NOT EXISTS dec_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id),
  assessor_id uuid REFERENCES assessors(id),
  status text DEFAULT 'not_started',

  -- Building details
  building_name text NOT NULL,
  building_type text,
  occupying_authority text,
  total_floor_area_sqm numeric,
  operating_hours_per_week numeric,

  -- Assessment period
  assessment_year_start date,
  assessment_year_end date,

  -- Energy consumption data
  electricity_kwh numeric,
  gas_kwh numeric,
  oil_kwh numeric,
  other_fuel_kwh numeric,
  other_fuel_type text,

  -- Results
  operational_rating integer,
  dec_band text,
  typical_building_rating integer,
  energy_use_intensity numeric,

  -- Advisory Report
  advisory_report_included boolean DEFAULT true,
  advisory_report_ref text,
  advisory_report_valid_until date,

  -- Certification
  landmark_certificate_ref text,
  dec_valid_until date,
  certificate_url text,
  advisory_report_url text,

  assessor_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- NEW TABLE: bacs_invoices
CREATE TABLE IF NOT EXISTS bacs_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id),
  invoice_ref text UNIQUE,
  invoice_number_seq integer,

  -- Client details
  client_name text,
  company_name text,
  company_address text,
  vat_number text,
  purchase_order_number text,
  billing_email text,

  -- Amounts
  subtotal_gbp numeric,
  vat_gbp numeric,
  total_gbp numeric,

  -- Bank details
  bank_name text DEFAULT 'Barclays Bank',
  account_name text DEFAULT 'Avorria Ltd',
  sort_code text DEFAULT '00-00-00',
  account_number text DEFAULT '00000000',
  payment_reference text,

  -- Status
  status text DEFAULT 'issued'
    CHECK (status IN (
      'draft', 'issued', 'sent', 'paid', 'overdue', 'void'
    )),
  due_date date,
  issued_at timestamptz DEFAULT now(),
  paid_at timestamptz,
  paid_amount_gbp numeric,

  -- Document
  pdf_url text,
  resend_email_id text,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Auto-increment invoice sequence
CREATE SEQUENCE IF NOT EXISTS bacs_invoice_seq START 1001;

-- Invoice number function
CREATE OR REPLACE FUNCTION generate_bacs_invoice_ref()
RETURNS TRIGGER AS $$
BEGIN
  NEW.invoice_number_seq := nextval('bacs_invoice_seq');
  NEW.invoice_ref := 'AVR-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEW.invoice_number_seq::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_bacs_invoice_ref
  BEFORE INSERT ON bacs_invoices
  FOR EACH ROW EXECUTE FUNCTION generate_bacs_invoice_ref();

-- RLS
ALTER TABLE tm44_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE dec_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bacs_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "assessors_manage_tm44" ON tm44_assessments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role IN ('assessor', 'admin'))
  );

CREATE POLICY "assessors_manage_dec" ON dec_assessments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role IN ('assessor', 'admin'))
  );

CREATE POLICY "admin_manage_invoices" ON bacs_invoices
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role IN ('admin', 'assessor'))
  );

-- Create Storage bucket for BACS invoices
INSERT INTO storage.buckets (id, name, public) VALUES ('bacs-invoices', 'bacs-invoices', false) ON CONFLICT DO NOTHING;

CREATE POLICY "admin_manage_bacs_storage" ON storage.objects
  FOR ALL USING (bucket_id = 'bacs-invoices' AND EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role IN ('admin', 'assessor')));

-- NEW TABLE: system_settings (for Invoice configuration)
CREATE TABLE IF NOT EXISTS system_settings (
  id text PRIMARY KEY DEFAULT 'global',
  
  -- Invoice Settings
  invoice_company_name text DEFAULT 'Avorria Ltd',
  invoice_company_address text DEFAULT '123 Business Park, Chesterfield, S40 1AA',
  invoice_bank_name text DEFAULT 'Barclays Bank',
  invoice_account_name text DEFAULT 'Avorria Ltd',
  invoice_sort_code text DEFAULT '00-00-00',
  invoice_account_number text DEFAULT '00000000',
  invoice_vat_number text DEFAULT 'GB123456789',
  invoice_contact_email text DEFAULT 'billing@avorria.com',
  invoice_contact_phone text DEFAULT '0800 123 4567',

  updated_at timestamptz DEFAULT now()
);

-- Insert default row
INSERT INTO system_settings (id) VALUES ('global') ON CONFLICT DO NOTHING;

-- RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Only super admins can update settings. Anyone can read.
CREATE POLICY "anyone_can_read_settings" ON system_settings
  FOR SELECT USING (true);

CREATE POLICY "super_admin_manage_settings" ON system_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'super_admin')
  );
