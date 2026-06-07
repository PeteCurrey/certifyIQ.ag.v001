-- =============================================================
-- AVORRIA: COMBINED FIX SCRIPT
-- Run this entire script in Supabase SQL Editor
-- Fixes: Login, Leads table, QA Alerts RLS
-- =============================================================


-- ────────────────────────────────────────────────────────────
-- FIX 1: SUPER ADMIN LOGIN
-- Ensures petecurrey@gmail.com is registered in aos_users
-- as super_admin with active status.
-- NOTE: You still need to create the auth user via Supabase
-- Authentication dashboard (see instructions below).
-- ────────────────────────────────────────────────────────────

-- Upsert Pete's record with the gmail address
INSERT INTO public.aos_users (name, email, role, status)
VALUES ('Pete Currey', 'petecurrey@gmail.com', 'super_admin', 'active')
ON CONFLICT (email) DO UPDATE
  SET role = 'super_admin',
      status = 'active';

-- Also ensure the avorria.co.uk address is present as super_admin
INSERT INTO public.aos_users (name, email, role, status)
VALUES ('Pete Currey', 'pete@avorria.co.uk', 'super_admin', 'active')
ON CONFLICT (email) DO UPDATE
  SET role = 'super_admin',
      status = 'active';


-- ────────────────────────────────────────────────────────────
-- FIX 2: LEADS TABLE
-- Creates the public.leads table if it doesn't exist.
-- ────────────────────────────────────────────────────────────

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

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "AOS users can view leads" ON public.leads;
DROP POLICY IF EXISTS "AOS users can insert leads" ON public.leads;
DROP POLICY IF EXISTS "AOS users can update leads" ON public.leads;
DROP POLICY IF EXISTS "AOS users can delete leads" ON public.leads;
DROP POLICY IF EXISTS "Super admin full access leads" ON public.leads;

-- Allow any active AOS user to manage leads
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

-- Updated_at trigger
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


-- ────────────────────────────────────────────────────────────
-- FIX 3: QA ALERTS — RLS on aos_audit_log
-- Ensures super_admin can read the audit log table
-- ────────────────────────────────────────────────────────────

-- Make sure aos_audit_log exists (it was created in migration 017)
-- Add super_admin RLS policy if not already present
DROP POLICY IF EXISTS "Super admin has full control over audit log" ON public.aos_audit_log;

CREATE POLICY "Super admin has full control over audit log" ON public.aos_audit_log
  FOR ALL USING (public.is_super_admin());

-- Also ensure active AOS users can read the audit log
DROP POLICY IF EXISTS "AOS users can view audit log" ON public.aos_audit_log;

CREATE POLICY "AOS users can view audit log" ON public.aos_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.aos_users
      WHERE email = auth.jwt()->>'email' AND status = 'active'
        AND role IN ('super_admin', 'admin')
    )
  );
