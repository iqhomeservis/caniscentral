-- 005 — Automatické mazanie starých údajov
--
-- Zásady ochrany osobných údajov na webe sľubujú konkrétne lehoty.
-- Bez tejto úlohy by to bol len text — údaje by ležali v databáze donekonečna.
-- Lehoty: nedokončené objednávky 90 dní, správy z formulára 12 mesiacov,
-- štatistika návštevnosti 12 mesiacov.
--
-- Objednávky sa NEMAŽÚ — zákon o účtovníctve žiada uchovať ich 10 rokov.
-- Odber noviniek sa NEMAŽE — trvá do odvolania súhlasu.

create extension if not exists pg_cron;

create or replace function private.vycisti_stare_udaje()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  zmazane int;
begin
  delete from public.abandoned_checkouts
   where created_at < now() - interval '90 days';
  get diagnostics zmazane = row_count;
  raise notice 'nedokoncene objednavky: %', zmazane;

  delete from public.contact_messages
   where created_at < now() - interval '12 months';
  get diagnostics zmazane = row_count;
  raise notice 'spravy z formulara: %', zmazane;

  delete from public.page_views
   where created_at < now() - interval '12 months';
  get diagnostics zmazane = row_count;
  raise notice 'zobrazenia stranok: %', zmazane;

  delete from public.contact_intents
   where created_at < now() - interval '12 months';
  get diagnostics zmazane = row_count;
  raise notice 'kliknutia na kontakt: %', zmazane;

  -- Počítadlo požiadaviek je len technická pomôcka s hodinovým oknom.
  delete from public.rate_limits
   where window_start < now() - interval '2 days';
end;
$$;

-- Funkciu smie spúšťať len databáza samotná, nie ktokoľvek s verejným kľúčom.
revoke all on function private.vycisti_stare_udaje() from public;
revoke all on function private.vycisti_stare_udaje() from anon;
revoke all on function private.vycisti_stare_udaje() from authenticated;

-- Beží raz denne o 3:12 v noci (UTC), keď na webe nikto nie je.
select cron.unschedule('vycisti-stare-udaje')
 where exists (select 1 from cron.job where jobname = 'vycisti-stare-udaje');

select cron.schedule(
  'vycisti-stare-udaje',
  '12 3 * * *',
  $$select private.vycisti_stare_udaje();$$
);
