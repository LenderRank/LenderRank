-- LenderRep Seed Data
-- Run this AFTER schema.sql to populate the 4 sample Raleigh loan officers
-- ranking_score = avg_rating * ln(review_count + 1)

-- Add avatar_color if the table was created before this column was introduced
ALTER TABLE loan_officers ADD COLUMN IF NOT EXISTS avatar_color TEXT DEFAULT 'bg-gray-100 text-gray-600';

-- Remove existing seed rows so this script is safe to re-run
DELETE FROM loan_officers
WHERE slug IN ('sarah-johnson', 'mark-chen', 'diana-patel', 'tom-rivera');

INSERT INTO loan_officers
  (name, slug, company, city, state, initials, avatar_color, nmls_id, bio, avg_rating, review_count, ranking_score, years_experience, specialties, is_verified, is_claimed)
VALUES
  (
    'Sarah Johnson',
    'sarah-johnson',
    'Pinnacle Mortgage',
    'Raleigh',
    'NC',
    'SJ',
    'bg-green-100 text-green-900',
    '123456',
    'Sarah Johnson has been helping North Carolina families achieve homeownership for over 12 years. Specializing in FHA, VA, and conventional loans, she is known for her clear communication and ability to find creative solutions for first-time buyers and veterans alike. Sarah has closed over 500 loans in the Triangle area and consistently earns top ratings for her responsiveness and expertise.',
    4.9,
    48,
    4.9 * ln(49),
    12,
    ARRAY['FHA', 'VA', 'Conventional'],
    true,
    true
  ),
  (
    'Mark Chen',
    'mark-chen',
    'Atlantic Home Loans',
    'Raleigh',
    'NC',
    'MC',
    'bg-teal-100 text-teal-900',
    '234567',
    'Mark Chen brings 8 years of mortgage expertise to move-up buyers and high-net-worth clients in the Raleigh-Durham area. His deep knowledge of jumbo and conventional financing makes him the go-to lender for buyers in Raleigh''s competitive luxury market. Mark is known for his analytical approach and ability to structure complex loan scenarios with precision.',
    4.8,
    31,
    4.8 * ln(32),
    8,
    ARRAY['Jumbo', 'Conventional'],
    true,
    true
  ),
  (
    'Diana Patel',
    'diana-patel',
    'Cardinal Home Lending',
    'Raleigh',
    'NC',
    'DP',
    'bg-orange-100 text-orange-900',
    '345678',
    'Diana Patel is a first-time buyer specialist who has made it her mission to demystify the mortgage process. With 6 years of experience and a background in financial education, Diana walks every client through each step with patience and clarity. She specializes in FHA loans and down payment assistance programs, helping buyers who thought homeownership was out of reach.',
    4.8,
    27,
    4.8 * ln(28),
    6,
    ARRAY['FHA', 'First-time buyer'],
    true,
    false
  ),
  (
    'Tom Rivera',
    'tom-rivera',
    'Triangle Mortgage Group',
    'Raleigh',
    'NC',
    'TR',
    'bg-amber-100 text-amber-900',
    '456789',
    'Tom Rivera is a 15-year mortgage veteran who has dedicated his career to serving military families and seniors in North Carolina. As a VA loan specialist and certified reverse mortgage professional, Tom understands the unique financial needs of veterans and retirees. He has helped hundreds of Triangle-area veterans use their VA benefits to achieve zero-down homeownership.',
    4.7,
    19,
    4.7 * ln(20),
    15,
    ARRAY['VA', 'Reverse Mortgage'],
    true,
    true
  );
