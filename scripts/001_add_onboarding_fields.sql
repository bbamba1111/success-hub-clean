-- Add onboarding token fields to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS onboarding_token TEXT,
ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS password_set BOOLEAN DEFAULT FALSE;

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding_token 
ON user_profiles(onboarding_token) 
WHERE onboarding_token IS NOT NULL;

-- Add index for email lookups (used in welcome page)
CREATE INDEX IF NOT EXISTS idx_user_profiles_email 
ON user_profiles(email);
