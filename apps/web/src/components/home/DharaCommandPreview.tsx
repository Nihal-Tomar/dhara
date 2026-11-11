'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLocale } from '@bhumitra/ui';

const METRICS = [
  { label: 'Projects',      labelHi: 'परियोजनाएं',   value: '1,284',       sub: '28 States & 8 UTs',    delta: '+42',      up: true  },
  { label: 'Notified',      labelHi: 'अधिसूचित',     value: '48,500 Ha',   sub: 'Sec 11 Gazette',       delta: '+6.2K Ha', up: true  },
  { label: 'Acquired',      labelHi: 'अर्जित',        value: '28,140 Ha',   sub: '58.0% complete',       delta: '58%',      up: null  },
  { label: 'Compensation',  labelHi: 'प्रतिकर',      value: '₹14,850 Cr',  sub: 'Direct PFMS DBT',      delta: '↑ 12%',    up: true  },
  { label: 'Families',      labelHi: 'परिवार',        value: '84,200',      sub: 'R&R Safeguards',       delta: '3.2K pending', up: null },
  { label: 'SLA Adherence', labelHi: 'SLA',           value: '91.4%',       sub: 'Statutory milestones', delta: '↑ 2.1%',   up: true  },
];

const ALERTS = [
  { title: 'NH-48 Six Laning: Sec 19 SLA Critical',      cat: 'Statutory SLA',   sev: 'critical', detail: '+22 days slip' },
  { title: 'Western DFC: Bank Validation Hold',          cat: 'DBT Compensation', sev: 'high',    detail: '12 pending'   },
  { title: 'Pune-Nashik Rail: Sec 15 Hearing Scheduled', cat: 'Objection',        sev: 'normal',  detail: '14:00 IST'    },
];

const STATES = [
  { name: 'MP', full: 'Madhya Pradesh', projects: 98,  sla: 96 },
  { name: 'GJ', full: 'Gujarat',        projects: 148, sla: 94 },
  { name: 'MH', full: 'Maharashtra',    projects: 195, sla: 91 },
  { name: 'UP', full: 'Uttar Pradesh',  projects: 211, sla: 87 },
];

function useFadeUp(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('in-view'); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
}

