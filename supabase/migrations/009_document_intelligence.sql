-- Migration: 009_document_intelligence
-- AI EPC Explainer & Property Document Intelligence Platform

CREATE TABLE IF NOT EXISTS public.document_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT, -- for anonymous users
  document_type TEXT, -- 'EPC', 'Commercial EPC', 'SAP', 'BRUKL', 'Gas Safety', 'EICR', 'Fire Risk', 'Air Test', etc.
  analysis_mode TEXT DEFAULT 'auto', -- 'epc', 'commercial', 'developer', 'landlord', 'generic'
  file_url TEXT,
  file_name TEXT,
  property_address TEXT,
  raw_extraction JSONB DEFAULT '{}', -- Claude's raw structured data
  analysis_result JSONB DEFAULT '{}', -- Full analysis: summary, risks, improvements, costs
  health_score INTEGER CHECK (health_score >= 0 AND health_score <= 100),
  compliance_rating TEXT, -- 'Excellent', 'Good', 'Moderate', 'At Risk', 'Critical'
  lead_score INTEGER DEFAULT 0,
  services_recommended JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.analysis_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES public.document_analyses(id) ON DELETE CASCADE,
  messages JSONB DEFAULT '[]', -- array of {role, content}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.document_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES public.document_analyses(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  property_address TEXT,
  document_type TEXT,
  health_score INTEGER,
  services_recommended JSONB DEFAULT '[]',
  lead_score INTEGER DEFAULT 0,
  converted BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_analyses_session ON public.document_analyses(session_id);
CREATE INDEX IF NOT EXISTS idx_analyses_user ON public.document_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_type ON public.document_analyses(document_type);
CREATE INDEX IF NOT EXISTS idx_chats_analysis ON public.analysis_chats(analysis_id);

-- RLS
ALTER TABLE public.document_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_leads ENABLE ROW LEVEL SECURITY;

-- Public read for own session analyses (anonymous users use session_id)
CREATE POLICY "Anyone can insert analyses" ON public.document_analyses FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read own analyses" ON public.document_analyses FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Anyone can insert chats" ON public.analysis_chats FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read chats" ON public.analysis_chats FOR SELECT USING (true);
CREATE POLICY "Anyone can update chats" ON public.analysis_chats FOR UPDATE USING (true);

CREATE POLICY "Anyone can insert leads" ON public.document_leads FOR INSERT WITH CHECK (true);
