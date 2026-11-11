'use client';

import React from 'react';
import { DharaHeader }           from '../components/common/DharaHeader';
import { DharaHeroSection }      from '../components/home/DharaHeroSection';
import { DharaCommandPreview }   from '../components/home/DharaCommandPreview';
import { DharaCapabilitiesSection } from '../components/home/DharaCapabilitiesSection';
import { DharaLifecycleSection } from '../components/home/DharaLifecycleSection';
import { DharaIntelligenceSection } from '../components/home/DharaIntelligenceSection';
import { DharaFooter }           from '../components/common/DharaFooter';

/* Terrain SVG reused in the floating DHARA एआई badge */
const TerrainIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <path d="M20 2C10.5 2 3 8.5 3 17C3 22.5 6.5 27 11.5 29C9.5 32 8 35.5 10.5 37C12.5 38.2 15.5 37 17.5 35C18.5 36.2 19.2 37 20 37C20.8 37 21.5 36.2 22.5 35C24.5 37 27.5 38.2 29.5 37C32 35.5 30.5 32 28.5 29C33.5 27 37 22.5 37 17C37 8.5 29.5 2 20 2Z" fill="#C85A32"/>
    <path d="M20 6.5C13.5 6.5 8 11.5 8 18C8 22.5 10.5 26 15 27.5C13 30.5 12 33.5 14 35C15.5 36 18 35 19.5 33C19.7 33.4 19.85 33.7 20 33.9C20.15 33.7 20.3 33.4 20.5 33C22 35 24.5 36 26 35C28 33.5 27 30.5 25 27.5C29.5 26 32 22.5 32 18C32 11.5 26.5 6.5 20 6.5Z" fill="#15803D"/>
    <path d="M20 11C15.5 11 12 14.5 12 19C12 22 13.8 24.5 16.5 25.8C15 28 14.5 30.5 16 31.5C17 32.2 18.5 31.5 19.5 30.2C19.65 30.5 19.82 30.75 20 31C20.18 30.75 20.35 30.5 20.5 30.2C21.5 31.5 23 32.2 24 31.5C25.5 30.5 25 28 23.5 25.8C26.2 24.5 28 22 28 19C28 14.5 24.5 11 20 11Z" fill="#10B981"/>
  </svg>
);

export default function HomePage() {
  return (
    <div
      className="relative min-h-screen"
      style={{ background: 'var(--porcelain)' }}
    >
      {/* ── Topographic contour texture — full-page, fixed ── */}
      {/* opacity 0.22 gives warm visible contour lines like reference */}
      <div
        aria-hidden="true"
        className="topo-bg fixed inset-0 pointer-events-none"
        style={{ zIndex: 0, opacity: 0.22 }}
      />

      {/* ── Soft warm radial glow — top center ── */}
      <div
        aria-hidden="true"
        className="fixed pointer-events-none"
        style={{
          top:       '-200px',
          left:      '50%',
          transform: 'translateX(-50%)',
          width:     '900px',
          height:    '600px',
          borderRadius: '50%',
          background:   'radial-gradient(ellipse, rgba(200,90,50,0.025) 0%, transparent 70%)',
          zIndex:    0,
        }}
      />

      {/* ── Page content above bg layers ── */}
      <div className="relative" style={{ zIndex: 1 }}>
        <DharaHeader />

        <a href="#main-content" className="skip-nav">Skip to main content</a>

        <main id="main-content" tabIndex={-1} className="focus:outline-none has-pill-nav">
          <DharaHeroSection />
          <DharaCommandPreview />
          <DharaCapabilitiesSection />
          <DharaLifecycleSection />
          <DharaIntelligenceSection />
        </main>

        <DharaFooter />
      </div>

      {/*
       * ── Fixed floating widgets — bottom-right ──
       * Scroll-to-top (terracotta circle) + DHARA एआई badge
       * z-[49] sits just below the AI panel (z-50 from BhuMitraAiAssistant)
       * bottom-20 clears the AI pill which anchors at bottom-6
       */}
      <div
        className="fixed bottom-20 right-6 z-[49] flex flex-col items-end gap-3"
        aria-label="Page utilities"
      >
        {/* ↑ Back to top */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{ background: '#C85A32', fontSize: '16px' }}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      </div>
    </div>
  );
}
