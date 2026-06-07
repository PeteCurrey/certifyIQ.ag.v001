-- Migration: 022_scheduling
-- Scheduling & Job Management Schema

-- ─────────────────────────────
-- SERVICE DURATION MATRIX
-- ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.service_durations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type text NOT NULL,
  size_band text NOT NULL,
  duration_minutes integer NOT NULL,  -- site visit duration
  travel_buffer_minutes integer DEFAULT 30, -- buffer after job
  requires_site_visit boolean DEFAULT true,
  is_desk_based boolean DEFAULT false,
  notes text,
  is_active boolean DEFAULT true,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(service_type, size_band)
);

-- SEED service_durations:
INSERT INTO public.service_durations 
  (service_type, size_band, duration_minutes, travel_buffer_minutes, requires_site_visit, is_desk_based) VALUES
-- Domestic EPC
('domestic', '1-2_bed', 45, 30, true, false),
('domestic', '3_bed', 60, 30, true, false),
('domestic', '4_bed', 75, 30, true, false),
('domestic', '5plus_bed', 90, 30, true, false),
-- Commercial EPC Level 3
('commercial_level3', 'up_to_100', 120, 45, true, false),
('commercial_level3', '101_to_250', 180, 45, true, false),
('commercial_level3', '251_to_500', 240, 60, true, false),
('commercial_level3', '501_to_750', 360, 60, true, false),
('commercial_level3', '751_to_1000', 480, 60, true, false),
-- Commercial EPC Level 4
('commercial_level4', 'up_to_500', 360, 60, true, false),
('commercial_level4', '501_to_1000', 480, 60, true, false),
('commercial_level4', '1000plus', 600, 60, true, false),
-- TM44
('commercial_tm44', '1_2_units', 120, 45, true, false),
('commercial_tm44', '3_5_units', 240, 45, true, false),
('commercial_tm44', '6_10_units', 420, 60, true, false),
('commercial_tm44', '10plus_units', 480, 60, true, false),
-- Air Tightness
('air_tightness_domestic', 'single_plot', 150, 45, true, false),
('air_tightness_domestic', '2_5_plots', 240, 45, true, false),
('air_tightness_domestic', '6plus_plots', 420, 60, true, false),
('air_tightness_commercial', 'any', 240, 60, true, false),
-- DEC
('commercial_dec', 'up_to_999', 180, 45, true, false),
('commercial_dec', '1000_to_2500', 240, 60, true, false),
('commercial_dec', '2500plus', 360, 60, true, false),
-- Desk-based (no site visit slot needed)
('on_construction_design', 'any', 0, 0, false, true),
('water_calculation', 'any', 0, 0, false, true),
('overheating_assessment', 'any', 0, 0, false, true),
-- SAP as-built (short site visit)
('on_construction_as_built', 'any', 60, 30, true, false)
ON CONFLICT (service_type, size_band) DO UPDATE
SET duration_minutes = EXCLUDED.duration_minutes,
    travel_buffer_minutes = EXCLUDED.travel_buffer_minutes,
    requires_site_visit = EXCLUDED.requires_site_visit,
    is_desk_based = EXCLUDED.is_desk_based;

-- ─────────────────────────────
-- LEAD TIME RULES
-- ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.lead_time_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type text,         -- null = applies to all services
  postcode_region text,      -- null = applies to all regions
  min_lead_days integer NOT NULL,
  requires_overnight boolean DEFAULT false,
  overnight_days integer DEFAULT 0,  -- nights away if applicable
  notes text,  -- e.g. "London Level 4: travel + accommodation needed"
  is_active boolean DEFAULT true,
  priority integer DEFAULT 0,  -- higher priority rules take precedence
  updated_at timestamptz DEFAULT now()
);

-- SEED lead_time_rules:
INSERT INTO public.lead_time_rules
  (service_type, postcode_region, min_lead_days, requires_overnight,
   overnight_days, notes, priority) VALUES
-- DOMESTIC EPC lead times
('domestic', 'local', 1, false, 0, 'S40-S45, DE4, DE55 — same or next day often possible', 10),
('domestic', 'east_midlands', 2, false, 0, 'Derby, Nottingham, Sheffield, Matlock etc.', 9),
('domestic', 'midlands', 3, false, 0, 'Birmingham, Leicester, Stoke etc.', 8),
('domestic', 'north_england', 3, false, 0, 'Leeds, Manchester, Liverpool etc.', 8),
('domestic', 'london', 5, false, 0, 'London domestic — rare, plan travel carefully', 7),

