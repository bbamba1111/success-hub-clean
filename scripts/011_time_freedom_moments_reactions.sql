-- Time Freedom Moments™ — positive-only reactions
--
-- Members express encouragement on a Moment with ONE positive reaction. We keep
-- the existing one-row-per-(post,user) shape from community_post_likes and simply
-- record WHICH positive sentiment was chosen. likes_count on community_posts
-- continues to hold the total number of reactions (all positive), so existing
-- counting logic keeps working.
--
-- Allowed reactions (positive only — there is intentionally no "dislike"):
--   appreciate · celebrate · inspire · love_this
--
-- The column is nullable with a default so any code written before this runs
-- (which inserts only post_id + user_id) continues to work and is treated as a
-- 'celebrate'.

alter table public.community_post_likes
  add column if not exists reaction_type text not null default 'celebrate'
    check (reaction_type in ('appreciate', 'celebrate', 'inspire', 'love_this'));

-- Fast per-post reaction lookups for the feed.
create index if not exists community_post_likes_post_idx
  on public.community_post_likes (post_id);
