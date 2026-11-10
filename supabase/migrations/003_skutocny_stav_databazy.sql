-- 003 — Doplnenie skutočného stavu databázy
--
-- PREČO TENTO SÚBOR EXISTUJE:
-- Migrácia 001 zachytávala len pôvodnú schému. Všetko, čo pribudlo neskôr —
-- analytika, nedokončené objednávky, odbery, obmedzovanie požiadaviek, schéma
-- private aj prepísané bezpečnostné pravidlá — vzniklo priamo v Supabase a
-- v repozitári nebolo. Pri obnove projektu z kódu na novom účte by admin
-- panel, analytika aj ochrana pokladne jednoducho chýbali.
--
-- Tento súbor dopĺňa presne ten stav, ktorý v databáze reálne beží
-- (odčítaný z nej 10. 11. 2026). Je napísaný tak, aby sa dal spustiť
-- opakovane aj na už nasadenej databáze.

-- ============================================================
-- 1. SCHÉMA PRIVATE
-- ============================================================
-- Supabase sprístupňuje cez REST API výhradne schému public. Čokoľvek
-- v schéme private je preto z internetu nedosiahnuteľné, aj keby na tabuľke
-- chýbali bezpečnostné pravidlá. Patria sem pomocné funkcie a zoznam správcov.
create schema if not exists private;

-- ============================================================
-- 2. OVERENIE SPRÁVCU
-- ============================================================
-- POZOR, TOTO JE JADRO BEZPEČNOSTI.
-- Pravidlá pôvodne zisťovali rolu poddotazom priamo do tabuľky profiles.
-- Lenže na profiles je pravidlo, ktoré sa samo pýta na rolu — vzniklo
-- zacyklenie a Postgres vracal "infinite recursion detected in policy for
-- relation profiles". Prejavilo sa to tak, že sa na webe nenačítali produkty.
--
-- Funkcia je SECURITY DEFINER, takže profiles číta právami svojho vlastníka
-- a pravidlá sa tým pádom nespúšťajú znova. Cyklus je prerušený.
create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path to 'public'
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- ============================================================
-- 3. ZOZNAM SPRÁVCOV
-- ============================================================
-- Kto je tu uvedený, dostane rolu admin už pri prvom prihlásení.
create table if not exists private.admin_emails (
  email text primary key,
  note text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 4. PROFIL PRI REGISTRÁCII
-- ============================================================
-- Viď migrácia 002 — tu je zopakované kvôli úplnosti obnovy.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id, new.email,
    case when exists (
      select 1 from private.admin_emails a where a.email = lower(new.email)
    ) then 'admin' else 'customer' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 5. OCHRANA PRED ZVÝŠENÍM PRÁV
-- ============================================================
-- Bezpečnostné pravidlá vedia obmedziť, KTORÉ RIADKY smie používateľ meniť,
-- nie KTORÉ STĹPCE. Pravidlo "Users can update own profile" tak dovoľovalo
-- meniť vlastný riadok vrátane stĺpca role — ktokoľvek sa vedel po registrácii
-- jedným volaním API spraviť správcom a čítať všetky objednávky a kontakty.
-- Overené útokom na živej databáze 10. 11. 2026.
--
-- Zatvorené dvoma nezávislými zámkami: právami na úrovni stĺpca (bod 9)
-- a týmto spúšťačom.
create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role
     and current_user in ('anon', 'authenticated') then
    raise exception 'Zmena roly nie je povolena';
  end if;
  return new;
end;
$$;

drop trigger if exists guard_profile_role on public.profiles;
create trigger guard_profile_role
  before update on public.profiles
  for each row execute function public.guard_profile_role();

-- ============================================================
-- 6. NÁVŠTEVNOSŤ A KONTAKTNÉ KLIKNUTIA
-- ============================================================
-- Vedome sa neukladá IP adresa ani identifikátor prehliadača — len cesta,
-- jazyk, typ zariadenia a doména, z ktorej návštevník prišiel.
create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  locale text,
  referrer_host text,
  device text,
  country text,
  session_id text,
  created_at timestamptz not null default now()
);
create index if not exists page_views_created_idx on public.page_views (created_at desc);
create index if not exists page_views_path_idx on public.page_views (path);

-- Kliknutie na telefón alebo e-mail. Kto klikol, sa zistiť nedá — prehliadač
-- o tom neprezradí nič. Zaznamenáva sa len to, že k tomu došlo.
create table if not exists public.contact_intents (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('phone', 'email')),
  path text,
  locale text,
  session_id text,
  created_at timestamptz not null default now()
);
create index if not exists contact_intents_created_idx on public.contact_intents (created_at desc);

