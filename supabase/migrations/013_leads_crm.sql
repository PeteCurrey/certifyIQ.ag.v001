-- Create the leads table for all website enquiries
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Contact info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,

  -- Lead metadata
  source TEXT NOT NULL DEFAULT 'website', -- 'contact_form', 'partner_form', 'booking_enquiry', 'estimate'
  enquiry_type TEXT, -- 'Developer', 'Agent', 'Corporate', 'Landlord', 'General'
  message TEXT,
  volume TEXT, -- estimated monthly volume for partner leads

  -- CRM status
  status TEXT NOT NULL DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'converted', 'lost'
  priority TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high'
  assigned_to UUID REFERENCES assessors(id),
  notes TEXT,
  
  -- Extra data (flexible JSONB for any form-specific fields)
  extra_data JSONB DEFAULT '{}'
);

-- RLS: only super admins and admins can read/write leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_full_leads_access" ON leads
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM assessors
      WHERE auth_user_id = auth.uid()
      AND (is_admin = true OR is_super_admin = true)
    )
  );

-- Index for common lookups
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
