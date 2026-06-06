-- Migration: 019_create_leads_table
-- Description: Create the leads CRM table for storing website enquiries

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  enquiry_type TEXT DEFAULT 'General',
  source TEXT DEFAULT 'website',
  message TEXT,
  volume TEXT,
  status TEXT DEFAULT 'new',
  priority TEXT DEFAULT 'medium',
  notes TEXT,
  extra_data JSONB,
  assigned_to UUID REFERENCES public.aos_users(id) ON DELETE SET NULL
);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_leads_timestamp ON public.leads;
CREATE TRIGGER update_leads_timestamp
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION update_leads_updated_at();

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow service role to do everything (bypasses RLS anyway, but good for clarity)
-- We will allow authenticated users to view and edit leads if they have a role in aos_users
CREATE POLICY "AOS users can view leads" ON public.leads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.aos_users 
      WHERE email = auth.jwt()->>'email' AND status = 'active'
    )
  );

CREATE POLICY "AOS users can insert leads" ON public.leads
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.aos_users 
      WHERE email = auth.jwt()->>'email' AND status = 'active'
    )
  );

CREATE POLICY "AOS users can update leads" ON public.leads
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.aos_users 
      WHERE email = auth.jwt()->>'email' AND status = 'active'
    )
  );

CREATE POLICY "AOS users can delete leads" ON public.leads
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.aos_users 
      WHERE email = auth.jwt()->>'email' AND status = 'active'
    )
  );