-- ============================================================
-- 7. NEDOKONČENÉ OBJEDNÁVKY A ODBERY
-- ============================================================
-- Toto je jediná cesta, ako sa dá spätne ozvať zákazníkovi, ktorý objednávku
-- nedokončil: údaje z pokladne sa ukladajú priebežne, ešte pred odoslaním.
create table if not exists public.abandoned_checkouts (
  id uuid primary key default gen_random_uuid(),
  session_id text not null unique,
  email text,
  first_name text,
  last_name text,
  phone text,
  cart jsonb,
  cart_total numeric,
  locale text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists abandoned_created_idx on public.abandoned_checkouts (created_at desc);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  locale text not null default 'sk',
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

-- ============================================================
-- 8. OBMEDZENIE POČTU POŽIADAVIEK
-- ============================================================
-- Objednávkové a platobné endpointy nevyžadujú prihlásenie a posielajú e-maily
-- na adresu z požiadavky. Bez obmedzenia ich vie ktokoľvek volať dokola
-- a cez našu doménu rozposielať poštu cudzím ľuďom.
--
-- Počítadlo je v databáze, nie v pamäti — na Netlify beží viac inštancií
-- naraz a pamäťové počítadlo by sa dalo obísť striedaním.
create table if not exists public.rate_limits (
  bucket text not null,
  client_key text not null,
  window_start timestamptz not null,
  hits integer not null default 0,
  primary key (bucket, client_key, window_start)
);

-- POZOR NA UMIESTNENIE: funkcia MUSÍ byť v schéme public.
-- Supabase sprístupňuje cez REST API len public, takže volanie rpc() na
-- funkciu v schéme private zlyhá. A keďže kód pri zlyhaní kontroly požiadavku
-- radšej pustí ďalej, obmedzovanie by nefungovalo a nikde by to nebolo vidieť.
-- Presne to sa raz stalo. Verejný RPC endpoint z toho nevzniká — právo
-- spustenia má výhradne service_role (bod 9).
create or replace function public.check_rate_limit(
  p_bucket text, p_key text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_window timestamptz := to_timestamp(
    floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  v_hits int;
begin
  insert into public.rate_limits (bucket, client_key, window_start, hits)
  values (p_bucket, p_key, v_window, 1)
  on conflict (bucket, client_key, window_start)
  do update set hits = public.rate_limits.hits + 1
  returning hits into v_hits;
  return v_hits <= p_limit;
end;
$$;

-- ============================================================
-- 9. PRÁVA — NAJMENŠIA POTREBNÁ MIERA
-- ============================================================
-- Supabase štandardne dáva rolám anon a authenticated plné práva na všetky
-- tabuľky v schéme public a drží ich len bezpečnostnými pravidlami. To je
-- jediný zámok. Keby niekto v budúcnosti pridal zle napísané pravidlo, práva
-- sú okamžite živé. Necháme preto každej role len to, čo kód naozaj používa.

revoke all on all tables in schema public from anon, authenticated;

-- verejný katalóg číta ktokoľvek, správu robí panel priamo v prehliadači
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;

-- panel číta objednávky a mení ich stav; zakladá ich výhradne server
grant select, update on public.orders to authenticated;
grant select on public.order_items to authenticated;

-- profil: čítanie vlastného riadku, meniť sa smie LEN e-mail.
-- Toto je zámok proti zvýšeniu práv na úrovni stĺpca.
grant select on public.profiles to authenticated;
grant update (email) on public.profiles to authenticated;

-- page_views, contact_intents, abandoned_checkouts, newsletter_subscribers,
-- rate_limits, reservations a course_registrations zostávajú pre klienta
-- úplne bez práv — pracuje s nimi výhradne server cez servisný kľúč.

-- Funkcie: spúšťačové sa nesmú dať volať cez API.
-- POZOR: nestačí odobrať právo rolám anon a authenticated. Právo spustenia
-- drží rola PUBLIC, ktorú obe dedia — bez jej uvedenia ostane funkcia
-- verejne volateľná. Odhalil to až bezpečnostný poradca Supabase.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.guard_profile_role() from public, anon, authenticated;
revoke execute on function public.update_updated_at() from public, anon, authenticated;
revoke execute on function public.check_rate_limit(text, text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.check_rate_limit(text, text, integer, integer) to service_role;

-- is_admin() musí zostať spustiteľná pre anon aj authenticated — volajú ju
-- samotné bezpečnostné pravidlá pri každom dotaze. Nie je to diera: funkcia
-- nevracia nič iné než true/false o aktuálne prihlásenom používateľovi
-- a v schéme private je cez REST API nedosiahnuteľná.
grant usage on schema private to anon, authenticated;
grant execute on function private.is_admin() to anon, authenticated;

-- ============================================================
-- 10. BEZPEČNOSTNÉ PRAVIDLÁ NA NOVÝCH TABUĽKÁCH
-- ============================================================
alter table public.page_views enable row level security;
alter table public.contact_intents enable row level security;
alter table public.abandoned_checkouts enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.rate_limits enable row level security;

-- Pravidlá pre vkladanie majú zámerne podmienku false: zápis z prehliadača je
-- zakázaný aj pre prihláseného. Dnu sa dá len cez serverové endpointy, ktoré
-- majú obmedzenie počtu požiadaviek. Bez toho by si ktokoľvek prečítal verejný
-- kľúč zo zdrojového kódu stránky a zapisoval do tabuliek priamo cez REST API,
-- úplne mimo našich endpointov.
drop policy if exists "Anyone can log page view" on public.page_views;
create policy "Anyone can log page view" on public.page_views
  for insert with check (false);
drop policy if exists "Admins read page views" on public.page_views;
create policy "Admins read page views" on public.page_views
  for select using (private.is_admin());

drop policy if exists "Anyone can log intent" on public.contact_intents;
create policy "Anyone can log intent" on public.contact_intents
  for insert with check (false);
drop policy if exists "Admins read intents" on public.contact_intents;
create policy "Admins read intents" on public.contact_intents
  for select using (private.is_admin());

drop policy if exists "Admins read abandoned" on public.abandoned_checkouts;
create policy "Admins read abandoned" on public.abandoned_checkouts
  for select using (private.is_admin());
drop policy if exists "Admins update abandoned" on public.abandoned_checkouts;
create policy "Admins update abandoned" on public.abandoned_checkouts
  for update using (private.is_admin());

drop policy if exists "Anyone can subscribe" on public.newsletter_subscribers;
create policy "Anyone can subscribe" on public.newsletter_subscribers
  for insert with check (false);
drop policy if exists "Admins can read subscribers" on public.newsletter_subscribers;
create policy "Admins can read subscribers" on public.newsletter_subscribers
  for select using (private.is_admin());
drop policy if exists "Admins can update subscribers" on public.newsletter_subscribers;
create policy "Admins can update subscribers" on public.newsletter_subscribers
  for update using (private.is_admin());

-- rate_limits zámerne nemá žiadne pravidlo. Zapnuté zabezpečenie bez pravidiel
-- znamená, že z klienta je tabuľka úplne neprístupná. Pristupuje k nej len
-- funkcia check_rate_limit, ktorá beží právami svojho vlastníka.
-- Bezpečnostný poradca Supabase to hlási ako INFO — je to zámer, nie chyba.

-- ============================================================
-- 11. PREPOJENIE PÔVODNÝCH PRAVIDIEL NA is_admin()
-- ============================================================
-- Pravidlá z migrácie 001 sa pýtali na rolu poddotazom do profiles, čo
-- spôsobovalo zacyklenie popísané v bode 2. Prepíname ich na funkciu.
alter policy "Admins can view all profiles" on public.profiles using (private.is_admin());
alter policy "Admins can read all products" on public.products using (private.is_admin());
alter policy "Admins can insert products" on public.products with check (private.is_admin());
alter policy "Admins can update products" on public.products using (private.is_admin());
alter policy "Admins can delete products" on public.products using (private.is_admin());
alter policy "Admins can read all orders" on public.orders using (private.is_admin());
alter policy "Admins can update orders" on public.orders using (private.is_admin());
alter policy "Admins can read order_items" on public.order_items using (private.is_admin());
alter policy "Admins can manage reservations" on public.reservations using (private.is_admin());
alter policy "Admins can manage course_registrations" on public.course_registrations
  using (private.is_admin());

-- ============================================================
-- POZNÁMKA K ZVYŠKOM Z VÝVOJA
-- ============================================================
-- V živej databáze sú navyše dve funkcie z predchádzajúcich pokusov:
-- public.is_admin() a private.check_rate_limit(). Nepoužíva ich nič — pravidlá
-- volajú private.is_admin() a kód volá public.check_rate_limit(). Obe majú
-- právo spustenia len pre postgres a service_role, takže nepredstavujú riziko.
-- Zámerne sa tu neodstraňujú, aby táto migrácia nič nerušila; zmazať sa dajú
-- kedykoľvek ručne.
