-- Migration: 012_aos_polish
-- AOS polish additions: assessor status tracking, audit log, survey photos

-- Assessor status tracking on existing bookings table
ALTER TABLE IF EXISTS bookings
  ADD COLUMN IF NOT EXISTS assessor_status text DEFAULT 'not_started',
  ADD COLUMN IF NOT EXISTS assessor_status_updated_at timestamptz;

-- Audit log table — stores every Claude AI audit result before lodgement
CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  assessment_id uuid REFERENCES assessments(id) ON DELETE CASCADE,
  assessor_id uuid REFERENCES assessors(id) ON DELETE SET NULL,
  audit_result jsonb NOT NULL,
  overall_status text CHECK (overall_status IN ('pass', 'pass_with_warnings', 'fail')),
  can_submit boolean DEFAULT false,
  flag_count_critical integer DEFAULT 0,
  flag_count_warning integer DEFAULT 0,
  flag_count_info integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Survey photos table — replaces ad-hoc photo storage
CREATE TABLE IF NOT EXISTS survey_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES assessments(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  public_url text,
  photo_category text,
  ai_tags jsonb DEFAULT '[]',
  ai_primary_element text,
  ai_confidence text,
  ai_flags jsonb DEFAULT '[]',
  ai_note_suggestion text,
  evidence_quality text CHECK (evidence_quality IN ('good', 'poor', 'unusable')),
  sequence_number integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- RLS for audit_log
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "assessors_read_own_audits" ON audit_log
  FOR SELECT USING (
    assessor_id IN (SELECT id FROM assessors WHERE auth_user_id = auth.uid())
  );

CREATE POLICY IF NOT EXISTS "admins_full_audit_access" ON audit_log
  FOR ALL USING (
    EXISTS (SELECT 1 FROM assessors WHERE auth_user_id = auth.uid() AND (is_admin = true OR is_super_admin = true))
  );

-- RLS for survey_photos
ALTER TABLE survey_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "assessors_manage_own_photos" ON survey_photos
  FOR ALL USING (
    booking_id IN (
      SELECT b.id FROM bookings b
      JOIN assessors a ON b.assessor_id = a.id
      WHERE a.auth_user_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_log_booking ON audit_log(booking_id);
CREATE INDEX IF NOT EXISTS idx_survey_photos_booking ON survey_photos(booking_id);
CREATE INDEX IF NOT EXISTS idx_survey_photos_assessment ON survey_photos(assessment_id);

-- Assessor notes on assessments table
ALTER TABLE IF EXISTS assessments
  ADD COLUMN IF NOT EXISTS assessor_notes text,
  ADD COLUMN IF NOT EXISTS voice_notes_text text,
  ADD COLUMN IF NOT EXISTS survey_data_json jsonb DEFAULT '{}';
