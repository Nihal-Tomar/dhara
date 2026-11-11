'use client';

import React from 'react';
import Link from 'next/link';

export const DharaFooter: React.FC = () => {
  return (
    <footer
      style={{
        background: 'var(--porcelain)',
        borderTop: '1px solid rgba(30,41,59,0.10)',
      }}
    >
      <div className="container-dhara">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 pb-8">

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              {/* Organic terrain SVG logo — matches navbar */}
              <svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true" className="shrink-0">
                <path d="M20 2C10.5 2 3 8.5 3 17C3 22.5 6.5 27 11.5 29C9.5 32 8 35.5 10.5 37C12.5 38.2 15.5 37 17.5 35C18.5 36.2 19.2 37 20 37C20.8 37 21.5 36.2 22.5 35C24.5 37 27.5 38.2 29.5 37C32 35.5 30.5 32 28.5 29C33.5 27 37 22.5 37 17C37 8.5 29.5 2 20 2Z" fill="#C85A32"/>
                <path d="M20 6.5C13.5 6.5 8 11.5 8 18C8 22.5 10.5 26 15 27.5C13 30.5 12 33.5 14 35C15.5 36 18 35 19.5 33C19.7 33.4 19.85 33.7 20 33.9C20.15 33.7 20.3 33.4 20.5 33C22 35 24.5 36 26 35C28 33.5 27 30.5 25 27.5C29.5 26 32 22.5 32 18C32 11.5 26.5 6.5 20 6.5Z" fill="#1E6B4A"/>
                <path d="M20 11C15.5 11 12 14.5 12 19C12 22 13.8 24.5 16.5 25.8C15 28 14.5 30.5 16 31.5C17 32.2 18.5 31.5 19.5 30.2C19.65 30.5 19.82 30.75 20 31C20.18 30.75 20.35 30.5 20.5 30.2C21.5 31.5 23 32.2 24 31.5C25.5 30.5 25 28 23.5 25.8C26.2 24.5 28 22 28 19C28 14.5 24.5 11 20 11Z" fill="#10B981"/>
              </svg>
              <span
                style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '-0.02em', color: 'var(--ink-darker)', lineHeight: 1 }}
              >
                DHARA
              </span>
            </div>
            <p
              className="text-[12px] leading-relaxed"
              style={{ color: 'var(--ink-muted)', maxWidth: '240px' }}
            >
              Department of Land Resources<br />
              Ministry of Rural Development<br />
              Government of India
            </p>
            <div
              className="text-[10.5px] font-medium"
              style={{ color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}
            >
              DoLR · MoRD · SIH 2026
            </div>
          </div>

          {/* Col 2 — Navigation */}
          <nav aria-label="Footer navigation" className="flex flex-col gap-2.5">
            <div
              className="text-[10.5px] font-semibold uppercase tracking-widest mb-1"
              style={{ color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}
            >
              Platform
            </div>
            {[
              { href: '/command',   label: 'National Command' },
              { href: '/gis',       label: 'Acquisition GIS' },
              { href: '/lifecycle', label: 'Lifecycle' },
              { href: '/citizen',   label: 'Citizen Help' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13.5px] transition-colors w-fit"
                style={{ color: 'var(--ink-muted)', fontWeight: 500 }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--ink-darker)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--ink-muted)'}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Col 3 — Legal & Copyright */}
          <div className="flex flex-col gap-3 md:items-end md:text-right">
            <div
              className="text-[10.5px] font-semibold uppercase tracking-widest mb-1"
              style={{ color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}
            >
              Legal
            </div>
            <span className="text-[13px]" style={{ color: 'var(--ink-muted)' }}>
              © 2026 DHARA. All rights reserved.
            </span>
            <Link
              href="/legal"
              className="text-[12px] transition-colors w-fit"
              style={{ color: 'var(--ink-faint)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--ink-muted)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--ink-faint)'}
            >
              Privacy &amp; Terms
            </Link>
            <Link
              href="/legal"
              className="text-[12px] transition-colors w-fit"
              style={{ color: 'var(--ink-faint)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--ink-muted)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--ink-faint)'}
            >
              Accessibility Statement
            </Link>
          </div>
        </div>

        {/* Bottom rule */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 py-5"
          style={{ borderTop: '1px solid rgba(30,41,59,0.07)' }}
        >
          <div className="flex items-center gap-2">
            {/* India tricolor dots */}
            <span className="w-2 h-2 rounded-full" style={{ background: '#FF9933' }} aria-hidden="true" />
            <span className="w-2 h-2 rounded-full" style={{ background: '#FFFFFF', border: '1px solid rgba(30,41,59,0.14)' }} aria-hidden="true" />
            <span className="w-2 h-2 rounded-full" style={{ background: '#138808' }} aria-hidden="true" />
            <span className="text-[11px] ml-1" style={{ color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>
              Built for Bharat · RFCTLARR Act 2013
            </span>
          </div>
          <span className="text-[11px]" style={{ color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>
            v8.0 · National Land Acquisition Platform
          </span>
        </div>
      </div>

    </footer>
  );
};
