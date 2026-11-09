-- Time Freedom Social Media Sharing
-- Adds media support to community_posts and enables Supabase Realtime so the
-- Time Freedom feed updates live for everyone. Time Freedom shares are tagged
-- with post_type = 'time-freedom'.

alter table public.community_posts
  add column if not exists media_pathname text,
  add column if not exists media_type text check (media_type in ('image', 'video')),
  add column if not exists media_content_type text,
  add column if not exists media_duration numeric;

-- Fast lookups for the Time Freedom feed.
create index if not exists community_posts_type_created_idx
  on public.community_posts (post_type, created_at desc);

-- Full old-row data on realtime UPDATE/DELETE events (so subscribers can react
-- to the correct post/comment).
alter table public.community_posts replica identity full;
alter table public.community_comments replica identity full;

-- Enable Realtime broadcasting on the community tables (idempotent guard).
do $$
begin
  begin
    alter publication supabase_realtime add table public.community_posts;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.community_comments;
  exception when duplicate_object then null;
  end;
end $$;
