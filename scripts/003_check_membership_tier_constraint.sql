-- Check the membership_tier constraint to see what values are allowed
SELECT
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'user_profiles'::regclass
AND conname = 'user_profiles_membership_tier_check';

-- Also check what values are currently in use
SELECT DISTINCT membership_tier
FROM user_profiles
ORDER BY membership_tier;