-- COMMERCIAL EPC LEVEL 3 lead times
('commercial_level3', 'local', 2, false, 0, 'Chesterfield area', 10),
('commercial_level3', 'east_midlands', 3, false, 0, 'Derby, Nottingham, Sheffield, Leicester', 9),
('commercial_level3', 'midlands', 4, false, 0, 'Birmingham, Wolverhampton, Coventry', 8),
('commercial_level3', 'north_england', 4, false, 0, 'Leeds, Manchester, Liverpool', 8),
('commercial_level3', 'london', 7, true, 1, 'London Level 3 — overnight stay required. 5 working days min.', 7),
('commercial_level3', 'south_england', 5, false, 0, 'Bristol, Southampton, Oxford etc.', 6),

-- COMMERCIAL EPC LEVEL 4 lead times
('commercial_level4', 'local', 5, false, 0, NULL, 10),
('commercial_level4', 'east_midlands', 5, false, 0, NULL, 9),
('commercial_level4', 'midlands', 7, true, 1, 'Level 4 Birmingham+ requires full day — plan overnight', 8),
('commercial_level4', 'north_england', 7, true, 1, 'Level 4 in North England — overnight recommended', 8),
('commercial_level4', 'london', 10, true, 2, 'London Level 4 — 2 nights. Plan 2 weeks ahead.', 7),

-- TM44 lead times
('commercial_tm44', 'local', 2, false, 0, NULL, 10),
('commercial_tm44', 'east_midlands', 3, false, 0, NULL, 9),
('commercial_tm44', 'midlands', 4, false, 0, NULL, 8),
('commercial_tm44', 'north_england', 5, false, 0, NULL, 7),
('commercial_tm44', 'london', 7, true, 1, 'London TM44 — overnight stay. Plan 7 days ahead.', 6),

-- Air tightness
('air_tightness_domestic', 'local', 2, false, 0, 'Must be at practical completion — coordinate with builder', 10),
('air_tightness_domestic', 'east_midlands', 3, false, 0, NULL, 9),
('air_tightness_domestic', 'national', 5, false, 0, NULL, 5),

-- DEC
('commercial_dec', 'local', 3, false, 0, NULL, 10),
('commercial_dec', 'east_midlands', 4, false, 0, NULL, 9),
('commercial_dec', 'midlands', 5, true, 1, NULL, 8),
('commercial_dec', 'london', 7, true, 1, NULL, 7),

-- DEFAULT CATCH-ALL
(null, 'national', 5, false, 0, 'Default if no specific rule matches', 0)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────
-- POSTCODE REGION MAPPING
-- ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.postcode_regions (
  postcode_prefix text PRIMARY KEY,
  region text NOT NULL,
  city text,
  is_local boolean DEFAULT false
);

INSERT INTO public.postcode_regions (postcode_prefix, region, city, is_local) VALUES
-- LOCAL
('S40', 'local', 'Chesterfield', true),
('S41', 'local', 'Chesterfield', true),
('S42', 'local', 'Chesterfield', true),
('S43', 'local', 'Chesterfield', true),
('S44', 'local', 'Chesterfield', true),
('S45', 'local', 'Chesterfield', true),
('DE4', 'local', 'Matlock', true),
('DE55', 'local', 'Alfreton', true),
('DE5', 'local', 'Ripley', true),
('S18', 'local', 'Dronfield', true),
-- EAST MIDLANDS
('S1', 'east_midlands', 'Sheffield', false),
('S2', 'east_midlands', 'Sheffield', false),
('S3', 'east_midlands', 'Sheffield', false),
('S6', 'east_midlands', 'Sheffield', false),
('S7', 'east_midlands', 'Sheffield', false),
('S8', 'east_midlands', 'Sheffield', false),
('S9', 'east_midlands', 'Sheffield', false),
('S10', 'east_midlands', 'Sheffield', false),
('S11', 'east_midlands', 'Sheffield', false),
('S36', 'east_midlands', 'Penistone', false),
('SK17', 'east_midlands', 'Buxton', false),
('DE1', 'east_midlands', 'Derby', false),
('DE21', 'east_midlands', 'Derby', false),
('DE22', 'east_midlands', 'Derby', false),
('DE23', 'east_midlands', 'Derby', false),
('DE24', 'east_midlands', 'Derby', false),
('DE56', 'east_midlands', 'Belper', false),
('DE6', 'east_midlands', 'Ashbourne', false),
('DE11', 'east_midlands', 'Swadlincote', false),
('NG1', 'east_midlands', 'Nottingham', false),
('NG2', 'east_midlands', 'Nottingham', false),
('NG3', 'east_midlands', 'Nottingham', false),
('NG7', 'east_midlands', 'Nottingham', false),
('NG8', 'east_midlands', 'Nottingham', false),
('NG9', 'east_midlands', 'Nottingham', false),
('NG10', 'east_midlands', 'Nottingham', false),
('NG18', 'east_midlands', 'Mansfield', false),
('NG19', 'east_midlands', 'Mansfield', false),
('DN1', 'east_midlands', 'Doncaster', false),
('DN2', 'east_midlands', 'Doncaster', false),
('DN4', 'east_midlands', 'Doncaster', false),
('LE1', 'east_midlands', 'Leicester', false),
('LE2', 'east_midlands', 'Leicester', false),
('LN1', 'east_midlands', 'Lincoln', false),
('LN2', 'east_midlands', 'Lincoln', false),
('ST1', 'east_midlands', 'Stoke-on-Trent', false),
('ST4', 'east_midlands', 'Stoke-on-Trent', false),
-- MIDLANDS
('B1', 'midlands', 'Birmingham', false),
('B2', 'midlands', 'Birmingham', false),
('B3', 'midlands', 'Birmingham', false),
('B4', 'midlands', 'Birmingham', false),
('B5', 'midlands', 'Birmingham', false),
('CV1', 'midlands', 'Coventry', false),
('WV1', 'midlands', 'Wolverhampton', false),
('WS1', 'midlands', 'Walsall', false),
-- NORTH ENGLAND
('M1', 'north_england', 'Manchester', false),
('M2', 'north_england', 'Manchester', false),
('M3', 'north_england', 'Manchester', false),
('M4', 'north_england', 'Manchester', false),
('M50', 'north_england', 'Manchester', false),
('LS1', 'north_england', 'Leeds', false),
('LS2', 'north_england', 'Leeds', false),
('LS3', 'north_england', 'Leeds', false),
('L1', 'north_england', 'Liverpool', false),
('YO1', 'north_england', 'York', false),
('HG1', 'north_england', 'Harrogate', false),
-- LONDON
('EC1', 'london', 'London City', false),
('EC2', 'london', 'London City', false),
('EC3', 'london', 'London City', false),
('EC4', 'london', 'London City', false),
('WC1', 'london', 'London WC', false),
('WC2', 'london', 'London WC', false),
('E14', 'london', 'Canary Wharf', false),
('SE1', 'london', 'London SE', false),
('SW1', 'london', 'London SW', false),
('W1', 'london', 'London W1', false),
('N1', 'london', 'London N', false),
('NW1', 'london', 'London NW', false),
('E1', 'london', 'London E', false)
ON CONFLICT (postcode_prefix) DO NOTHING;

