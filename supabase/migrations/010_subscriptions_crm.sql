-- Migration: 010_subscriptions_crm
-- Estate Agent Portal, CRM, and Stripe Subscriptions

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_id TEXT, -- 'price_agency_pro', 'price_agency_enterprise', etc.
  status TEXT, -- 'active', 'trialing', 'past_due', 'canceled'
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_org ON public.subscriptions(org_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe ON public.subscriptions(stripe_subscription_id);

-- Add CRM columns to document_leads if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='document_leads' AND column_name='assigned_to') THEN
    ALTER TABLE public.document_leads ADD COLUMN assigned_to UUID REFERENCES auth.users(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='document_leads' AND column_name='status') THEN
    ALTER TABLE public.document_leads ADD COLUMN status TEXT DEFAULT 'new'; -- 'new', 'contacted', 'qualified', 'converted', 'lost'
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='document_leads' AND column_name='org_id') THEN
    ALTER TABLE public.document_leads ADD COLUMN org_id UUID REFERENCES public.organizations(id);
  END IF;
END $$;

-- RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT
  USING (user_id = auth.uid() OR org_id IN (SELECT org_id FROM public.organizations WHERE owner_id = auth.uid()));

CREATE POLICY "Service role can manage subscriptions" ON public.subscriptions FOR ALL
  USING (true) WITH CHECK (true);
