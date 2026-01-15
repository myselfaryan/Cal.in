-- Run this in Neon SQL Editor: https://console.neon.tech
-- Go to your project > SQL Editor > Paste and Run

-- Clear existing data (if any)
DELETE FROM bookings;
DELETE FROM event_types;
DELETE FROM availability;
DELETE FROM settings;

-- Insert Event Types
INSERT INTO event_types (id, title, description, duration, slug, created_at, updated_at) VALUES
  (gen_random_uuid(), '15 Minute Meeting', 'A quick 15-minute introductory call to discuss your needs.', 15, '15min', NOW(), NOW()),
  (gen_random_uuid(), '30 Minute Meeting', 'A standard 30-minute meeting for detailed discussions.', 30, '30min', NOW(), NOW()),
  (gen_random_uuid(), '60 Minute Consultation', 'An in-depth 60-minute consultation for comprehensive planning.', 60, '60min', NOW(), NOW());

-- Insert Availability (Monday to Friday, 9 AM to 5 PM)
INSERT INTO availability (id, day_of_week, start_time, end_time, is_enabled, created_at) VALUES
  (gen_random_uuid(), 0, '09:00:00', '17:00:00', false, NOW()),  -- Sunday (disabled)
  (gen_random_uuid(), 1, '09:00:00', '17:00:00', true, NOW()),   -- Monday
  (gen_random_uuid(), 2, '09:00:00', '17:00:00', true, NOW()),   -- Tuesday
  (gen_random_uuid(), 3, '09:00:00', '17:00:00', true, NOW()),   -- Wednesday
  (gen_random_uuid(), 4, '09:00:00', '17:00:00', true, NOW()),   -- Thursday
  (gen_random_uuid(), 5, '09:00:00', '17:00:00', true, NOW()),   -- Friday
  (gen_random_uuid(), 6, '09:00:00', '17:00:00', false, NOW());  -- Saturday (disabled)

-- Insert Timezone Setting
INSERT INTO settings (id, key, value, updated_at) VALUES
  (gen_random_uuid(), 'timezone', 'Asia/Kolkata', NOW());

-- Insert Sample Bookings (for the first event type)
WITH first_event AS (
  SELECT id FROM event_types WHERE slug = '30min' LIMIT 1
)
INSERT INTO bookings (id, event_type_id, booker_name, booker_email, date, start_time, end_time, status, created_at)
SELECT 
  gen_random_uuid(),
  first_event.id,
  'John Doe',
  'john@example.com',
  TO_CHAR(CURRENT_DATE + INTERVAL '1 day', 'YYYY-MM-DD'),
  '10:00:00',
  '10:30:00',
  'confirmed',
  NOW()
FROM first_event;

-- Verify data
SELECT 'Event Types:' as info, COUNT(*) as count FROM event_types
UNION ALL
SELECT 'Availability:', COUNT(*) FROM availability
UNION ALL
SELECT 'Settings:', COUNT(*) FROM settings
UNION ALL
SELECT 'Bookings:', COUNT(*) FROM bookings;
