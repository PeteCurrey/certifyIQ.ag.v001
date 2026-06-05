-- Seed Location SEO Pages
INSERT INTO location_seo_pages (slug, town, county, postcode_prefix, page_title, page_content, is_live)
VALUES
  (
    'chesterfield',
    'Chesterfield',
    'Derbyshire',
    'S40',
    'EPC Assessment in Chesterfield, Derbyshire',
    'Local expert assessor for S40 covering Chesterfield. We provide fast, reliable, and professional RdSAP 10 Energy Performance Certificates for all types of domestic properties in the area. Book a certified energy assessment today to comply with local letting and selling regulations.',
    true
  ),
  (
    'matlock',
    'Matlock',
    'Derbyshire',
    'DE4',
    'EPC Assessment in Matlock, Derbyshire',
    'Local expert assessor for DE4 covering Matlock. We provide fast, reliable, and professional RdSAP 10 Energy Performance Certificates for all types of domestic properties in the area. Book a certified energy assessment today to comply with local letting and selling regulations.',
    true
  ),
  (
    'sheffield',
    'Sheffield',
    'South Yorkshire',
    'S1',
    'EPC Assessment in Sheffield, South Yorkshire',
    'Local expert assessor for S1 covering Sheffield. We provide fast, reliable, and professional RdSAP 10 Energy Performance Certificates for all types of domestic properties in the area. Book a certified energy assessment today to comply with local letting and selling regulations.',
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  town = EXCLUDED.town,
  county = EXCLUDED.county,
  postcode_prefix = EXCLUDED.postcode_prefix,
  page_title = EXCLUDED.page_title,
  page_content = EXCLUDED.page_content,
  is_live = EXCLUDED.is_live;
