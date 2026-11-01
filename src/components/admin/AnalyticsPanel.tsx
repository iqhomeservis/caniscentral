'use client'

import { Eye, Phone, Mail, Users } from 'lucide-react'

export type AnalyticsData = {
  views7: number
  views30: number
  visitors7: number
  phoneClicks30: number
  emailClicks30: number
  topPages: { path: string; views: number }[]
  topReferrers: { host: string; views: number }[]
  byDay: { day: string; views: number }[]
  devices: { device: string; views: number }[]
}

export default function AnalyticsPanel({ data }: { data: AnalyticsData }) {
  const maxDay = Math.max(1, ...data.byDay.map((d) => d.views))

  return (
    <div className="flex flex-col gap-6">
      {/* Prehľad */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Zobrazenia za 7 dní', value: data.views7, icon: Eye },
          { label: 'Návštevníci za 7 dní', value: data.visitors7, icon: Users },
          { label: 'Kliky na telefón (30 dní)', value: data.phoneClicks30, icon: Phone },
          { label: 'Kliky na e-mail (30 dní)', value: data.emailClicks30, icon: Mail },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2 text-stone-light">
              <Icon size={14} />
              <p className="text-xs">{label}</p>
            </div>
            <p className="font-body text-2xl font-medium text-ink">{value}</p>
          </div>
        ))}
      </div>

      {/* Návštevnosť po dňoch */}
      <div className="bg-white rounded-2xl p-6">
        <h3 className="font-body text-sm font-medium text-ink mb-5">Návštevnosť za posledných 30 dní</h3>
        {data.byDay.length === 0 ? (
          <p className="text-sm text-stone-light">Zatiaľ žiadne údaje.</p>
        ) : (
          <div className="flex items-end gap-1 h-40">
            {data.byDay.map(({ day, views }) => (
              <div key={day} className="flex-1 flex flex-col justify-end items-center group relative">
                <div
                  className="w-full bg-clay/70 hover:bg-clay rounded-t transition-colors"
                  style={{ height: `${Math.max(2, (views / maxDay) * 100)}%` }}
                />
                <span className="absolute -top-6 text-[10px] bg-ink text-cream px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {day}: {views}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Najnavštevovanejšie stránky */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="font-body text-sm font-medium text-ink mb-4">Najnavštevovanejšie stránky (30 dní)</h3>
          {data.topPages.length === 0 ? (
            <p className="text-sm text-stone-light">Zatiaľ žiadne údaje.</p>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {data.topPages.map(({ path, views }) => (
                <li key={path} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-stone truncate">{path}</span>
                  <span className="text-ink font-medium flex-shrink-0">{views}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Odkiaľ prišli */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="font-body text-sm font-medium text-ink mb-4">Odkiaľ návštevníci prišli (30 dní)</h3>
          {data.topReferrers.length === 0 ? (
            <p className="text-sm text-stone-light">
              Zatiaľ žiadne údaje. Priame návštevy sa tu nezobrazujú.
            </p>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {data.topReferrers.map(({ host, views }) => (
                <li key={host} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-stone truncate">{host}</span>
                  <span className="text-ink font-medium flex-shrink-0">{views}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Zariadenia */}
      <div className="bg-white rounded-2xl p-6">
        <h3 className="font-body text-sm font-medium text-ink mb-4">Zariadenia (30 dní)</h3>
        {data.devices.length === 0 ? (
          <p className="text-sm text-stone-light">Zatiaľ žiadne údaje.</p>
        ) : (
          <div className="flex gap-6">
            {data.devices.map(({ device, views }) => (
              <div key={device}>
                <p className="text-xs text-stone-light">{device === 'mobile' ? 'Mobil' : 'Počítač'}</p>
                <p className="font-body text-xl font-medium text-ink">{views}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
