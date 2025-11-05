-- Add onboarding tokens to existing users who don't have them
UPDATE user_profiles
SET 
  onboarding_token = encode(gen_random_bytes(32), 'hex'),
  token_expires_at = NOW() + INTERVAL '24 hours',
  password_set = false
WHERE onboarding_token IS NULL;
