-- Seed Pricing Tiers
INSERT INTO pricing_tiers (service_type, property_type, min_floor_area_sqm, max_floor_area_sqm, price_gbp) VALUES
('domestic', 'flat', 0, 999, 65),
('domestic', '1-2 bed house', 0, 999, 70),
('domestic', '3 bed house', 0, 999, 80),
('domestic', '4 bed house', 0, 999, 95),
('domestic', '5+ bed house', 0, 999, 110),
('commercial', 'all', 0, 9999, 0);

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Seed Assessor User in auth.users
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at, 
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role
)
VALUES (
  '12345678-1234-1234-1234-123456789012', 
  '00000000-0000-0000-0000-000000000000', 
  'assessor@certifyiq.co.uk', 
  crypt('changeme123', gen_salt('bf')), 
  now(), 
  '{"provider": "email", "providers": ["email"]}', 
  '{}', 
  now(), 
  now(), 
  'authenticated'
) ON CONFLICT DO NOTHING;

-- Seed Assessor profile
INSERT INTO assessors (
  auth_user_id, full_name, email, phone, accreditation_body, 
  accreditation_number, accreditation_expiry, service_area_postcodes, is_active,
  attma_registration, attma_level
) VALUES (
  '12345678-1234-1234-1234-123456789012', 
  'Jane Doe (Assessor)', 
  'assessor@certifyiq.co.uk', 
  '07700900000', 
  'elmhurst', 
  'EES[PLACEHOLDER]', 
  '2026-12-31', 
  ARRAY['S40','S41','S42','S43','S44','S45','DE4','DE55'], 
  true,
  true,
  1
);

-- Seed Customers
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at, 
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role
)
VALUES (
  '87654321-4321-4321-4321-210987654321', 
  '00000000-0000-0000-0000-000000000000', 
  'customer@example.com', 
  crypt('changeme123', gen_salt('bf')), 
  now(), 
  '{"provider": "email", "providers": ["email"]}', 
  '{}', 
  now(), 
  now(), 
  'authenticated'
) ON CONFLICT DO NOTHING;

INSERT INTO customers (id, auth_user_id, full_name, email, phone, customer_type)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  '87654321-4321-4321-4321-210987654321',
  'John Smith',
  'customer@example.com',
  '07700900001',
  'homeowner'
);

-- Seed Properties
INSERT INTO properties (id, customer_id, address_line_1, town, county, postcode, property_type, bed_count) VALUES
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '10 High Street', 'Chesterfield', 'Derbyshire', 'S40 1AA', 'terraced', 3),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '15 Market Square', 'Sheffield', 'South Yorkshire', 'S1 1BB', 'flat', 2),
('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', '20 Church Lane', 'Derby', 'Derbyshire', 'DE1 1CC', 'detached', 4);

-- Seed Bookings
-- 1. Pending
INSERT INTO bookings (booking_ref, property_id, customer_id, service_type, status, preferred_date, preferred_time_slot, price_gbp)
VALUES ('CIQ-20231001-0001', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'domestic', 'pending_payment', '2023-10-15', 'morning', 80);

