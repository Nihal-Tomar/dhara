'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLocale } from '@bhumitra/ui';

export const DharaIntelligenceSection: React.FC = () => {
  const { isHindi } = useLocale();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.querySelectorAll('.reveal').forEach((node, i) => setTimeout(() => node.classList.add('in-view'), i * 90));
        obs.disconnect();
      }
    }, { threshold: 0.06 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const pillars = [
    {
      iconColor: 'var(--forest-light)',
      iconPath: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
      badgeCls: 'badge-emerald', badge: 'PostGIS',
      titleEn: 'Cadastral GIS Command',     titleHi: 'कैडस्ट्रल GIS कमान',
      descEn:  'Parcel-level polygon mapping, boundary verification, and spatial conflict detection on real cadastral records.',
      descHi:  'पार्सल-स्तरीय बहुभुज मानचित्रण, सीमा सत्यापन और स्थानिक संघर्ष पहचान।',
      href: '/gis', linkEn: 'View GIS Map →', linkHi: 'GIS मानचित्र →',
    },
    {
      iconColor: 'var(--terracotta)',
      iconPath: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
      badgeCls: 'badge-warning', badge: 'AI / ML',
      titleEn: 'AI Risk & Delay Engine',    titleHi: 'AI जोखिम इंजन',
      descEn:  'Predictive bottleneck scoring and delay forecasting powered by heuristic models and live project telemetry.',
      descHi:  'पूर्वानुमानित बाधा स्कोरिंग और लाइव परियोजना टेलीमेट्री।',
      href: '/risk', linkEn: 'Risk Intelligence →', linkHi: 'जोखिम आसूचना →',
    },
    {
      iconColor: 'var(--forest)',
      iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      badgeCls: 'badge-success', badge: 'SHA-256',
      titleEn: 'Compensation Traceability', titleHi: 'प्रतिकर पता लगाने योग्यता',
      descEn:  'Full audit trail from land valuation to PFMS disbursement — every payment verifiable to the paisa.',
      descHi:  'भूमि मूल्यांकन से PFMS वितरण तक पूर्ण ऑडिट ट्रेल।',
      href: '/compensation', linkEn: 'View Compensation →', linkHi: 'प्रतिकर देखें →',
    },
  ];

  return (
    <section className="section-gap relative" ref={sectionRef}>
      <div className="container-dhara relative z-10">

        {/* Header */}
        <div className="reveal text-center max-w-2xl mx-auto mb-14">
          <div className="eyebrow mb-3" style={{ color: 'var(--terracotta)' }}>
            {isHindi ? 'राष्ट्रीय अधिग्रहण आसूचना' : 'National Acquisition Intelligence'}
          </div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--ink-darker)' }}>
            {isHindi ? 'डेटा-संचालित अधिग्रहण नेतृत्व' : 'Data-Driven Acquisition Leadership'}
          </h2>
          <p className="mt-3 text-[0.9375rem]" style={{ color: 'var(--ink-muted)', lineHeight: '1.7' }}>
            {isHindi
              ? 'GIS आसूचना, AI जोखिम स्कोरिंग, और प्रतिकर पारदर्शिता — DHARA का त्रि-स्तंभ ढांचा।'
              : "GIS intelligence, AI risk scoring, and compensation traceability — DHARA's three-pillar decision-support framework."}
          </p>
        </div>

        {/* Pillar cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {pillars.map(p => (
            <div key={p.titleEn} className="reveal paper-card p-7 flex flex-col">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 shrink-0"
                style={{ background: 'rgba(30,41,59,0.04)', border: '1px solid rgba(30,41,59,0.08)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: p.iconColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d={p.iconPath} />
                </svg>
              </div>
              <div className="mb-3"><span className={`badge ${p.badgeCls}`}>{p.badge}</span></div>
              <h3 className="mb-2.5" style={{ fontSize: '1.0625rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink-darker)', lineHeight: 1.3 }}>
                {isHindi ? p.titleHi : p.titleEn}
              </h3>
              <p className="flex-1 text-[0.875rem]" style={{ color: 'var(--ink-muted)', lineHeight: '1.6' }}>
                {isHindi ? p.descHi : p.descEn}
              </p>
              <Link
                href={p.href}
                className="inline-flex items-center gap-1 mt-5 text-[13px] font-semibold"
                style={{ color: p.iconColor, fontFamily: 'var(--font-mono)' }}
              >
                {isHindi ? p.linkHi : p.linkEn}
              </Link>
            </div>
          ))}
        </div>

        {/* CTA Banner — warm paper with terracotta accent */}
        <div
          className="reveal relative overflow-hidden rounded-2xl p-10 lg:p-16 text-center"
          style={{
            background: 'var(--white-paper)',
            border: '1px solid rgba(200,90,50,0.18)',
            boxShadow: '0 4px 32px rgba(30,41,59,0.07)',
          }}
        >
          {/* Topo pattern — consistent low opacity */}
          <div className="topo-bg absolute inset-0 pointer-events-none opacity-[0.14]" aria-hidden="true" />
          {/* Soft terracotta glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(200,90,50,0.05) 0%, transparent 70%)' }}
          />

          <div className="relative z-10">
            <div className="eyebrow mb-4" style={{ color: 'var(--terracotta)' }}>
              {isHindi ? 'अभी शुरू करें' : 'Get Started · DoLR · SIH 2026'}
            </div>
            <h3
              style={{
                fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: 'var(--ink-darker)',
                marginBottom: '0.75rem',
              }}
            >
              {isHindi ? 'DHARA के साथ शुरू करें' : 'Enter the DHARA Command Centre'}
            </h3>
            <p
              className="mb-8 max-w-lg mx-auto text-[0.9375rem]"
              style={{ color: 'var(--ink-muted)', lineHeight: '1.7' }}
            >
              {isHindi
                ? 'GIS मानचित्र, परियोजना स्थिति, मुआवजा ट्रेसर, जोखिम आसूचना और बहुत कुछ एक्सप्लोर करें।'
                : 'Explore the GIS cadastral map, project status, compensation tracer, risk intelligence and more.'}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/command" className="btn-primary" style={{ fontSize: '14.5px', padding: '13px 32px' }}>
                {isHindi ? 'कमान केंद्र खोलें' : 'Open Command Centre'}
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/login" className="btn-ghost" style={{ fontSize: '14.5px', padding: '13px 32px' }}>
                {isHindi ? 'अधिकारी लॉगिन' : 'Officer Login'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
