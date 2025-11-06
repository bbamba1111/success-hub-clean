-- Delete test users to allow retesting with same emails
-- WARNING: This will permanently delete these users

-- Delete from user_profiles first (due to foreign key)
DELETE FROM user_profiles 
WHERE email IN (
  'maketimeformore@gmail.com',
  'coachbarbara@maketimeformore.com'
);

-- Note: Auth users need to be deleted from Supabase Auth dashboard
-- Go to Authentication → Users → Delete the test users manually
