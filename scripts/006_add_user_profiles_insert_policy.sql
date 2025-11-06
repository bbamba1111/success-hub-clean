-- Add INSERT policy for user_profiles table
-- This allows users to insert their own profile during signup

CREATE POLICY IF NOT EXISTS users_can_insert_own_profile
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Also allow service role to insert (for admin operations)
CREATE POLICY IF NOT EXISTS service_role_can_insert_profiles
ON public.user_profiles
FOR INSERT
TO service_role
WITH CHECK (true);