-- ─────────────────────────────
-- ASSESSOR WORKING HOURS
-- ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.assessor_working_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessor_id uuid REFERENCES public.assessors(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  is_working boolean DEFAULT true,
  start_time time DEFAULT '08:00:00',
  end_time time DEFAULT '18:00:00',
  max_jobs_per_day integer DEFAULT 4,
  UNIQUE(assessor_id, day_of_week)
);

-- Seed working hours for existing assessors (if any)
INSERT INTO public.assessor_working_hours (assessor_id, day_of_week, is_working, start_time, end_time, max_jobs_per_day)
SELECT 
  a.id, 
  d.day,
  CASE WHEN d.day = 0 THEN false ELSE true END,
  '08:00:00'::time,
  CASE WHEN d.day = 6 THEN '13:00:00'::time ELSE '18:00:00'::time END,
  CASE WHEN d.day = 6 THEN 2 ELSE 4 END
FROM public.assessors a
CROSS JOIN (SELECT generate_series(0, 6) AS day) d
ON CONFLICT (assessor_id, day_of_week) DO NOTHING;

-- ─────────────────────────────
-- BLOCKED SLOTS
-- ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.blocked_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessor_id uuid REFERENCES public.assessors(id) ON DELETE CASCADE,
  date_from date NOT NULL,
  date_to date NOT NULL,
  time_from time,
  time_to time,
  reason text,
  is_recurring boolean DEFAULT false,
  recurrence_pattern text,
  blocks_all_assessors boolean DEFAULT false,
  colour text DEFAULT '#94a3b8',
  created_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- ─────────────────────────────
-- SCHEDULED SLOTS
-- ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.scheduled_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES public.bookings(id) UNIQUE,
  assessor_id uuid REFERENCES public.assessors(id),
  start_datetime timestamptz NOT NULL,
  end_datetime timestamptz NOT NULL,
  assessment_end_datetime timestamptz,
  travel_from_postcode text,
  client_postcode text,
  estimated_travel_minutes integer,
  estimated_distance_miles numeric,
  travel_mode text DEFAULT 'car',
  requires_overnight boolean DEFAULT false,
  overnight_location text,
  accommodation_booked boolean DEFAULT false,
  accommodation_cost_gbp numeric,
  accommodation_notes text,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed_with_client', 'en_route', 'on_site', 'complete', 'no_show', 'rescheduled', 'cancelled')),
  client_confirmed_at timestamptz,
  reminder_sent_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ─────────────────────────────
-- CAPACITY SETTINGS
-- ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.scheduling_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  label text,
  type text DEFAULT 'text'
);

