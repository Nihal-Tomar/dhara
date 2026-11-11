'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@bhumitra/ui';

/* ── Animated counter ── */
function useCounter(target: number, duration = 1800, active = false) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf: number;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(e * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, active]);
  return v;
}

/* ── Sparkline ── */
const Sparkline: React.FC<{ color: string; pts: string; animated?: boolean }> = ({ color, pts, animated }) => (
  <svg width="58" height="24" viewBox="0 0 58 24" fill="none" aria-hidden="true">
    <polyline
      points={pts}
      stroke={color}
      strokeWidth="1.75"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={animated ? 'sparkline-path' : ''}
    />
    <circle
      cx={parseFloat(pts.split(' ').pop()!.split(',')[0])}
      cy={parseFloat(pts.split(' ').pop()!.split(',')[1])}
      r="2.5"
      fill={color}
    />
  </svg>
);

/* ── GIS parcel overlay ── */
const GISOverlay: React.FC = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 420 320"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    {[0, 60, 120, 180, 240, 300, 360, 420].map(x => (
      <line key={`vg${x}`} x1={x} y1="0" x2={x} y2="320" stroke="rgba(16,185,129,0.20)" strokeWidth="0.5" />
    ))}
    {[0, 64, 128, 192, 256, 320].map(y => (
      <line key={`hg${y}`} x1="0" y1={y} x2="420" y2={y} stroke="rgba(16,185,129,0.20)" strokeWidth="0.5" />
    ))}
    <polygon points="55,45 165,40 172,135 62,142"    fill="rgba(16,185,129,0.14)" stroke="#10B981" strokeWidth="2" />
    <polygon points="178,40 288,36 295,128 185,133"   fill="rgba(230,196,0,0.12)"  stroke="#E6C400" strokeWidth="2" />
    <polygon points="62,150 170,144 177,235 68,242"   fill="rgba(16,185,129,0.10)" stroke="#10B981" strokeWidth="2" />
    <polygon points="186,138 294,132 302,224 192,230" fill="rgba(16,185,129,0.12)" stroke="#10B981" strokeWidth="2" />
    <polygon points="298,36 390,33 396,118 303,122"   fill="rgba(16,185,129,0.10)" stroke="#10B981" strokeWidth="2" />
    {[{ x: 108, y: 92, l: 'PO01' }, { x: 234, y: 85, l: 'PO02' }, { x: 112, y: 192, l: 'PO03' }, { x: 242, y: 184, l: 'PO04' }, { x: 342, y: 80, l: 'PO05' }].map(p => (
      <g key={p.l}>
        <rect x={p.x - 16} y={p.y - 10} width="32" height="14" rx="3" fill="rgba(0,0,0,0.65)" />
        <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
          fill="rgba(255,255,255,0.95)" fontSize="8.5" fontFamily="'JetBrains Mono',monospace" fontWeight="600">{p.l}</text>
      </g>
    ))}
    <circle cx="234" cy="85" r="14" fill="none" stroke="rgba(16,185,129,0.90)" strokeWidth="1.5" strokeDasharray="3 2" />
    <line x1="234" y1="72" x2="234" y2="62" stroke="rgba(16,185,129,0.80)" strokeWidth="1" />
    <line x1="248" y1="85" x2="258" y2="85" stroke="rgba(16,185,129,0.80)" strokeWidth="1" />
    {([{ x: 16, y: 16, r: 0 }, { x: 404, y: 16, r: 90 }, { x: 404, y: 304, r: 180 }, { x: 16, y: 304, r: 270 }] as Array<{ x: number; y: number; r: number }>).map((c, i) => (
      <g key={i} transform={`translate(${c.x},${c.y}) rotate(${c.r},0,0)`}>
        <line x1="0" y1="0" x2="14" y2="0"  stroke="rgba(16,185,129,0.70)" strokeWidth="1.5" />
        <line x1="0" y1="0" x2="0"  y2="14" stroke="rgba(16,185,129,0.70)" strokeWidth="1.5" />
      </g>
    ))}
  </svg>
);

