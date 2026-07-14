-- =============================================================================
-- Graduation Ceremony Secret Messages — Supabase schema
-- =============================================================================
-- Paste this whole file into the Supabase dashboard → SQL Editor → Run.
--
-- Security model (why this is safe to use from a public static site):
--   * The browser only ever has the PUBLIC anon/publishable key.
--   * Names are public (browsable list) via the `public_names` VIEW.
--   * Message CONTENT is NEVER directly readable — it only comes back from the
--     `reveal_message` function, which checks the secret code server-side.
--   * Editing/deleting only happens through functions that verify the code.
--   * The secret code is never stored in plaintext — only a bcrypt hash.
--   * RLS is ON and `anon` has NO direct table access, so the ONLY things the
--     browser can do are: read names (view) + call the 4 functions below.
-- =============================================================================

-- Needed for crypt() / gen_salt() (password hashing).
-- On Supabase, extensions live in the `extensions` schema (not `public`),
-- so every function below sets `search_path = public, extensions` to find them.
create extension if not exists pgcrypto with schema extensions;

-- -----------------------------------------------------------------------------
-- Table
-- -----------------------------------------------------------------------------
create table if not exists public.messages (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null,
  message    text        not null,
  code_hash  text        not null,          -- bcrypt hash of the secret code
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Turn ON row level security. We add NO policies for `anon`, which means the
-- browser CANNOT read/insert/update/delete this table directly at all.
-- Every allowed action goes through the SECURITY DEFINER functions below.
alter table public.messages enable row level security;

-- Belt & suspenders: make sure the public/anon roles have no table grants.
revoke all on public.messages from anon;
revoke all on public.messages from public;

-- -----------------------------------------------------------------------------
-- Public view: NAMES ONLY (no message, no code_hash)
-- -----------------------------------------------------------------------------
-- security_invoker = false -> the view reads the table as its owner (postgres),
-- bypassing the table RLS, but ONLY exposes the columns selected here.
create or replace view public.public_names
  with (security_invoker = false) as
  select id, name, created_at
  from public.messages;

grant select on public.public_names to anon;

-- -----------------------------------------------------------------------------
-- Function: submit a new message
-- -----------------------------------------------------------------------------
create or replace function public.submit_message(
  p_name    text,
  p_message text,
  p_code    text
) returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  new_id uuid;
begin
  if p_name is null or length(trim(p_name)) = 0 or length(p_name) > 100 then
    raise exception 'Please enter a valid name (max 100 characters).';
  end if;
  if p_message is null or length(trim(p_message)) = 0 or length(p_message) > 2000 then
    raise exception 'Please enter a message (max 2000 characters).';
  end if;
  if p_code is null or length(p_code) < 4 then
    raise exception 'Secret code must be at least 4 characters.';
  end if;

  insert into public.messages (name, message, code_hash)
  values (trim(p_name), p_message, crypt(p_code, gen_salt('bf')))
  returning id into new_id;

  return new_id;
end;
$$;

-- -----------------------------------------------------------------------------
-- Function: reveal a message (only if the code matches)
-- -----------------------------------------------------------------------------
create or replace function public.reveal_message(
  p_id   uuid,
  p_code text
) returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  stored_hash text;
  msg         text;
begin
  select code_hash, message into stored_hash, msg
  from public.messages where id = p_id;

  if stored_hash is null then
    raise exception 'Message not found.';
  end if;

  if crypt(p_code, stored_hash) = stored_hash then
    return msg;
  else
    raise exception 'Incorrect secret code.';
  end if;
end;
$$;

-- -----------------------------------------------------------------------------
-- Function: update a message (only if the code matches)
-- -----------------------------------------------------------------------------
create or replace function public.update_message(
  p_id          uuid,
  p_code        text,
  p_new_message text
) returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  stored_hash text;
begin
  if p_new_message is null or length(trim(p_new_message)) = 0 or length(p_new_message) > 2000 then
    raise exception 'Please enter a message (max 2000 characters).';
  end if;

  select code_hash into stored_hash from public.messages where id = p_id;
  if stored_hash is null then
    raise exception 'Message not found.';
  end if;

  if crypt(p_code, stored_hash) = stored_hash then
    update public.messages
      set message = p_new_message, updated_at = now()
      where id = p_id;
  else
    raise exception 'Incorrect secret code.';
  end if;
end;
$$;

-- -----------------------------------------------------------------------------
-- Function: delete a message (only if the code matches)
-- -----------------------------------------------------------------------------
create or replace function public.delete_message(
  p_id   uuid,
  p_code text
) returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  stored_hash text;
begin
  select code_hash into stored_hash from public.messages where id = p_id;
  if stored_hash is null then
    raise exception 'Message not found.';
  end if;

  if crypt(p_code, stored_hash) = stored_hash then
    delete from public.messages where id = p_id;
  else
    raise exception 'Incorrect secret code.';
  end if;
end;
$$;

-- -----------------------------------------------------------------------------
-- Grant execute on the functions to the public (anon) role.
-- -----------------------------------------------------------------------------
grant execute on function public.submit_message(text, text, text) to anon;
grant execute on function public.reveal_message(uuid, text)       to anon;
grant execute on function public.update_message(uuid, text, text) to anon;
grant execute on function public.delete_message(uuid, text)       to anon;

-- Done. Verify RLS with:  select relrowsecurity from pg_class where relname = 'messages';
-- It should return TRUE.
