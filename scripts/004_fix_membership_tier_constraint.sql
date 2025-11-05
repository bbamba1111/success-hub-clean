-- First, let's see what the current constraint is
SELECT
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'user_profiles'::regclass
AND conname LIKE '%membership_tier%';

-- Drop the old constraint if it exists
ALTER TABLE user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_membership_tier_check;

-- Add a new constraint that allows the values we need
ALTER TABLE user_profiles
ADD CONSTRAINT user_profiles_membership_tier_check 
CHECK (membership_tier IN ('monday_only', '7_day', '21_day', 'monthly', 'annual', 'free', 'premium'));

-- Verify the constraint was added
SELECT
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'user_profiles'::regclass
AND conname = 'user_profiles_membership_tier_check';
