-- Migration: 011_aos_core
-- Avorria Assessor Operating System (AOS) Database Schema

-- Assessors Profile
CREATE TABLE IF NOT EXISTS public.aos_assessors (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  region TEXT,
  qualifications JSONB DEFAULT '[]', -- ['DEA', 'NDEA', 'OCDEA', 'Gas Safe']
  accreditation_number TEXT,
  is_active BOOLEAN DEFAULT true,
  daily_capacity_hours INTEGER DEFAULT 8,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AOS Jobs (Dispatch)
CREATE TABLE IF NOT EXISTS public.aos_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessor_id UUID REFERENCES public.aos_assessors(id) ON DELETE SET NULL,
  property_address TEXT NOT NULL,
  postcode TEXT,
  service_type TEXT NOT NULL, -- 'Domestic EPC', 'Commercial EPC', 'Air Test'
  customer_name TEXT,
  customer_phone TEXT,
  access_instructions TEXT,
  scheduled_date DATE,
  scheduled_time_start TIME,
  scheduled_time_end TIME,
  status TEXT DEFAULT 'Pending', -- 'Pending', 'Dispatched', 'En Route', 'On Site', 'Completed', 'Cancelled'
  price DECIMAL(10, 2),
  payment_status TEXT DEFAULT 'Unpaid',
  route_order INTEGER, -- Used by the route planner
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AOS Surveys (The actual data captured on site)
CREATE TABLE IF NOT EXISTS public.aos_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.aos_jobs(id) ON DELETE CASCADE,
  assessor_id UUID REFERENCES public.aos_assessors(id),
  survey_data JSONB DEFAULT '{}', -- All the structured data (walls, roof, heating, dimensions)
  voice_notes JSONB DEFAULT '[]', -- Array of text transcribed from voice
  audit_status TEXT DEFAULT 'Pending', -- 'Pending', 'AI Passed', 'AI Flagged', 'Manual Review', 'Approved'
  audit_flags JSONB DEFAULT '[]', -- AI generated warnings
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AOS Photos (Evidence capture)
CREATE TABLE IF NOT EXISTS public.aos_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.aos_jobs(id) ON DELETE CASCADE,
  survey_id UUID REFERENCES public.aos_surveys(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- 'Front Elevation', 'Boiler', 'Loft', 'Meter', etc.
  photo_url TEXT NOT NULL,
  lat DECIMAL(10, 6),
  lng DECIMAL(10, 6),
  ai_tags JSONB DEFAULT '[]', -- Tags applied by Claude Vision (e.g. 'Combi Boiler', 'Double Glazed')
  ai_confidence INTEGER, -- 0-100
  assessor_approved BOOLEAN DEFAULT false,
  captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_aos_jobs_assessor ON public.aos_jobs(assessor_id);
CREATE INDEX idx_aos_jobs_date ON public.aos_jobs(scheduled_date);
CREATE INDEX idx_aos_surveys_job ON public.aos_surveys(job_id);
CREATE INDEX idx_aos_photos_job ON public.aos_photos(job_id);

-- RLS
ALTER TABLE public.aos_assessors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aos_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aos_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aos_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Assessors can view own profile" ON public.aos_assessors FOR SELECT USING (id = auth.uid());
CREATE POLICY "Assessors can update own profile" ON public.aos_assessors FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Assessors can view own jobs" ON public.aos_jobs FOR SELECT USING (assessor_id = auth.uid());
CREATE POLICY "Assessors can update own jobs" ON public.aos_jobs FOR UPDATE USING (assessor_id = auth.uid());

CREATE POLICY "Assessors can view own surveys" ON public.aos_surveys FOR SELECT USING (assessor_id = auth.uid());
CREATE POLICY "Assessors can manage own surveys" ON public.aos_surveys FOR ALL USING (assessor_id = auth.uid()) WITH CHECK (assessor_id = auth.uid());

CREATE POLICY "Assessors can manage photos" ON public.aos_photos FOR ALL USING (true) WITH CHECK (true);

-- Admins can do everything
CREATE POLICY "Admins full access aos_assessors" ON public.aos_assessors FOR ALL USING (true);
CREATE POLICY "Admins full access aos_jobs" ON public.aos_jobs FOR ALL USING (true);
CREATE POLICY "Admins full access aos_surveys" ON public.aos_surveys FOR ALL USING (true);
