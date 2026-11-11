'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLocale } from '@bhumitra/ui';

const STAGES = [
  { step: '01', en: 'Social Impact Assessment',      hi: 'सामाजिक प्रभाव आकलन',    authority: 'Requiring Body',     sla: '6 months',       sec: 'Sec 4 SIA' },
  { step: '02', en: 'Preliminary Declaration',       hi: 'प्रारंभिक घोषणा',         authority: 'District Collector', sla: '12 months',      sec: 'Sec 11'    },
  { step: '03', en: 'Objection Hearings',            hi: 'आपत्ति सुनवाई',            authority: 'CALA / Collector',   sla: '60 days',        sec: 'Sec 15'    },
  { step: '04', en: 'Final Declaration',             hi: 'अंतिम घोषणा',              authority: 'Appropriate Govt',   sla: '12 months',      sec: 'Sec 19'    },
  { step: '05', en: 'Land Valuation & Award',        hi: 'भूमि मूल्यांकन',          authority: 'CALA Office',        sla: '12 months',      sec: 'Sec 23'    },
  { step: '06', en: 'Compensation Disbursement',     hi: 'प्रतिकर वितरण',           authority: 'PFMS / Treasury',    sla: '3 months',       sec: 'Sec 31'    },
  { step: '07', en: 'Rehabilitation & Resettlement', hi: 'पुनर्वासन',               authority: 'R&R Committee',      sla: 'Pre-possession', sec: 'Sec 38'    },
  { step: '08', en: 'Possession & Handover',         hi: 'कब्जा एवं हस्तांतरण',    authority: 'District Collector', sla: 'Post R&R',       sec: 'Sec 38'    },
  { step: '09', en: 'Closure & Records',             hi: 'समापन एवं अभिलेख',       authority: 'DoLR / State Govt',  sla: 'Final audit',    sec: 'Final'     },
];

export const DharaLifecycleSection: React.FC = () => {
  const { isHindi } = useLocale();
  const [active, setActive] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.querySelectorAll('.reveal').forEach((node, i) => setTimeout(() => node.classList.add('in-view'), i * 60));
        obs.disconnect();
      }
    }, { threshold: 0.04 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      className="section-gap relative"
      ref={sectionRef}
      style={{ background: 'var(--porcelain-deep)' }}
    >
      {/* Subtle topo overlay — slightly visible for depth */}
      <div className="topo-bg absolute inset-0 pointer-events-none" aria-hidden="true" style={{ opacity: 0.18 }} />

      <div className="container-dhara relative z-10">

        {/* Header */}
        <div className="reveal flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="eyebrow mb-3" style={{ color: 'var(--terracotta)' }}>
              {isHindi ? 'वैधानिक अधिग्रहण जीवनचक्र' : 'Statutory Acquisition Lifecycle · RFCTLARR Act 2013'}
            </div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--ink-darker)' }}>
              {isHindi ? '9-चरणीय RFCTLARR यात्रा' : '9-Stage RFCTLARR Journey'}
            </h2>
            <p className="mt-2.5 max-w-lg text-[0.9375rem]" style={{ color: 'var(--ink-muted)', lineHeight: '1.7' }}>
              {isHindi
                ? 'प्रारंभिक SIA से अंतिम कब्जे तक हर वैधानिक मील पत्थर DHARA में ट्रैक, निगरानी एवं प्रवर्तित किया जाता है।'
                : 'Every statutory milestone from Social Impact Assessment to final possession — tracked, monitored, and enforced in DHARA.'}
            </p>
          </div>
          <Link href="/lifecycle" className="btn-ghost shrink-0" style={{ fontSize: '13px', padding: '10px 22px' }}>
            {isHindi ? 'विस्तृत जीवनचक्र →' : 'Full Lifecycle Detail →'}
          </Link>
        </div>

        {/* Stage cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {STAGES.map((s, i) => {
            const isAct = active === s.step;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => setActive(isAct ? null : s.step)}
                aria-expanded={isAct}
                className={`reveal text-left rounded-2xl p-5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--terracotta)] ${i === STAGES.length - 1 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
                style={{
                  background: isAct ? 'rgba(200,90,50,0.06)' : 'var(--white-paper)',
                  border: `1px solid ${isAct ? 'rgba(200,90,50,0.35)' : 'rgba(30,41,59,0.08)'}`,
                  boxShadow: isAct
                    ? '0 0 0 1px rgba(200,90,50,0.12), 0 4px 24px rgba(30,41,59,0.08)'
                    : '0 2px 12px rgba(30,41,59,0.04)',
                }}
                onMouseEnter={e => { if (!isAct) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(30,41,59,0.16)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; } }}
                onMouseLeave={e => { if (!isAct) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(30,41,59,0.08)'; (e.currentTarget as HTMLElement).style.transform = ''; } }}
              >
                {/* Step number + badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span
                    className="data-value leading-none select-none"
                    style={{ fontSize: '2.5rem', fontWeight: 700, color: isAct ? 'var(--terracotta)' : 'rgba(30,41,59,0.10)' }}
                  >
                    {s.step}
                  </span>
                  <span
                    className={`badge mt-1 shrink-0 ${isAct ? 'badge-warning' : 'badge-neutral'}`}
                    style={isAct ? { background: 'rgba(200,90,50,0.10)', color: 'var(--terracotta)', borderColor: 'rgba(200,90,50,0.25)' } : undefined}
                  >
                    {s.sec}
                  </span>
                </div>

                <h3 className="font-semibold leading-snug" style={{ fontSize: '13.5px', color: 'var(--ink-darker)' }}>
                  {isHindi ? s.hi : s.en}
                </h3>

                {isAct ? (
                  <div className="mt-3 space-y-1.5 animate-fade-in">
                    <div className="flex gap-2 text-[12px]">
                      <span className="font-medium w-16 shrink-0" style={{ color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>Auth</span>
                      <span style={{ color: 'var(--ink-dark)' }}>{s.authority}</span>
                    </div>
                    <div className="flex gap-2 text-[12px]">
                      <span className="font-medium w-16 shrink-0" style={{ color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>SLA</span>
                      <span style={{ color: 'var(--terracotta)' }}>{s.sla}</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1.5 text-[11.5px]" style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)' }}>
                    {s.authority} · {s.sla}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-8 text-center text-[11px]" style={{ color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>
          {isHindi ? 'किसी भी चरण पर क्लिक करें — प्राधिकरण एवं SLA विवरण देखें' : 'Click any stage card to expand authority & SLA · Full workflow in Lifecycle module'}
        </p>
      </div>
    </section>
  );
};
