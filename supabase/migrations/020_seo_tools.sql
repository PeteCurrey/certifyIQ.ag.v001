-- Keyword Tracking
CREATE TABLE IF NOT EXISTS keyword_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword text NOT NULL,
  target_url text NOT NULL,
  search_volume integer DEFAULT 0,
  difficulty integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS keyword_positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_id uuid REFERENCES keyword_tracking(id) ON DELETE CASCADE,
  position integer NOT NULL,
  recorded_at timestamptz DEFAULT now()
);

-- Content Calendar
CREATE TABLE IF NOT EXISTS content_calendar (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  target_keyword text,
  status text DEFAULT 'draft', -- draft, in_progress, review, published
  assigned_to uuid REFERENCES public.aos_users(id),
  publish_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Redirects
CREATE TABLE IF NOT EXISTS seo_redirects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_path text NOT NULL UNIQUE,
  destination_path text NOT NULL,
  type integer DEFAULT 301, -- 301 or 302
  is_active boolean DEFAULT true,
  hits integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS Policies
ALTER TABLE keyword_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_redirects ENABLE ROW LEVEL SECURITY;

-- Super Admin can read/write everything
CREATE POLICY "Super admin full access keyword_tracking" ON keyword_tracking FOR ALL USING (
  EXISTS (SELECT 1 FROM public.aos_users WHERE email = auth.jwt()->>'email' AND role = 'super_admin')
);
CREATE POLICY "Super admin full access keyword_positions" ON keyword_positions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.aos_users WHERE email = auth.jwt()->>'email' AND role = 'super_admin')
);
CREATE POLICY "Super admin full access content_calendar" ON content_calendar FOR ALL USING (
  EXISTS (SELECT 1 FROM public.aos_users WHERE email = auth.jwt()->>'email' AND role = 'super_admin')
);
CREATE POLICY "Super admin full access seo_redirects" ON seo_redirects FOR ALL USING (
  EXISTS (SELECT 1 FROM public.aos_users WHERE email = auth.jwt()->>'email' AND role = 'super_admin')
);

-- Give public access to read active redirects (needed for middleware)
CREATE POLICY "Public read redirects" ON seo_redirects FOR SELECT USING (is_active = true);
