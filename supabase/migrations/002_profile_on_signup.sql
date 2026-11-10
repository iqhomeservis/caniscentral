-- 002 — Automatické vytvorenie profilu pri registrácii
--
-- PROBLÉM, KTORÝ TO RIEŠI:
-- Prihlásenie prebieha magic linkom. Pri ňom vznikne riadok v auth.users,
-- ale v public.profiles nevznikol nikdy nič. Admin panel
-- (src/app/[locale]/admin/page.tsx) číta rolu práve z profiles — keď profil
-- chýbal, podmienka profile?.role !== 'admin' vyhodila prihláseného
-- používateľa späť na úvodnú stránku. Navonok to vyzeralo ako pokazený web.
--
-- RIEŠENIE:
-- Spúšťač nad auth.users doplní profil hneď pri vzniku účtu. Rolu určí podľa
-- zoznamu private.admin_emails — kto je v ňom, stane sa správcom pri prvom
-- prihlásení a nepotrebuje žiadny druhý krok.
--
-- Zoznam je zámerne v schéme private: PostgREST sprístupňuje cez API len
-- schému public, takže sa k nemu z internetu nedá dostať ani na čítanie.

create table if not exists private.admin_emails (
  email text primary key,
  note text,
  created_at timestamptz not null default now()
);

-- search_path = '' núti písať všetky názvy úplne (public.profiles,
-- private.admin_emails). Bez toho by sa dal do funkcie so SECURITY DEFINER
-- podstrčiť objekt z inej schémy.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    case
      when exists (
        select 1 from private.admin_emails a
        where a.email = lower(new.email)
      ) then 'admin'
      else 'customer'
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Funkciu spúšťa výhradne databáza, nikto ju nesmie volať cez API.
revoke execute on function public.handle_new_user() from anon, authenticated;

-- PRIDANIE SPRÁVCU (spustiť ručne, e-mail vždy malými písmenami):
-- insert into private.admin_emails (email, note)
-- values ('adresa@example.com', 'Juliana Oravcová — majiteľka')
-- on conflict (email) do nothing;
--
-- Ak sa už dotyčný prihlásil predtým, než bol v zozname, treba mu rolu
-- doplniť aj v profile:
-- update public.profiles set role = 'admin' where lower(email) = 'adresa@example.com';