/* ── Infrastructure bounding box ── */
const InfraBBox: React.FC = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 500 340"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <rect x="60" y="90" width="380" height="80" fill="none" stroke="#10B981" strokeWidth="1.5" strokeDasharray="6 3" rx="2" />
    <rect x="80" y="100" width="340" height="60" fill="rgba(16,185,129,0.06)" stroke="#10B981" strokeWidth="1" strokeDasharray="4 2" rx="2" />
    <line x1="60"  y1="90"  x2="40"  y2="70"  stroke="rgba(16,185,129,0.55)" strokeWidth="1" />
    <line x1="440" y1="90"  x2="460" y2="70"  stroke="rgba(16,185,129,0.55)" strokeWidth="1" />
    <line x1="440" y1="170" x2="460" y2="150" stroke="rgba(16,185,129,0.55)" strokeWidth="1" />
    <line x1="40"  y1="70"  x2="460" y2="70"  stroke="rgba(16,185,129,0.45)" strokeWidth="1" />
    <line x1="0"   y1="130" x2="500" y2="130" stroke="rgba(16,185,129,0.20)" strokeWidth="0.75" strokeDasharray="3 6" />
    <line x1="60"  y1="195" x2="440" y2="195" stroke="rgba(8,145,178,0.40)"  strokeWidth="0.75" />
    <line x1="60"  y1="190" x2="60"  y2="200" stroke="rgba(8,145,178,0.40)"  strokeWidth="1" />
    <line x1="440" y1="190" x2="440" y2="200" stroke="rgba(8,145,178,0.40)"  strokeWidth="1" />
    <text x="250" y="208" textAnchor="middle" fill="rgba(8,145,178,0.80)" fontSize="9" fontFamily="'JetBrains Mono',monospace">24.8 km</text>
    {([{ x: 60, y: 90, r: 0 }, { x: 440, y: 90, r: 90 }, { x: 440, y: 170, r: 180 }, { x: 60, y: 170, r: 270 }] as Array<{ x: number; y: number; r: number }>).map((c, i) => (
      <g key={i} transform={`translate(${c.x},${c.y}) rotate(${c.r},0,0)`}>
        <line x1="0" y1="0" x2="12" y2="0"  stroke="#10B981" strokeWidth="1.5" />
        <line x1="0" y1="0" x2="0"  y2="12" stroke="#10B981" strokeWidth="1.5" />
      </g>
    ))}
  </svg>
);