export const DharaCommandPreview: React.FC = () => {
  const { isHindi } = useLocale();
  const headerRef = useRef<HTMLDivElement>(null);
  const bentoRef  = useRef<HTMLDivElement>(null);
  useFadeUp(headerRef as React.RefObject<HTMLElement>);
  useFadeUp(bentoRef as React.RefObject<HTMLElement>);

  return (
    <section className="section-gap">
      <div className="container-dhara-wide">

        {/* Header — CENTERED per reference design */}
        <div ref={headerRef} className="reveal text-center max-w-3xl mx-auto mb-12">
          <div className="eyebrow mb-3 flex items-center justify-center gap-2" style={{ color: 'var(--forest)' }}>
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--forest-light)', animation: 'pulseDot 2.5s ease-in-out infinite' }}
            />
            {isHindi ? 'राष्ट्रीय कमान पूर्वावलोकन' : 'National Command Preview · Live Telemetry'}
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--ink-darker)', lineHeight: 1.15 }}>
            {isHindi ? 'भारत के भूमि अधिग्रहण का एकल दृश्य' : "One Command View for India's Land Acquisition"}
          </h2>
          <p className="mt-3 text-[0.9375rem]" style={{ color: 'var(--ink-muted)', lineHeight: '1.65', maxWidth: '560px', margin: '12px auto 0' }}>
            {isHindi
              ? 'केंद्रीय मंत्रालयों, CALA कलेक्टरों और क्षेत्रीय प्राधिकरणों को जोड़ने वाली वास्तविक समय निगरानी।'
              : 'Real-time monitoring connecting Central Ministries, CALA Collectors, and Field Authorities.'}
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/command" className="btn-primary" style={{ fontSize: '13.5px', padding: '11px 28px' }}>
              {isHindi ? 'कमान केंद्र →' : 'Open Command Centre →'}
            </Link>
          </div>
        </div>

        {/* ── BENTO GRID ── */}
        <div ref={bentoRef} className="reveal grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">

          {/* Metrics — 3×2 sub-grid spanning 8 cols */}
          <div className="xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {METRICS.map((m, i) => (
              <div
                key={m.label}
                className="paper-card p-5 flex flex-col gap-2 animate-fade-up"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="eyebrow" style={{ color: 'var(--ink-muted)' }}>
                  {isHindi ? m.labelHi : m.label}
                </div>
                <div
                  className="data-value font-bold leading-none"
                  style={{ fontSize: 'clamp(1.3rem, 2vw, 1.75rem)', color: 'var(--ink-darker)', letterSpacing: '-0.03em' }}
                >
                  {m.value}
                </div>
                <div>
                  <div className="text-[11.5px]" style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)' }}>
                    {m.sub}
                  </div>
                  {m.delta && (
                    <div
                      className="text-[11px] mt-0.5"
                      style={{
                        color: m.up === true ? 'var(--forest-light)' : m.up === false ? 'var(--danger)' : 'var(--ink-faint)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {m.delta}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right sidebar — self-start prevents stretching taller than metrics grid */}
          <div className="xl:col-span-4 flex flex-col gap-4 xl:self-start">

            {/* Alerts */}
            <div className="paper-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 font-semibold text-[13px]" style={{ color: 'var(--ink-dark)' }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: 'var(--danger)', animation: 'pulseDot 1.5s ease-in-out infinite' }} />
                  {isHindi ? 'सक्रिय SLA अलर्ट' : 'Active SLA Alerts'}
                </div>
                <Link href="/risk" className="eyebrow flex items-center gap-1 hover:underline" style={{ color: 'var(--terracotta)' }}>
                  Risk Intel ↗
                </Link>
              </div>
              <div className="space-y-2.5">
                {ALERTS.map(a => (
                  <div
                    key={a.title}
                    className="p-3 rounded-xl transition-colors"
                    style={{ background: 'rgba(30,41,59,0.03)', border: '1px solid rgba(30,41,59,0.08)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(30,41,59,0.16)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(30,41,59,0.08)'}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-[12.5px] font-semibold leading-snug line-clamp-1" style={{ color: 'var(--ink-dark)' }}>
                        {a.title}
                      </span>
                      <span className={`badge shrink-0 ${a.sev === 'critical' ? 'badge-danger' : a.sev === 'high' ? 'badge-warning' : 'badge-info'}`}>
                        {a.sev.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[11px]" style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)' }}>
                      {a.cat} · {a.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* State SLA bars */}
            <div className="paper-card p-5">
              <div className="flex items-center justify-between mb-5">
                <span className="font-semibold text-[13px]" style={{ color: 'var(--ink-dark)' }}>
                  {isHindi ? 'राज्य SLA स्थिति' : 'State SLA Status'}
                </span>
                <span className="badge badge-neutral">28 States</span>
              </div>
              <div className="space-y-4">
                {STATES.map(st => (
                  <div key={st.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="badge badge-neutral" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px' }}>{st.name}</span>
                        <span className="text-[12px] font-medium" style={{ color: 'var(--ink-dark)' }}>{st.full}</span>
                        <span className="text-[11px]" style={{ color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>({st.projects})</span>
                      </div>
                      <span
                        className="data-value text-[13px] font-bold"
                        style={{ color: st.sla >= 94 ? 'var(--forest-light)' : st.sla >= 90 ? 'var(--forest)' : 'var(--warning)' }}
                      >
                        {st.sla}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(30,41,59,0.07)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${st.sla}%`,
                          background: st.sla >= 94
                            ? 'linear-gradient(90deg,var(--forest),#10B981)'
                            : st.sla >= 90
                            ? 'linear-gradient(90deg,var(--forest),#34D399)'
                            : 'linear-gradient(90deg,var(--warning),#FCD34D)',
                          transition: 'width 1s ease',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(30,41,59,0.07)' }}>
                <Link href="/command" className="eyebrow flex items-center gap-1 hover:underline" style={{ color: 'var(--forest)' }}>
                  {isHindi ? 'सभी 28 राज्यों का डेटा →' : 'View all 28 states →'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
