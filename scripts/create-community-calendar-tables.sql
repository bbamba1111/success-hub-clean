-- Community & Calendar System Tables for Make Time For More Hub
-- Creates tables for community posts, calendar events, activity tracking, and member connections

-- Community Posts Table
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  post_type TEXT NOT NULL DEFAULT 'update', -- update, win, question, milestone
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for community_posts
CREATE POLICY "users_can_view_all_posts" ON community_posts FOR SELECT USING (true);
CREATE POLICY "users_can_insert_own_posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_can_update_own_posts" ON community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users_can_delete_own_posts" ON community_posts FOR DELETE USING (auth.uid() = user_id);

-- Community Comments Table
CREATE TABLE IF NOT EXISTS community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for community_comments
CREATE POLICY "users_can_view_all_comments" ON community_comments FOR SELECT USING (true);
CREATE POLICY "users_can_insert_own_comments" ON community_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_can_delete_own_comments" ON community_comments FOR DELETE USING (auth.uid() = user_id);

-- Community Post Likes Table
CREATE TABLE IF NOT EXISTS community_post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Enable RLS
ALTER TABLE community_post_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for community_post_likes
CREATE POLICY "users_can_view_all_likes" ON community_post_likes FOR SELECT USING (true);
CREATE POLICY "users_can_insert_own_likes" ON community_post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_can_delete_own_likes" ON community_post_likes FOR DELETE USING (auth.uid() = user_id);

-- Calendar Events Table (Co-working sessions, Sunday Shifts, etc.)
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- morning-routine, workout, lunch, ceo-workday, sunday-shift, etc.
  title TEXT NOT NULL,
  description TEXT,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  day_of_week INTEGER, -- 0=Sunday, 1=Monday, etc. NULL for specific dates
  specific_date DATE, -- For one-time events
  butter_link TEXT, -- Link to Butter session
  is_non_negotiable BOOLEAN DEFAULT false, -- If true, users cannot delete/edit
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- RLS Policy - Everyone can view calendar events
CREATE POLICY "users_can_view_calendar_events" ON calendar_events FOR SELECT USING (true);

-- Activity Completions Table
CREATE TABLE IF NOT EXISTS activity_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES calendar_events(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- morning-routine, workout, ceo-workday, etc.
  completion_date DATE NOT NULL,
  duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id, completion_date)
);

-- Enable RLS
ALTER TABLE activity_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for activity_completions
CREATE POLICY "users_can_view_own_completions" ON activity_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_can_insert_own_completions" ON activity_completions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_can_update_own_completions" ON activity_completions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users_can_delete_own_completions" ON activity_completions FOR DELETE USING (auth.uid() = user_id);

-- Activity Streaks Table
CREATE TABLE IF NOT EXISTS activity_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_completion_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, activity_type)
);

-- Enable RLS
ALTER TABLE activity_streaks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for activity_streaks
CREATE POLICY "users_can_view_own_streaks" ON activity_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_can_view_all_streaks_for_community" ON activity_streaks FOR SELECT USING (true); -- For leaderboards
CREATE POLICY "users_can_insert_own_streaks" ON activity_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_can_update_own_streaks" ON activity_streaks FOR UPDATE USING (auth.uid() = user_id);

-- Accountability Partners Table
CREATE TABLE IF NOT EXISTS accountability_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  partner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, active, inactive
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, partner_id),
  CHECK (user_id != partner_id)
);

-- Enable RLS
ALTER TABLE accountability_partners ENABLE ROW LEVEL SECURITY;

-- RLS Policies for accountability_partners
CREATE POLICY "users_can_view_own_partnerships" ON accountability_partners FOR SELECT USING (auth.uid() = user_id OR auth.uid() = partner_id);
CREATE POLICY "users_can_insert_partnerships" ON accountability_partners FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_can_update_own_partnerships" ON accountability_partners FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = partner_id);

-- Insert default non-negotiable co-working sessions
INSERT INTO calendar_events (event_type, title, description, start_time, end_time, day_of_week, is_non_negotiable, butter_link) VALUES
  ('morning-routine', 'Morning GIV•EN Routine Co-Working', 'Start your day with spiritual alignment and intention', '06:00', '07:30', 1, true, 'https://join.butter.us/make-time-for-more/morning-routine'),
  ('morning-routine', 'Morning GIV•EN Routine Co-Working', 'Start your day with spiritual alignment and intention', '06:00', '07:30', 2, true, 'https://join.butter.us/make-time-for-more/morning-routine'),
  ('morning-routine', 'Morning GIV•EN Routine Co-Working', 'Start your day with spiritual alignment and intention', '06:00', '07:30', 3, true, 'https://join.butter.us/make-time-for-more/morning-routine'),
  ('morning-routine', 'Morning GIV•EN Routine Co-Working', 'Start your day with spiritual alignment and intention', '06:00', '07:30', 4, true, 'https://join.butter.us/make-time-for-more/morning-routine'),
  
  ('workout', '30-Minute Workout Window', 'Movement and energy optimization session', '07:30', '08:00', 1, true, 'https://join.butter.us/make-time-for-more/workout'),
  ('workout', '30-Minute Workout Window', 'Movement and energy optimization session', '07:30', '08:00', 2, true, 'https://join.butter.us/make-time-for-more/workout'),
  ('workout', '30-Minute Workout Window', 'Movement and energy optimization session', '07:30', '08:00', 3, true, 'https://join.butter.us/make-time-for-more/workout'),
  ('workout', '30-Minute Workout Window', 'Movement and energy optimization session', '07:30', '08:00', 4, true, 'https://join.butter.us/make-time-for-more/workout'),
  
  ('ceo-workday', '4-Hour CEO Workday', 'Focused business strategy and implementation', '13:00', '17:00', 1, true, 'https://join.butter.us/make-time-for-more/ceo-workday'),
  ('ceo-workday', '4-Hour CEO Workday', 'Focused business strategy and implementation', '13:00', '17:00', 2, true, 'https://join.butter.us/make-time-for-more/ceo-workday'),
  ('ceo-workday', '4-Hour CEO Workday', 'Focused business strategy and implementation', '13:00', '17:00', 3, true, 'https://join.butter.us/make-time-for-more/ceo-workday'),
  ('ceo-workday', '4-Hour CEO Workday', 'Focused business strategy and implementation', '13:00', '17:00', 4, true, 'https://join.butter.us/make-time-for-more/ceo-workday'),
  
  ('sunday-shift', 'The Sunday Shift', 'Weekly recommitment and intention setting', '13:00', '14:00', 0, true, 'https://join.butter.us/make-time-for-more/sunday-shift')
ON CONFLICT DO NOTHING;
