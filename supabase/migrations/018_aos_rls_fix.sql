-- Migration: 018_aos_rls_fix
-- Fixes infinite recursion in Row Level Security (RLS) policies for aos_users and aos_audit_log

-- 1. Drop the recursive policies
DROP POLICY IF EXISTS "Super admin has full control over users" ON public.aos_users;
DROP POLICY IF EXISTS "Super admin has full control over audit log" ON public.aos_audit_log;

-- 2. Create a SECURITY DEFINER function to safely check the super_admin role without triggering RLS recursively
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.aos_users 
    WHERE email = auth.jwt()->>'email' AND role = 'super_admin'
  );
$$;

-- 3. Re-create the policies using the new non-recursive function
CREATE POLICY "Super admin has full control over users" ON public.aos_users
  FOR ALL USING (public.is_super_admin());

CREATE POLICY "Super admin has full control over audit log" ON public.aos_audit_log
  FOR ALL USING (public.is_super_admin());