-- 2. Scheduled (Assessor assigned)
INSERT INTO bookings (booking_ref, property_id, customer_id, assessor_id, service_type, status, preferred_date, preferred_time_slot, confirmed_datetime, price_gbp)
VALUES ('CIQ-20231001-0002', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', (SELECT id FROM assessors WHERE email = 'assessor@certifyiq.co.uk'), 'domestic', 'scheduled', '2023-10-16', 'afternoon', '2023-10-16 14:00:00+00', 70);

-- 3. Completed (Certificate Issued)
INSERT INTO bookings (booking_ref, property_id, customer_id, assessor_id, service_type, status, preferred_date, preferred_time_slot, confirmed_datetime, price_gbp)
VALUES ('CIQ-20231001-0003', '44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', (SELECT id FROM assessors WHERE email = 'assessor@certifyiq.co.uk'), 'domestic', 'certificate_issued', '2023-10-10', 'morning', '2023-10-10 10:00:00+00', 95);

-- Seed Location SEO Pages
INSERT INTO location_seo_pages (slug, town, county, postcode_prefix, page_title, page_content, is_live) VALUES
('epc-assessor-chesterfield', 'Chesterfield', 'Derbyshire', 'S40', 'EPC Assessor in Chesterfield', 'Need an EPC in Chesterfield? We offer fast, local service.', true),
('epc-assessor-sheffield', 'Sheffield', 'South Yorkshire', 'S1', 'EPC Assessor in Sheffield', 'Need an EPC in Sheffield? We offer fast, local service.', true),
('epc-assessor-derby', 'Derby', 'Derbyshire', 'DE1', 'EPC Assessor in Derby', 'Need an EPC in Derby? We offer fast, local service.', true),
('epc-assessor-matlock', 'Matlock', 'Derbyshire', 'DE4', 'EPC Assessor in Matlock', 'Need an EPC in Matlock? We offer fast, local service.', true),
('epc-assessor-dronfield', 'Dronfield', 'Derbyshire', 'S18', 'EPC Assessor in Dronfield', 'Need an EPC in Dronfield? We offer fast, local service.', true),
('epc-assessor-staveley', 'Staveley', 'Derbyshire', 'S43', 'EPC Assessor in Staveley', 'Need an EPC in Staveley? We offer fast, local service.', true),
-- Air tightness testing
('air-tightness-testing-chesterfield', 'Chesterfield', 'Derbyshire', 'S40', 'Air Tightness Testing in Chesterfield', 'Looking for accredited air tightness testing in Chesterfield? Our ATTMA-accredited engineers deliver fast results.', true),
('air-tightness-testing-derbyshire', 'Matlock', 'Derbyshire', 'DE4', 'Air Tightness Testing in Derbyshire', 'Mandatory Part L air tightness testing across Derbyshire. ATTMA-certified engineers with on-site results.', true),
('air-tightness-testing-sheffield', 'Sheffield', 'South Yorkshire', 'S1', 'Air Tightness Testing in Sheffield', 'Expert air tightness testing in Sheffield. Complete Part L compliance support for residential and commercial builds.', true),
('air-tightness-testing-east-midlands', 'Derby', 'Derbyshire', 'DE1', 'Air Tightness Testing in the East Midlands', 'Professional air permeability and blower door testing services across Derby and the East Midlands.', true),
('air-permeability-testing-chesterfield', 'Chesterfield', 'Derbyshire', 'S40', 'Air Permeability Testing in Chesterfield', 'ATTMA TS1 air permeability testing for new build dwellings in Chesterfield. Quick turnaround.', true),
('blower-door-testing-derbyshire', 'Matlock', 'Derbyshire', 'DE4', 'Blower Door Testing in Derbyshire', 'Blower door fan testing for new build compliance across Derbyshire. Certified ATTMA Level 1 & 2 engineers.', true),
-- SAP calculations
('sap-calculations-chesterfield', 'Chesterfield', 'Derbyshire', 'S40', 'SAP Calculations in Chesterfield', 'Accredited SAP calculations for new build houses, extensions, and conversions in Chesterfield.', true),
('sap-calculations-derbyshire', 'Matlock', 'Derbyshire', 'DE4', 'SAP Calculations in Derbyshire', 'Part L SAP calculations for Derbyshire developers. Design-stage and as-built compliance documents.', true),
('new-build-epc-chesterfield', 'Chesterfield', 'Derbyshire', 'S40', 'New Build EPC in Chesterfield', 'On-Construction EPCs for new build properties in Chesterfield. Registered with Elmhurst Energy.', true),
('new-build-epc-derbyshire', 'Matlock', 'Derbyshire', 'DE4', 'New Build EPC in Derbyshire', 'On-Construction energy assessments and final EPC lodgements for Derbyshire developments.', true),
('ocdea-chesterfield', 'Chesterfield', 'Derbyshire', 'S40', 'OCDEA in Chesterfield', 'Accredited On-Construction Domestic Energy Assessors (OCDEAs) based in Chesterfield.', true),
('ocdea-derbyshire', 'Matlock', 'Derbyshire', 'DE4', 'OCDEA in Derbyshire', 'Expert OCDEAs providing SAP calculations and Predicted Energy Assessments (PEAs) in Derbyshire.', true),
-- Commercial EPC
('commercial-epc-chesterfield', 'Chesterfield', 'Derbyshire', 'S40', 'Commercial EPC in Chesterfield', 'Accredited Level 3 and Level 4 Non-Domestic Energy Assessors providing Commercial EPCs in Chesterfield.', true),
('commercial-epc-derbyshire', 'Matlock', 'Derbyshire', 'DE4', 'Commercial EPC in Derbyshire', 'Commercial energy assessments and SBEM calculations across Derbyshire. Fast quote response.', true),
('non-domestic-epc-chesterfield', 'Chesterfield', 'Derbyshire', 'S40', 'Non-Domestic EPC in Chesterfield', 'Official non-domestic energy performance certificates (EPCs) for offices, shops, and warehouses in Chesterfield.', true),
('ndea-chesterfield', 'Chesterfield', 'Derbyshire', 'S40', 'NDEA in Chesterfield', 'Non-Domestic Energy Assessors (NDEAs) based in Chesterfield for commercial properties.', true);

-- Seed Blog Posts
INSERT INTO blog_posts (slug, title, excerpt, content, seo_title, seo_description, published, published_at) VALUES
('what-is-rdsap-10', 'What is RdSAP 10 and why it matters for your EPC', 'RdSAP 10 is the new methodology for calculating EPCs. Heres what you need to know.', '# What is RdSAP 10? \n\nRdSAP 10 is the latest methodology...', 'What is RdSAP 10? | CertifyIQ', 'Learn about the new RdSAP 10 methodology for EPCs.', true, now()),
('epc-ratings-for-landlords-2028', 'EPC ratings for landlords: everything you need to know before 2028', 'From 2028, rental properties will need a minimum C rating. Heres how to prepare.', '# EPC rules are changing \n\nIf you are a landlord...', 'EPC rules for landlords 2028 | CertifyIQ', 'A guide for landlords on the new EPC rules coming in 2028.', true, now());
