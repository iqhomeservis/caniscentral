-- 004 — Kontaktný formulár
--
-- Odkaz mailto: otvorí poštový program len tomu, kto ho má v systéme
-- nastavený. Kto používa Gmail v prehliadači, po kliknutí neuvidí nič.
-- Formulár zapisuje sem a až potom posiela e-mail, takže dopyt sa nestratí
-- ani vtedy, keď odosielanie e-mailov vypadne.
--
-- BEZPEČNOSŤ
-- Tabuľka nemá politiku pre anonymný zápis. Jediná cesta dnu vedie cez
-- /api/kontakt, ktorý zapisuje servisným kľúčom zo servera a má obmedzený
-- počet požiadaviek. Bez toho by ktokoľvek s verejným kľúčom vedel písať
-- do tabuľky priamo cez REST API.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  topic text not null,
  message text not null,
  locale text not null default 'sk',
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Bez tohto by anon aj authenticated mali prístup z verejného kľúča.
revoke all on public.contact_messages from public;
revoke all on public.contact_messages from anon;
revoke all on public.contact_messages from authenticated;

-- Prihlásený používateľ smie čítať a meniť len príznak "vyriešené";
-- o tom, že to smie práve správca, rozhodujú politiky nižšie.
grant select on public.contact_messages to authenticated;
grant update (handled) on public.contact_messages to authenticated;

drop policy if exists "Admins can read contact messages" on public.contact_messages;
create policy "Admins can read contact messages"
  on public.contact_messages for select
  to authenticated
  using (private.is_admin());

drop policy if exists "Admins can mark contact messages" on public.contact_messages;
create policy "Admins can mark contact messages"
  on public.contact_messages for update
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);
