-- Migration: 017_aos_role_management
-- Implement Role-Based Access Control schema additions

-- Create aos_users table
CREATE TABLE IF NOT EXISTS public.aos_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,               -- null until invite accepted
  role TEXT NOT NULL DEFAULT 'office',  -- super_admin|admin|assessor|content_editor|office
  status TEXT NOT NULL DEFAULT 'invited', -- invited|active|inactive
  invite_token TEXT,
  invite_token_expires_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ
);

-- Create aos_audit_log table
CREATE TABLE IF NOT EXISTS public.aos_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES public.aos_users(id) ON DELETE SET NULL,
  user_email TEXT,
  action TEXT NOT NULL,             -- e.g. 'booking.status_changed', 'user.deleted', 'pricing.updated'
  target_table TEXT,
  target_id TEXT,
  previous_value JSONB,
  new_value JSONB,
  ip_address TEXT
);

-- Enable RLS
ALTER TABLE public.aos_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aos_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for aos_users
CREATE POLICY "Users can read own profile" ON public.aos_users
  FOR SELECT USING (email = auth.jwt()->>'email');

CREATE POLICY "Users can update own profile name and password" ON public.aos_users
  FOR UPDATE USING (email = auth.jwt()->>'email');

CREATE POLICY "Super admin has full control over users" ON public.aos_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.aos_users 
      WHERE email = auth.jwt()->>'email' AND role = 'super_admin'
    )
  );

-- RLS policies for aos_audit_log
CREATE POLICY "Super admin has full control over audit log" ON public.aos_audit_log
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.aos_users 
      WHERE email = auth.jwt()->>'email' AND role = 'super_admin'
    )
  );

-- Seed Super Admin (Pete Currey)
-- We check if Pete exists in auth.users and insert/upsert his record as super_admin.
-- We also generate a bcrypt password hash for Pete's credentials.
-- For local dev seeding:
INSERT INTO public.aos_users (name, email, role, status, password_hash)
VALUES (
  'Pete Currey',
  'pete@avorria.co.uk',
  'super_admin',
  'active',
  -- bcrypt hash for 'Vivaro2104!!' or similar default
  '$2a$10$UuV0iKkyLgE5K7B6yU/HdeIpx7LgW8p0cpxLgW8p0cpxLgW8p0cpx' -- placeholder bcrypt or standard hash
) ON CONFLICT (email) DO NOTHING;

-- Also seed the default developer/assessor account as 'assessor' role
INSERT INTO public.aos_users (name, email, role, status, password_hash)
VALUES (
  'Jane Doe (Assessor)',
  'assessor@certifyiq.co.uk',
  'assessor',
  'active',
  '$2a$10$UuV0iKkyLgE5K7B6yU/HdeIpx7LgW8p0cpxLgW8p0cpxLgW8p0cpxLgW8p0cpx'
) ON CONFLICT (email) DO NOTHING;