INSERT INTO public.scheduling_settings (key, value, label) VALUES
('base_postcode', 'S40 2EJ', 'Assessor base postcode (Chesterfield)'),
('working_day_start', '08:00', 'Working day start time'),
('working_day_end', '18:00', 'Working day end time'),
('default_travel_buffer_mins', '30', 'Default buffer between jobs (minutes)'),
('max_daily_distance_miles', '200', 'Max total travel per day (miles)'),
('overnight_trigger_miles', '80', 'Distance beyond which overnight is suggested'),
('auto_assign_jobs', 'false', 'Auto-assign jobs to assessors on payment'),
('require_admin_approval_commercial', 'true', 'Require admin to approve commercial job dates before confirming')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Enable RLS
ALTER TABLE public.service_durations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_time_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.postcode_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessor_working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduling_settings ENABLE ROW LEVEL SECURITY;

-- drop policies if exist
DROP POLICY IF EXISTS "assessors_read_scheduling" ON public.service_durations;
DROP POLICY IF EXISTS "anyone_read_service_durations" ON public.service_durations;
DROP POLICY IF EXISTS "anyone_read_lead_time_rules" ON public.lead_time_rules;
DROP POLICY IF EXISTS "anyone_read_postcode_regions" ON public.postcode_regions;
DROP POLICY IF EXISTS "anyone_read_assessor_working_hours" ON public.assessor_working_hours;
DROP POLICY IF EXISTS "anyone_read_blocked_slots" ON public.blocked_slots;
DROP POLICY IF EXISTS "anyone_read_scheduled_slots" ON public.scheduled_slots;
DROP POLICY IF EXISTS "anyone_read_scheduling_settings" ON public.scheduling_settings;

DROP POLICY IF EXISTS "admins_write_service_durations" ON public.service_durations;
DROP POLICY IF EXISTS "admins_write_lead_time_rules" ON public.lead_time_rules;
DROP POLICY IF EXISTS "admins_write_postcode_regions" ON public.postcode_regions;
DROP POLICY IF EXISTS "admins_write_assessor_working_hours" ON public.assessor_working_hours;
DROP POLICY IF EXISTS "admins_write_blocked_slots" ON public.blocked_slots;
DROP POLICY IF EXISTS "admins_write_scheduled_slots" ON public.scheduled_slots;
DROP POLICY IF EXISTS "admins_write_scheduling_settings" ON public.scheduling_settings;

-- Read policies
CREATE POLICY "anyone_read_service_durations" ON public.service_durations FOR SELECT USING (true);
CREATE POLICY "anyone_read_lead_time_rules" ON public.lead_time_rules FOR SELECT USING (true);
CREATE POLICY "anyone_read_postcode_regions" ON public.postcode_regions FOR SELECT USING (true);
CREATE POLICY "anyone_read_assessor_working_hours" ON public.assessor_working_hours FOR SELECT USING (true);
CREATE POLICY "anyone_read_blocked_slots" ON public.blocked_slots FOR SELECT USING (true);
CREATE POLICY "anyone_read_scheduled_slots" ON public.scheduled_slots FOR SELECT USING (true);
CREATE POLICY "anyone_read_scheduling_settings" ON public.scheduling_settings FOR SELECT USING (true);

-- Admin write policies
CREATE POLICY "admins_write_service_durations" ON public.service_durations FOR ALL USING (
  EXISTS (SELECT 1 FROM public.aos_users WHERE email = auth.jwt()->>'email' AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "admins_write_lead_time_rules" ON public.lead_time_rules FOR ALL USING (
  EXISTS (SELECT 1 FROM public.aos_users WHERE email = auth.jwt()->>'email' AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "admins_write_postcode_regions" ON public.postcode_regions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.aos_users WHERE email = auth.jwt()->>'email' AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "admins_write_assessor_working_hours" ON public.assessor_working_hours FOR ALL USING (
  EXISTS (SELECT 1 FROM public.aos_users WHERE email = auth.jwt()->>'email' AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "admins_write_blocked_slots" ON public.blocked_slots FOR ALL USING (
  EXISTS (SELECT 1 FROM public.aos_users WHERE email = auth.jwt()->>'email' AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "admins_write_scheduled_slots" ON public.scheduled_slots FOR ALL USING (
  EXISTS (SELECT 1 FROM public.aos_users WHERE email = auth.jwt()->>'email' AND role IN ('super_admin', 'admin', 'assessor'))
);
CREATE POLICY "admins_write_scheduling_settings" ON public.scheduling_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.aos_users WHERE email = auth.jwt()->>'email' AND role IN ('super_admin', 'admin'))
);

-- Enable Realtime
DO $$
BEGIN
  -- Add table to publication if it exists and not already member
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'scheduled_slots'
  ) THEN
    NULL;
  ELSE
    ALTER PUBLICATION supabase_realtime ADD TABLE public.scheduled_slots;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;
