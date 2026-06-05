-- Migration: 008_master_compliance_dashboard
-- Description: Unified architecture for the master compliance dashboard serving all user types.

-- 1. Organizations (For multi-tenant setups like Agencies, Housing Associations, Developers)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    org_type TEXT NOT NULL, -- e.g., 'Agency', 'Developer', 'Housing Association'
    billing_status TEXT DEFAULT 'active',
    subscription_tier TEXT DEFAULT 'Free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Master Properties Table
CREATE TABLE IF NOT EXISTS public.master_properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL, -- Null if single homeowner/landlord
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- The primary user who owns this record
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    town TEXT NOT NULL,
    county TEXT,
    postcode TEXT NOT NULL,
    uprn TEXT UNIQUE, -- Unique Property Reference Number (optional but good for master records)
    property_type TEXT,
    construction_type TEXT,
    tenancy_status TEXT, -- e.g., 'Let', 'Vacant', 'Owner Occupied', 'Under Construction'
    floor_area_sqm NUMERIC,
    compliance_score INTEGER DEFAULT 0 CHECK (compliance_score >= 0 AND compliance_score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Compliance Records (Certificates & Reports)
CREATE TABLE IF NOT EXISTS public.compliance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.master_properties(id) ON DELETE CASCADE,
    record_type TEXT NOT NULL, -- e.g., 'EPC', 'EICR', 'Gas Safety', 'Fire Risk'
    status TEXT NOT NULL, -- 'Valid', 'Expired', 'Action Required', 'Pending'
    issue_date DATE,
    expiry_date DATE,
    rating TEXT, -- e.g., 'C' for EPC, 'Satisfactory' for EICR
    document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tasks (Auto-generated or Manual)
CREATE TABLE IF NOT EXISTS public.compliance_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.master_properties(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    status TEXT DEFAULT 'Pending', -- 'Pending', 'In Progress', 'Completed'
    is_auto_generated BOOLEAN DEFAULT FALSE,
    estimated_cost NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'Alert', 'Reminder', 'System'
    read_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- We need a mapping table for Users <-> Organizations
CREATE TABLE IF NOT EXISTS public.org_users (
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member', -- 'admin', 'member'
    PRIMARY KEY (org_id, user_id)
);
ALTER TABLE public.org_users ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Super restrictive for now, assuming server-side bypass for complex logic)
CREATE POLICY "Users can view their organizations" 
ON public.organizations FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.org_users WHERE org_users.org_id = organizations.id AND org_users.user_id = auth.uid()));

CREATE POLICY "Users can view their properties" 
ON public.master_properties FOR SELECT 
USING (owner_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.org_users WHERE org_users.org_id = master_properties.org_id AND org_users.user_id = auth.uid()
));

CREATE POLICY "Users can insert their properties" 
ON public.master_properties FOR INSERT 
WITH CHECK (owner_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.org_users WHERE org_users.org_id = master_properties.org_id AND org_users.user_id = auth.uid()
));

CREATE POLICY "Users can update their properties" 
ON public.master_properties FOR UPDATE 
USING (owner_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.org_users WHERE org_users.org_id = master_properties.org_id AND org_users.user_id = auth.uid()
));

CREATE POLICY "Users can view compliance records for their properties" 
ON public.compliance_records FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.master_properties 
    WHERE master_properties.id = compliance_records.property_id 
    AND (master_properties.owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.org_users WHERE org_users.org_id = master_properties.org_id AND org_users.user_id = auth.uid()
    ))
));

CREATE POLICY "Users can view tasks for their properties" 
ON public.compliance_tasks FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.master_properties 
    WHERE master_properties.id = compliance_tasks.property_id 
    AND (master_properties.owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.org_users WHERE org_users.org_id = master_properties.org_id AND org_users.user_id = auth.uid()
    ))
));

CREATE POLICY "Users can view their own notifications" 
ON public.notifications FOR SELECT 
USING (user_id = auth.uid());
