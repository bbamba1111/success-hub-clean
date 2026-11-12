-- Founder-owned Google and Microsoft account connections.
-- OAuth credentials are encrypted in the application before storage.
-- Browser roles can read connection metadata only, never token ciphertext.

begin;

create table if not exists public.connected_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null check (provider in ('google', 'microsoft')),
  provider_account_id text not null check (char_length(provider_account_id) between 1 and 256),
  email text not null check (char_length(email) between 3 and 320),
  display_name text check (display_name is null or char_length(display_name) <= 256),
  granted_scopes text[] not null default '{}'::text[],
  access_token_ciphertext text,
  refresh_token_ciphertext text,
  access_token_expires_at timestamptz,
  status text not null default 'active' check (status in ('active', 'disconnected', 'error')),
  last_error text check (last_error is null or char_length(last_error) <= 1000),
  connected_at timestamptz not null default now(),
  disconnected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider, provider_account_id)
);

create index if not exists connected_accounts_owner_provider_idx
  on public.connected_accounts (user_id, provider, status, updated_at desc);

alter table public.connected_accounts enable row level security;

drop policy if exists "founder reads own connected account metadata" on public.connected_accounts;
create policy "founder reads own connected account metadata"
  on public.connected_accounts
  for select
  to authenticated
  using (auth.uid() = user_id);

-- No browser insert/update/delete and no browser access to encrypted token columns.
revoke all privileges on table public.connected_accounts from public, anon, authenticated;
grant select (
  id, user_id, provider, email, display_name, granted_scopes, access_token_expires_at,
  status, last_error, connected_at, disconnected_at, created_at, updated_at
) on public.connected_accounts to authenticated;

-- A one-row private verifier allows a server route to retrieve encrypted tokens
-- only when it supplies the encryption key held in Vercel's server environment.
create table if not exists public.connected_tools_server_access (
  id boolean primary key default true check (id),
  encryption_key_sha256 text not null check (char_length(encryption_key_sha256) = 64),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.connected_tools_server_access enable row level security;
revoke all privileges on table public.connected_tools_server_access from public, anon, authenticated, service_role;

insert into public.connected_tools_server_access (id, encryption_key_sha256)
values (true, 'b8ed76847ba7927e1637cf9dc830aee557c52d35ae5c349410bfbc9889ddc5af')
on conflict (id) do update
set encryption_key_sha256 = excluded.encryption_key_sha256,
    updated_at = now();

-- Store encrypted OAuth credentials for the currently signed-in founder.
create or replace function public.connected_account_store(
  p_provider text,
  p_provider_account_id text,
  p_email text,
  p_display_name text,
  p_granted_scopes text[],
  p_access_token_ciphertext text,
  p_refresh_token_ciphertext text,
  p_access_token_expires_at timestamptz
) returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  uid uuid := auth.uid();
  account_id uuid;
begin
  if uid is null then raise exception 'Not signed in'; end if;
  if p_provider not in ('google', 'microsoft') then raise exception 'Unsupported provider'; end if;
  if p_provider_account_id is null or char_length(p_provider_account_id) not between 1 and 256 then
    raise exception 'Invalid provider account';
  end if;
  if p_email is null or char_length(p_email) not between 3 and 320 then raise exception 'Invalid account email'; end if;
  if p_access_token_ciphertext is null or char_length(p_access_token_ciphertext) > 20000 then
    raise exception 'Invalid encrypted access token';
  end if;
  if p_refresh_token_ciphertext is not null and char_length(p_refresh_token_ciphertext) > 20000 then
    raise exception 'Invalid encrypted refresh token';
  end if;

  insert into public.connected_accounts (
    user_id, provider, provider_account_id, email, display_name, granted_scopes,
    access_token_ciphertext, refresh_token_ciphertext, access_token_expires_at,
    status, last_error, connected_at, disconnected_at, updated_at
  ) values (
    uid, p_provider, p_provider_account_id, lower(btrim(p_email)), nullif(btrim(p_display_name), ''),
    coalesce(p_granted_scopes, '{}'::text[]), p_access_token_ciphertext, p_refresh_token_ciphertext,
    p_access_token_expires_at, 'active', null, now(), null, now()
  )
  on conflict (user_id, provider, provider_account_id) do update set
    email = excluded.email,
    display_name = excluded.display_name,
    granted_scopes = excluded.granted_scopes,
    access_token_ciphertext = excluded.access_token_ciphertext,
    refresh_token_ciphertext = coalesce(excluded.refresh_token_ciphertext, connected_accounts.refresh_token_ciphertext),
    access_token_expires_at = excluded.access_token_expires_at,
    status = 'active',
    last_error = null,
    connected_at = now(),
    disconnected_at = null,
    updated_at = now()
  returning id into account_id;

  return account_id;
end;
$$;

-- Server-only credential retrieval. The founder must own the record and the
-- caller must prove possession of the Vercel-held encryption key.
create or replace function public.connected_account_token_bundle(
  p_account_id uuid,
  p_encryption_key text
) returns table (
  provider text,
  provider_account_id text,
  access_token_ciphertext text,
  refresh_token_ciphertext text,
  access_token_expires_at timestamptz
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  uid uuid := auth.uid();
  expected_hash text;
begin
  if uid is null then raise exception 'Not signed in'; end if;
  if p_encryption_key is null or char_length(p_encryption_key) <> 64 then
    raise exception 'Server credential required';
  end if;

  select s.encryption_key_sha256 into expected_hash
    from public.connected_tools_server_access s where s.id = true;

  if expected_hash is null
     or encode(sha256(convert_to(p_encryption_key, 'UTF8')), 'hex') <> expected_hash then
    raise exception 'Server credential rejected';
  end if;

  return query
    select a.provider, a.provider_account_id, a.access_token_ciphertext,
           a.refresh_token_ciphertext, a.access_token_expires_at
      from public.connected_accounts a
     where a.id = p_account_id
       and a.user_id = uid
       and a.status = 'active';
end;
$$;

create or replace function public.connected_account_disconnect(p_account_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  uid uuid := auth.uid();
  affected integer;
begin
  if uid is null then raise exception 'Not signed in'; end if;

  update public.connected_accounts
     set status = 'disconnected',
         access_token_ciphertext = null,
         refresh_token_ciphertext = null,
         access_token_expires_at = null,
         disconnected_at = now(),
         updated_at = now()
   where id = p_account_id and user_id = uid;

  get diagnostics affected = row_count;
  return affected = 1;
end;
$$;

revoke all on function public.connected_account_store(text, text, text, text, text[], text, text, timestamptz) from public, anon;
revoke all on function public.connected_account_token_bundle(uuid, text) from public, anon;
revoke all on function public.connected_account_disconnect(uuid) from public, anon;
grant execute on function public.connected_account_store(text, text, text, text, text[], text, text, timestamptz) to authenticated;
grant execute on function public.connected_account_token_bundle(uuid, text) to authenticated;
grant execute on function public.connected_account_disconnect(uuid) to authenticated;

commit;