export const DharaHeroSection: React.FC = () => {
  const { isHindi } = useLocale();
  const bentoRef = useRef<HTMLDivElement>(null);
  const [bentoVis, setBentoVis] = useState(false);

  useEffect(() => {
    const el = bentoRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setBentoVis(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const projCount = useCounter(1284, 1800, bentoVis);
  const haCount   = useCounter(48500, 2000, bentoVis);

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          HERO — centered editorial layout, tight for viewport fold
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ paddingTop: '20px', paddingBottom: '0' }}>
        <div className="container-dhara relative z-10">
          <div
            className="flex flex-col items-center text-center mx-auto"
            style={{ maxWidth: '860px' }}
          >

            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 animate-fade-up"
              style={{ background: 'rgba(200,90,50,0.07)', border: '1px solid rgba(200,90,50,0.18)' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: 'var(--terracotta)', animation: 'pulseDot 2.5s ease-in-out infinite' }}
              />
              <span className="eyebrow" style={{ color: 'var(--terracotta)', fontSize: '10px' }}>
                {isHindi
                  ? 'राष्ट्रीय भूमि अधिग्रहण कमान मंच · DoLR · MoRD'
                  : 'National Land Acquisition Command Platform · DoLR · MoRD'}
              </span>
            </div>

            {/* Headline line 1 — tighter size for fold */}
            <h1
              className="animate-fade-up anim-delay-1"
              style={{
                fontFamily:    'var(--font-ui)',
                fontSize:      'clamp(1.9rem, 4.5vw, 3.5rem)',
                fontWeight:    800,
                letterSpacing: '-0.03em',
                lineHeight:    1.06,
                color:         'var(--ink-darker)',
                marginBottom:  '0.05em',
              }}
            >
              {isHindi ? 'बुद्धिमान भूमि अधिग्रहण।' : 'Intelligent Land Acquisition.'}
            </h1>

            {/* Headline line 2 — italic serif, two-tone */}
            <div
              className="animate-fade-up anim-delay-1"
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: 'clamp(1.75rem, 4vw, 3.25rem)',
                lineHeight: 1.08,
                marginBottom: '0',
              }}
            >
              {isHindi ? (
                <>
                  <span style={{ color: 'var(--forest)' }}>पारदर्शी </span>
                  <span style={{ color: 'var(--terracotta)' }}>शासन।</span>
                </>
              ) : (
                <>
                  <span style={{ color: 'var(--forest)' }}>Transparent </span>
                  <span style={{ color: 'var(--terracotta)' }}>Governance.</span>
                </>
              )}
            </div>

            {/* Sub-headline — tighter margin */}
            <p
              className="animate-fade-up anim-delay-2"
              style={{
                maxWidth:   '540px',
                color:      'var(--ink-muted)',
                fontSize:   '0.9375rem',
                lineHeight: '1.6',
                marginTop:  '12px',
                fontWeight: 400,
              }}
            >
              {isHindi
                ? 'RFCTLARR अधिनियम 2013 के अंतर्गत भूमि अधिग्रहण, GIS कैडस्ट्रल मानचित्रण, प्रतिकर वितरण, पुनर्वास और वैधानिक अनुपालन के लिए एकीकृत राष्ट्रीय डिजिटल मंच।'
                : 'A unified digital command platform for land acquisition, GIS cadastral intelligence, fair compensation, rehabilitation & resettlement, and statutory compliance under RFCTLARR Act 2013.'}
            </p>

            {/* CTAs — tight gap */}
            <div
              className="flex flex-wrap items-center justify-center gap-3 animate-fade-up anim-delay-3"
              style={{ marginTop: '16px', marginBottom: '0' }}
            >
              <Link href="/command" className="btn-primary" style={{ fontSize: '13.5px', padding: '11px 26px' }}>
                {isHindi ? 'कमान केंद्र खोलें →' : 'Open Command Center →'}
              </Link>
              <Link href="/gis" className="btn-ghost" style={{ fontSize: '13px', padding: '10px 24px' }}>
                {isHindi ? 'GIS मानचित्र देखें' : 'View GIS Map'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          BENTO GRID — white paper cards on porcelain canvas
      ══════════════════════════════════════════════════════ */}
      <section ref={bentoRef} style={{ paddingTop: '16px', paddingBottom: '48px' }}>
        <div className="container-dhara">

          {/* ── ROW 1: 3 columns ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

            {/* CARD 1 — Infrastructure Monitoring */}
            <div className="paper-card overflow-hidden relative" style={{ minHeight: '300px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=900&q=80"
                alt="Aerial view of infrastructure corridor"
                className="absolute inset-0 w-full h-full object-cover object-center"
                style={{ opacity: 0.88 }}
              />
              {/* Warm gradient — legible text at bottom */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(250,247,242,0.96) 0%, rgba(250,247,242,0.20) 50%, rgba(250,247,242,0.0) 100%)',
                }}
              />
              <InfraBBox />
              <div
                className="absolute left-0 right-0 h-px pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg,transparent,rgba(16,185,129,0.40),transparent)',
                  animation: 'scanLine 8s linear infinite',
                  top: '30%',
                }}
              />

              <div className="absolute inset-0 flex flex-col justify-between p-4">
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                    style={{
                      background: 'rgba(255,255,255,0.90)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(30,41,59,0.10)',
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: '#10B981', animation: 'pulseDot 2s ease-in-out infinite' }}
                    />
                    <span className="text-[11px] font-medium" style={{ color: 'var(--ink-dark)' }}>
                      ✈ Active aerial drone
                    </span>
                  </div>
                </div>
                <div>
                  <div
                    className="text-[10.5px] font-semibold uppercase tracking-widest mb-1"
                    style={{ color: 'var(--ink-dark)', fontFamily: 'var(--font-mono)' }}
                  >
                    Infrastructure Monitoring
                  </div>
                  <h3 className="text-[0.9375rem] font-bold leading-snug mb-2" style={{ color: 'var(--ink-darker)' }}>
                    NH Corridor · Section 19 Gazette
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="badge badge-emerald">Sec 19 Active</span>
                    <span className="badge badge-warning">SLA: 8d remaining</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2 — Interactive GIS Map */}
            <div
              className="relative rounded-2xl overflow-hidden border"
              style={{
                minHeight:   '300px',
                height:      '100%',
                background:  '#0f1a0f',
                borderColor: 'rgba(71,85,105,0.5)',
              }}
            >
              {/* Dark satellite imagery base */}
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    radial-gradient(ellipse 55% 55% at 42% 48%, rgba(28,74,34,0.60) 0%, transparent 55%),
                    radial-gradient(ellipse 35% 45% at 68% 32%, rgba(55,88,38,0.45) 0%, transparent 48%),
                    linear-gradient(145deg,#0a1a10 0%,#0d1e14 50%,#091610 100%)
                  `,
                }}
              />
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 420 340" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <line x1="0" y1="170" x2="420" y2="170" stroke="rgba(180,160,80,0.35)" strokeWidth="5" />
                <line x1="210" y1="0"  x2="210" y2="340" stroke="rgba(180,160,80,0.25)" strokeWidth="3.5" />
              </svg>
              <GISOverlay />

              {/* Top label */}
              <div className="absolute top-3 left-3 z-10">
                <div className="text-[11.5px] font-semibold" style={{ color: 'rgba(255,255,255,0.90)', fontFamily: 'var(--font-ui)' }}>
                  Interactive GIS Map
                </div>
              </div>

              {/* HUD Telemetry card — absolute positioned per spec */}
              <div
                className="absolute top-3 right-3 z-10 rounded-xl p-3 w-44"
                style={{
                  background:     'rgba(15,26,15,0.90)',
                  backdropFilter: 'blur(12px)',
                  border:         '1px solid rgba(71,85,105,0.60)',
                  color:          '#fff',
                }}
              >
                <div className="text-[9px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(148,163,184,0.90)', fontFamily: 'var(--font-mono)' }}>
                  HUD Telemetry
                </div>
                {[
                  { l: 'Cadest. Parcel', v: 'PO02' },
                  { l: 'Telemetry', v: '3,004.198' },
                  { l: 'Ha Notified', v: '48,520' },
                ].map(r => (
                  <div key={r.l} className="flex items-center justify-between mb-1 last:mb-0">
                    <span className="text-[9px]" style={{ color: 'rgba(148,163,184,0.80)', fontFamily: 'var(--font-mono)' }}>{r.l}</span>
                    <span className="data-value text-[9.5px] font-semibold" style={{ color: 'rgba(255,255,255,0.90)' }}>{r.v}</span>
                  </div>
                ))}
              </div>

              {/* Map controls — absolute bottom-left per spec */}
              <div className="absolute bottom-3 left-3 z-10 flex flex-col gap-1 p-1 rounded-lg border" style={{ background: 'rgba(255,255,255,0.90)', backdropFilter: 'blur(8px)', borderColor: 'rgba(30,41,59,0.12)' }}>
                {['+', '−', '⊕', '☰'].map(sym => (
                  <div
                    key={sym}
                    className="w-7 h-7 rounded-md flex items-center justify-center cursor-pointer text-[13px] transition-colors"
                    style={{ color: '#1A202C' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(30,41,59,0.06)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    {sym}
                  </div>
                ))}
              </div>

              {/* Bottom HUD bar */}
              <div
                className="absolute bottom-0 left-0 right-0 px-4 py-2 flex items-center justify-between z-10"
                style={{
                  background:    'rgba(10,26,16,0.85)',
                  borderTop:     '1px solid rgba(71,85,105,0.40)',
                  backdropFilter:'blur(8px)',
                }}
              >
                <span className="eyebrow" style={{ color: 'rgba(148,163,184,0.80)', fontSize: '8.5px' }}>PO01 — Cadastral GIS · EPSG:4326</span>
                <span className="badge badge-emerald" style={{ fontSize: '9px' }}>PostGIS</span>
              </div>
            </div>

            {/* CARD 3+4 stacked — Stat Counter + Live Alerts */}
            <div className="flex flex-col gap-4">

              {/* Stat Counter */}
              <div className="paper-card p-5 flex-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[13px] font-semibold" style={{ color: 'var(--ink-dark)' }}>Stat Counter</span>
                  <div className="flex items-center gap-1.5">
                    <span className="badge badge-neutral">Live</span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-end gap-2 mb-0.5">
                    <span
                      className="data-value font-bold"
                      style={{ fontSize: 'clamp(1.75rem,3vw,2.25rem)', color: 'var(--ink-darker)', letterSpacing: '-0.04em', lineHeight: 1 }}
                    >
                      {bentoVis ? projCount.toLocaleString() : '0'}
                    </span>
                    <Sparkline color="var(--terracotta)" pts="0,20 9,16 18,18 27,10 36,12 45,5 58,3" animated={bentoVis} />
                  </div>
                  <div className="text-[11px]" style={{ color: 'var(--ink-muted)' }}>Active Projects</div>
                  <div className="text-[10px]" style={{ color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>High contrast</div>
                </div>

                <div style={{ borderTop: '1px solid rgba(30,41,59,0.07)', paddingTop: '12px' }}>
                  <div className="flex items-end gap-2 mb-0.5">
                    <span
                      className="data-value font-bold"
                      style={{ fontSize: 'clamp(1.4rem,2.5vw,1.875rem)', color: 'var(--ink-darker)', letterSpacing: '-0.04em', lineHeight: 1 }}
                    >
                      {bentoVis ? haCount.toLocaleString() : '0'}<span className="text-[0.6em] ml-0.5" style={{ color: 'var(--ink-muted)' }}> Ha</span>
                    </span>
                    <Sparkline color="#10B981" pts="0,21 9,17 18,19 27,11 36,13 45,6 58,2" animated={bentoVis} />
                  </div>
                  <div className="text-[11px]" style={{ color: 'var(--ink-muted)' }}>Land Notified</div>
                  <div className="text-[10px]" style={{ color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>Micro sparkline</div>
                </div>
              </div>

              {/* Live Alerts mini-card */}
              <div className="paper-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[13px] font-semibold" style={{ color: 'var(--ink-dark)' }}>Live Alerts</span>
                  <div className="flex items-center gap-1.5">
                    <span className="badge badge-neutral">Status</span>
                    <span className="badge" style={{ background: 'rgba(200,90,50,0.10)', color: 'var(--terracotta)', border: '1px solid rgba(200,90,50,0.20)' }}>Status</span>
                  </div>
                </div>
                {/* Mini sparklines for status */}
                <div className="flex items-center gap-4 mb-3">
                  <Sparkline color="var(--terracotta)" pts="0,18 9,14 18,16 27,8 36,10 45,4 58,6" animated={bentoVis} />
                  <Sparkline color="#10B981" pts="0,19 9,15 18,17 27,9 36,11 45,5 58,3" animated={bentoVis} />
                </div>
                <div className="space-y-2">
                  {[
                    { title: 'NH-48 SLA Critical',      sev: 'critical' },
                    { title: 'Western DFC: Bank Hold',   sev: 'high' },
                  ].map((a, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-lg"
                      style={{ background: 'rgba(30,41,59,0.03)', border: '1px solid rgba(30,41,59,0.06)' }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{
                          background: a.sev === 'critical' ? 'var(--danger)' : 'var(--warning)',
                          animation: 'pulseDot 2s ease-in-out infinite',
                        }}
                      />
                      <span className="text-[11.5px] font-medium leading-snug" style={{ color: 'var(--ink-dark)' }}>{a.title}</span>
                      <span className={`badge shrink-0 ml-auto ${a.sev === 'critical' ? 'badge-danger' : 'badge-warning'}`}>
                        {a.sev === 'critical' ? 'Critical' : 'High'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── ROW 2: Lifecycle + Detailed Stats ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

            {/* CARD 4 — Statutory Lifecycle Timeline */}
            <div className="paper-card p-6 lg:col-span-3">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="eyebrow mb-1" style={{ color: 'var(--terracotta)' }}>Statutory Lifecycle</div>
                  <h3 className="text-[0.9375rem] font-bold" style={{ color: 'var(--ink-darker)' }}>
                    RFCTLARR Act 2013 — Acquisition Workflow
                  </h3>
                </div>
                <Link href="/lifecycle" className="eyebrow flex items-center gap-1 hover:underline" style={{ color: 'var(--forest)', fontSize: '10px' }}>
                  Full Detail ↗
                </Link>
              </div>

              {/* Horizontal step flow */}
              <div className="flex items-start gap-0 overflow-x-auto pb-2">
                {[
                  { n: '01', l: 'Sec 4 SIA', desc: 'Social Impact', done: true,  active: false },
                  { n: '02', l: 'Sec 11',    desc: 'Preliminary',   done: true,  active: false },
                  { n: '03', l: 'Sec 12',    desc: 'Objection',     done: false, active: true  },
                  { n: '04', l: 'Sec 15',    desc: 'Hearing',       done: false, active: false },
                  { n: '05', l: 'Sec 19',    desc: 'Final Decl.',   done: false, active: false },
                ].map((s, i, arr) => (
                  <div key={s.n} className="flex items-center flex-shrink-0">
                    <div className="flex flex-col items-center gap-2 w-20">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[12px] border-2 transition-all"
                        style={{
                          background:   s.done ? 'var(--forest)' : s.active ? 'rgba(200,90,50,0.10)' : 'rgba(30,41,59,0.04)',
                          borderColor:  s.done ? 'var(--forest)' : s.active ? 'var(--terracotta)' : 'rgba(30,41,59,0.14)',
                          color:        s.done ? '#fff' : s.active ? 'var(--terracotta)' : 'var(--ink-muted)',
                          fontFamily:   'var(--font-mono)',
                          boxShadow:    s.active ? '0 0 0 4px rgba(200,90,50,0.10)' : s.done ? '0 0 0 3px rgba(30,77,56,0.12)' : 'none',
                        }}
                      >
                        {s.done
                          ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                          : s.n}
                      </div>
                      <div className="text-center">
                        <div
                          className="text-[10.5px] font-bold"
                          style={{
                            color: s.done ? 'var(--forest)' : s.active ? 'var(--terracotta)' : 'var(--ink-muted)',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          {s.l}
                        </div>
                        <div className="text-[9.5px] mt-0.5" style={{ color: 'var(--ink-faint)' }}>{s.desc}</div>
                      </div>
                    </div>
                    {i < arr.length - 1 && (
                      <div
                        className="w-8 h-px flex-shrink-0 mb-6"
                        style={{
                          background: s.done ? 'var(--forest)' : 'rgba(30,41,59,0.12)',
                          boxShadow: s.done ? '0 0 4px rgba(30,77,56,0.25)' : 'none',
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Compliance bar */}
              <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(30,41,59,0.08)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px]" style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)' }}>RFCTLARR Compliance Progress</span>
                  <span className="data-value text-[11px] font-semibold" style={{ color: 'var(--forest)' }}>48% Complete</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(30,41,59,0.07)' }}>
                  <div className="h-full rounded-full" style={{ width: '48%', background: 'linear-gradient(90deg,var(--forest),#10B981)' }} />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px]" style={{ color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>Stages 01–02 complete · Stage 03 active</span>
                  <span className="badge badge-warning" style={{ fontSize: '9.5px' }}>SLA: 60 days</span>
                </div>
              </div>
            </div>

            {/* CARD 5 — Live SLA Alerts Panel */}
            <div className="paper-card p-5 lg:col-span-2 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13.5px] font-semibold" style={{ color: 'var(--ink-dark)' }}>Live SLA Alerts</span>
                <div className="flex items-center gap-2">
                  <span className="badge badge-danger">CRITICAL</span>
                  <span className="badge badge-warning">HIGH</span>
                </div>
              </div>

              <div className="space-y-2.5 flex-1">
                {[
                  { title: 'NH-48 SLA Critical',         sub: 'Statutory SLA +22 days slippage', sev: 'critical' },
                  { title: 'Western DFC: Bank Hold',      sub: 'DBT · 12 accounts pending',       sev: 'high' },
                  { title: 'PN-NK Rail: Sec 15 Hearing',  sub: 'Objection · Scheduled 14:00 IST', sev: 'normal' },
                  { title: 'MP-Ind: Valuation Dispute',   sub: 'Sec 23 · Collector review req.',  sev: 'high' },
                ].map((a, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl transition-all cursor-pointer"
                    style={{
                      background: 'rgba(30,41,59,0.02)',
                      border: `1px solid ${a.sev === 'critical' ? 'rgba(220,38,38,0.18)' : a.sev === 'high' ? 'rgba(217,119,6,0.18)' : 'rgba(30,41,59,0.08)'}`,
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = a.sev === 'critical' ? 'rgba(220,38,38,0.40)' : a.sev === 'high' ? 'rgba(217,119,6,0.40)' : 'rgba(30,41,59,0.18)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = a.sev === 'critical' ? 'rgba(220,38,38,0.18)' : a.sev === 'high' ? 'rgba(217,119,6,0.18)' : 'rgba(30,41,59,0.08)'}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{
                        background: a.sev === 'critical' ? 'var(--danger)' : a.sev === 'high' ? 'var(--warning)' : 'var(--info)',
                        animation: 'pulseDot 2s ease-in-out infinite',
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[12.5px] font-semibold leading-snug" style={{ color: 'var(--ink-dark)' }}>{a.title}</div>
                      <div className="text-[10.5px] mt-0.5" style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)' }}>{a.sub}</div>
                    </div>
                    <span className={`badge shrink-0 mt-0.5 ${a.sev === 'critical' ? 'badge-danger' : a.sev === 'high' ? 'badge-warning' : 'badge-info'}`}>
                      {a.sev.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(30,41,59,0.08)' }}>
                <span className="text-[10.5px]" style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)' }}>4 active · 1 critical</span>
                <Link href="/risk" className="eyebrow flex items-center gap-1 hover:underline" style={{ color: 'var(--terracotta)' }}>
                  Risk Intel ↗
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
