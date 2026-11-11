'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLocale } from '@bhumitra/ui';

const CAPS = [
  {
    id: 'gis', href: '/gis', badge: 'PostGIS', badgeCls: 'badge-emerald', banner: false,
    iconPath: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
    titleEn: 'Cadastral GIS Intelligence',    titleHi: 'कैडस्ट्रल GIS आसूचना',
    descEn:  'Parcel-level polygon mapping, spatial conflict detection, and boundary verification on live cadastral records with PostGIS precision.',
    descHi:  'पार्सल-स्तरीय बहुभुज मानचित्रण, स्थानिक संघर्ष पहचान और PostGIS सटीकता के साथ सीमा सत्यापन।',
    iconColor: 'var(--forest-light)',
  },
  {
    id: 'workflow', href: '/lifecycle', badge: 'Sec 4–38', badgeCls: 'badge-warning', banner: false,
    iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    titleEn: 'RFCTLARR Workflow Engine',      titleHi: 'RFCTLARR वर्कफ़्लो इंजन',
    descEn:  'Full statutory state machine from Section 4 SIA to Section 38 Possession with hard SLA enforcement.',
    descHi:  'धारा 4 SIA से धारा 38 कब्जे तक वैधानिक स्थिति मशीन।',
    iconColor: 'var(--terracotta)',
  },
  {
    id: 'comp', href: '/compensation', badge: 'PFMS / DBT', badgeCls: 'badge-success', banner: false,
    iconPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    titleEn: 'Compensation & DBT',            titleHi: 'प्रतिकर एवं DBT',
    descEn:  'RFCTLARR-compliant valuation with 100% solatium and PFMS direct bank transfer.',
    descHi:  '100% तोषाण के साथ PFMS प्रत्यक्ष बैंक अंतरण।',
    iconColor: 'var(--forest-light)',
  },
  {
    id: 'risk', href: '/risk', badge: 'AI / ML', badgeCls: 'badge-warning', banner: false,
    iconPath: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    titleEn: 'Predictive Risk Intelligence',  titleHi: 'पूर्वानुमानित जोखिम',
    descEn:  'ML-based health scoring, bottleneck radar, and proactive delay forecasting.',
    descHi:  'ML-आधारित स्वास्थ्य स्कोरिंग और विलंब पूर्वानुमान।',
    iconColor: 'var(--terracotta)',
  },
  {
    id: 'rr', href: '/rr', badge: 'R&R Act', badgeCls: 'badge-emerald', banner: false,
    iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    titleEn: 'Rehabilitation & Resettlement', titleHi: 'पुनर्वासन',
    descEn:  'End-to-end R&R case management for displaced families — SC/ST, BPL, housing, livelihood.',
    descHi:  'विस्थापित परिवारों के लिए R&R — SC/ST, BPL, आवास।',
    iconColor: 'var(--forest-light)',
  },
  {
    id: 'docs', href: '/documents', badge: 'SHA-256 Audit', badgeCls: 'badge-danger', banner: true,
    iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    titleEn: 'Tamper-Evident Document Vault', titleHi: 'छेड़छाड़-प्रमाण दस्तावेज़ वॉल्ट',
    descEn:  'Gazette notifications, award sheets, khasra maps, and evidence photos with SHA-256 integrity checksums and immutable audit trail.',
    descHi:  'राजपत्र अधिसूचनाएं, पुरस्कार पत्रक, खसरा मानचित्र और SHA-256 ऑडिट ट्रेल।',
    iconColor: 'var(--danger)',
  },
];

export const DharaCapabilitiesSection: React.FC = () => {
  const { isHindi } = useLocale();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.querySelectorAll('.reveal').forEach((node, i) => setTimeout(() => node.classList.add('in-view'), i * 80));
        obs.disconnect();
      }
    }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section-gap" ref={sectionRef}>
      <div className="container-dhara relative z-10">

        {/* Header */}
        <div className="reveal text-center max-w-2xl mx-auto mb-14">
          <div className="eyebrow mb-3" style={{ color: 'var(--terracotta)' }}>
            {isHindi ? 'मुख्य प्लेटफ़ॉर्म क्षमताएं' : 'Core Platform Capabilities'}
          </div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--ink-darker)' }}>
            {isHindi ? 'एक मंच। संपूर्ण अधिग्रहण जीवनचक्र।' : 'One Platform. Complete Acquisition Lifecycle.'}
          </h2>
          <p className="mt-3 text-[0.9375rem]" style={{ color: 'var(--ink-muted)', lineHeight: '1.7' }}>
            {isHindi
              ? 'RFCTLARR अधिनियम 2013 के तहत हर प्रक्रिया — एकीकृत, डिजिटल, पारदर्शी।'
              : 'Every process of land acquisition under RFCTLARR Act 2013 — unified, digitized, and made transparent.'}
          </p>
        </div>

        {/* Bento grid — first 5 cards in 3-col, last card as full-width banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAPS.filter(cap => !cap.banner).map(cap => (
            <Link
              key={cap.id}
              href={cap.href}
              className="reveal paper-card group flex flex-col p-6 no-underline"
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-110 shrink-0"
                style={{ background: 'rgba(30,41,59,0.04)', border: '1px solid rgba(30,41,59,0.08)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: cap.iconColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d={cap.iconPath} />
                </svg>
              </div>

              <h3 className="mb-2" style={{ fontSize: '1.0625rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink-darker)', lineHeight: 1.3 }}>
                {isHindi ? cap.titleHi : cap.titleEn}
              </h3>
              <p className="flex-1 text-[0.875rem]" style={{ color: 'var(--ink-muted)', lineHeight: '1.6' }}>
                {isHindi ? cap.descHi : cap.descEn}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <span className={`badge ${cap.badgeCls}`}>{cap.badge}</span>
                <span
                  className="text-[12.5px] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  style={{ color: cap.iconColor }}
                >
                  Explore
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}

          {/* Banner card — Document Vault — full 3-col width, horizontal layout */}
          {CAPS.filter(cap => cap.banner).map(cap => (
            <Link
              key={cap.id}
              href={cap.href}
              className="reveal paper-card group col-span-1 md:col-span-2 lg:col-span-3 no-underline"
              style={{ borderColor: 'rgba(220,38,38,0.18)' }}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 p-6">
                {/* Left: icon + text */}
                <div className="flex items-center gap-5 flex-1 min-w-0">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.16)' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: cap.iconColor }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d={cap.iconPath} />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="mb-1" style={{ fontSize: '1.0625rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink-darker)', lineHeight: 1.3 }}>
                      {isHindi ? cap.titleHi : cap.titleEn}
                    </h3>
                    <p className="text-[0.875rem]" style={{ color: 'var(--ink-muted)', lineHeight: '1.55' }}>
                      {isHindi ? cap.descHi : cap.descEn}
                    </p>
                  </div>
                </div>
                {/* Right: badge + CTA */}
                <div className="flex items-center gap-4 shrink-0">
                  <span className={`badge ${cap.badgeCls}`}>{cap.badge}</span>
                  <span
                    className="text-[12.5px] font-semibold flex items-center gap-1.5 group-hover:translate-x-1 transition-transform whitespace-nowrap"
                    style={{ color: cap.iconColor }}
                  >
                    Explore
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
