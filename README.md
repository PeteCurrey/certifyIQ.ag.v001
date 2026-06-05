# CertifyIQ — UK EPC Assessments

Fast, transparent, fully accredited Energy Performance Certificates for homeowners, landlords and estate agents in Chesterfield & Derbyshire.

## Core Services

- Domestic EPCs (RdSAP 10)
- Commercial EPCs (Level 3, 4, 5)
- New Build SAP Calculations & OC-EPCs
- Part L Air Tightness Testing

## Technical Stack

- Next.js 15 App Router
- Supabase (PostgreSQL, Auth, Storage, RLS)
- Stripe Payments Integration
- Resend for transactional emails
- Vercel for deployment

## Assessor Accreditation Notes

All assessors operating on this platform must hold valid, up-to-date accreditation:

- **Domestic/Commercial EPCs**: Must hold active Elmhurst Energy or Stroma RdSAP/NDEA accreditation.
- **SAP / OC-EPCs**: Must be registered as an On-Construction Domestic Energy Assessor (OCDEA).
- **Air Tightness Testing**: Assessors must be ATTMA registered (Level 1 for Domestic, Level 2 for Commercial).

*When onboarding new assessors in the Supabase `assessors` table, ensure the `attma_registration` (boolean) and `attma_level` (integer) columns are populated appropriately to permit them to lodge Air Tests.*
