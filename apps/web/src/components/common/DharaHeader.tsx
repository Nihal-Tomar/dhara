'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@bhumitra/ui';
import { useAuth, DEFAULT_DEMO_USER, OfficerPreset } from '../../lib/authContext';
import { projectStore, SystemNotification } from '../../lib/projectStore';

/* ─────────────────────────────────────────────────────────────
   Organic GIS terrain logo — layered leaf + topography shapes
   Rust-orange outer, emerald-green middle, teal inner highlight
   Exactly matching the reference image logo style
   ───────────────────────────────────────────────────────────── */
const DharaLogo: React.FC = () => (
  <svg
    width="40" height="40" viewBox="0 0 40 40"
    fill="none" xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Outer rust-orange organic terrain blob */}
    <path
      d="M20 2C10.5 2 3 8.5 3 17C3 22.5 6.5 27 11.5 29C9.5 32 8 35.5 10.5 37C12.5 38.2 15.5 37 17.5 35C18.5 36.2 19.2 37 20 37C20.8 37 21.5 36.2 22.5 35C24.5 37 27.5 38.2 29.5 37C32 35.5 30.5 32 28.5 29C33.5 27 37 22.5 37 17C37 8.5 29.5 2 20 2Z"
      fill="#C85A32"
    />
    {/* Middle emerald-green leaf shape */}
    <path
      d="M20 6.5C13.5 6.5 8 11.5 8 18C8 22.5 10.5 26 15 27.5C13 30.5 12 33.5 14 35C15.5 36 18 35 19.5 33C19.7 33.4 19.85 33.7 20 33.9C20.15 33.7 20.3 33.4 20.5 33C22 35 24.5 36 26 35C28 33.5 27 30.5 25 27.5C29.5 26 32 22.5 32 18C32 11.5 26.5 6.5 20 6.5Z"
      fill="#1E6B4A"
    />
    {/* Inner teal contour highlight */}
    <path
      d="M20 11C15.5 11 12 14.5 12 19C12 22 13.8 24.5 16.5 25.8C15 28 14.5 30.5 16 31.5C17 32.2 18.5 31.5 19.5 30.2C19.65 30.5 19.82 30.75 20 31C20.18 30.75 20.35 30.5 20.5 30.2C21.5 31.5 23 32.2 24 31.5C25.5 30.5 25 28 23.5 25.8C26.2 24.5 28 22 28 19C28 14.5 24.5 11 20 11Z"
      fill="#10B981"
    />
    {/* Highlight dot at top */}
    <circle cx="20" cy="8.5" r="1.8" fill="rgba(255,255,255,0.50)" />
  </svg>
);

export const DharaHeader: React.FC = () => {
  const pathname    = usePathname();
  const { locale, setLocale, isHindi } = useLocale();
  const { user, switchUser, demoUsers } = useAuth();
  const currentUser = user || DEFAULT_DEMO_USER;

  const [moreOpen,   setMoreOpen]   = useState(false);
  const [langOpen,   setLangOpen]   = useState(false);
  const [userOpen,   setUserOpen]   = useState(false);
  const [notifOpen,  setNotifOpen]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    setNotifications(projectStore.getNotifications(currentUser.role));
  }, [currentUser.role, notifOpen]);

  useEffect(() => {
    setMoreOpen(false); setMobileOpen(false);
    setLangOpen(false); setUserOpen(false); setNotifOpen(false);
  }, [pathname]);

  const unread    = notifications.filter(n => !n.isRead).length;
  const shortName = currentUser.name.split(',')[0].split(' ').pop() ?? currentUser.name.charAt(0);
  const initials  = currentUser.name.charAt(0).toUpperCase();

  const navLinks = [
    { href: '/',               label: 'Home',             exact: true },
    { href: '/command',        label: 'National Command' },
    { href: '/projects',       label: 'Projects' },
    { href: '/gis',            label: 'Acquisition GIS' },
    { href: '/infrastructure', label: 'Infrastructure' },
  ];

  const moreLinks = [
    { href: '/lifecycle',    label: 'Acquisition Lifecycle', sub: '9-Stage RFCTLARR Workflow' },
    { href: '/risk',         label: 'Risk Intelligence',     sub: 'Early Warning & Delay Prediction' },
    { href: '/compensation', label: 'Compensation & DBT',    sub: 'Valuation, Solatium & PFMS' },
    { href: '/rr',           label: 'Rehabilitation & R&R',  sub: 'Affected Families & Resettlement' },
    { href: '/documents',    label: 'Gazette & Documents',   sub: 'Sec 11/19 Notices · SHA-256' },
    { href: '/citizen',      label: 'Citizen Portal',        sub: 'Landowner Rights & Transparency' },
  ];

  const isActive   = (href: string, exact = false) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');
  const moreActive = moreLinks.some(l => isActive(l.href));

  /* Shared dropdown panel style */
  const panelStyle: React.CSSProperties = {
    background:     'rgba(255,255,255,0.98)',
    backdropFilter: 'blur(20px)',
    border:         '1px solid rgba(30,41,59,0.10)',
    boxShadow:      '0 12px 40px rgba(30,41,59,0.13)',
  };

  return (
    /*
     * Wrapper is sticky + transparent so the warm topo bg shows through.
     * pointer-events:none on the wrapper itself — restored on the pill.
     */
    <div
      style={{
        position:   'sticky',
        top:        0,
        zIndex:     90,
        pointerEvents: 'none',
      }}
    >
      {/* India tricolor — 3 px strip at the very top */}
      <div
        style={{
          height:        '3px',
          background:    'linear-gradient(90deg,#FF9933 33.33%,#FFFFFF 33.33% 66.66%,#138808 66.66%)',
          pointerEvents: 'auto',
        }}
      />

      {/* Pill centring container */}
      <div
        style={{
          display:        'flex',
          justifyContent: 'center',
          padding:        '10px 20px 6px',
          pointerEvents:  'none',
        }}
      >
        {/* ════════════════ FLOATING PILL ════════════════ */}
        <div
          style={{
            pointerEvents:        'auto',
            width:                '100%',
            maxWidth:             '1080px',
            borderRadius:         '9999px',
            background:           scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.90)',
            backdropFilter:       'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border:               '1px solid rgba(227,223,200,0.70)',
            boxShadow:            scrolled
              ? '0 6px 28px rgba(30,41,59,0.11), 0 2px 6px rgba(30,41,59,0.06)'
              : '0 4px 20px rgba(30,41,59,0.08), 0 1px 4px rgba(30,41,59,0.04)',
            transition:           'background 0.18s ease, box-shadow 0.18s ease',
          }}
        >
          {/* Inner row */}
          <div
            className="flex items-center justify-between gap-2"
            style={{ height: '56px', padding: '0 16px 0 12px' }}
          >

            {/* ── BRAND: organic SVG logo + "DHARA" bold (no subtext) ── */}
            <Link
              href="/"
              aria-label="DHARA home"
              className="flex items-center gap-2 shrink-0 group"
            >
              <div className="group-hover:scale-105 transition-transform duration-200 shrink-0">
                <DharaLogo />
              </div>
              <span
                style={{
                  fontWeight:    700,
                  fontSize:      '20px',
                  letterSpacing: '-0.02em',
                  lineHeight:    1,
                  color:         '#1A202C',
                }}
              >
                DHARA
              </span>
            </Link>

            {/* ── DESKTOP NAV ── */}
            <nav
              aria-label="Primary"
              className="hidden xl:flex items-center gap-0.5 flex-1 justify-center"
            >
              {navLinks.map(link => {
                const active = isActive(link.href, link.exact);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3.5 py-1.5 rounded-full transition-all"
                    style={{
                      fontSize:   '13.5px',
                      color:      active ? '#1A202C' : '#64748B',
                      fontWeight: active ? 600 : 500,
                      background: active ? 'rgba(30,41,59,0.07)' : 'transparent',
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.color      = '#1A202C';
                        (e.currentTarget as HTMLElement).style.background = 'rgba(30,41,59,0.05)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.color      = '#64748B';
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* More ↓ */}
              <div
                className="relative"
                onMouseEnter={() => setMoreOpen(true)}
                onMouseLeave={() => setMoreOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setMoreOpen(v => !v)}
                  aria-expanded={moreOpen}
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-full transition-all"
                  style={{
                    fontSize:   '13.5px',
                    color:      moreActive ? '#1A202C' : '#64748B',
                    fontWeight: moreActive ? 600 : 500,
                    background: moreActive ? 'rgba(30,41,59,0.07)' : 'transparent',
                  }}
                >
                  More
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {moreOpen && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 rounded-2xl py-1.5 overflow-hidden animate-fade-in"
                    style={{ zIndex: 110, ...panelStyle }}
                  >
                    {moreLinks.map(sub => {
                      const active = isActive(sub.href);
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setMoreOpen(false)}
                          className="flex flex-col px-4 py-2.5 gap-0.5 transition-colors"
                          style={{ background: active ? 'rgba(200,90,50,0.05)' : undefined }}
                          onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(30,41,59,0.03)'; }}
                          onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                        >
                          <span style={{ fontSize: '13px', fontWeight: 600, color: active ? '#C85A32' : '#1A202C' }}>
                            {sub.label}
                          </span>
                          <span style={{ fontSize: '11px', color: '#64748B' }}>{sub.sub}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>

            {/* ── RIGHT SECTION ── */}
            <div className="flex items-center gap-1 shrink-0">

              {/* 🔔 Notification bell */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotifOpen(v => !v)}
                  aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ''}`}
                  className="relative w-9 h-9 flex items-center justify-center rounded-full transition-all"
                  style={{ color: '#64748B' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(30,41,59,0.06)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {/* Orange dot badge — always shown like reference image */}
                  <span
                    className="absolute top-1.5 right-1.5 w-[9px] h-[9px] rounded-full"
                    style={{
                      background:  '#C85A32',
                      border:      '1.5px solid rgba(255,255,255,0.90)',
                    }}
                    aria-hidden="true"
                  />
                </button>

                {notifOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 rounded-2xl p-3 animate-fade-in"
                    style={{ width: '360px', maxWidth: 'calc(100vw - 24px)', zIndex: 110, ...panelStyle }}
                    onMouseLeave={() => setNotifOpen(false)}
                  >
                    <div
                      className="flex items-center justify-between pb-2.5 mb-2"
                      style={{ borderBottom: '1px solid rgba(30,41,59,0.08)' }}
                    >
                      <span className="eyebrow" style={{ color: '#64748B' }}>SLA Alerts ({unread})</span>
                      <span style={{ fontSize: '10px', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                        {currentUser.role}
                      </span>
                    </div>
                    <div className="space-y-1 max-h-60 overflow-y-auto">
                      {notifications.length === 0
                        ? (
                          <p className="py-5 text-center" style={{ fontSize: '13px', color: '#64748B' }}>
                            No active alerts
                          </p>
                        )
                        : notifications.map(n => (
                          <Link
                            key={n.id}
                            href={n.linkUrl}
                            onClick={() => { projectStore.markNotificationRead(n.id); setNotifOpen(false); }}
                            className="block p-2.5 rounded-xl transition-colors"
                            style={{
                              background: !n.isRead ? 'rgba(200,90,50,0.04)' : undefined,
                              border:     '1px solid rgba(30,41,59,0.07)',
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(30,41,59,0.03)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = !n.isRead ? 'rgba(200,90,50,0.04)' : 'transparent'}
                          >
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className={`badge ${n.priority === 'critical' ? 'badge-danger' : n.priority === 'high' ? 'badge-high' : 'badge-info'}`}>
                                {n.priority.toUpperCase()}
                              </span>
                              <span className="ml-auto" style={{ fontSize: '10px', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="line-clamp-1" style={{ fontSize: '12.5px', fontWeight: 600, color: '#1A202C' }}>
                              {n.title}
                            </div>
                            <div className="line-clamp-1 mt-0.5" style={{ fontSize: '11px', color: '#64748B' }}>
                              {n.message}
                            </div>
                          </Link>
                        ))
                      }
                    </div>
                  </div>
                )}
              </div>

              {/* EN language toggle */}
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setLangOpen(v => !v)}
                  aria-expanded={langOpen}
                  className="px-2.5 py-1.5 rounded-full transition-all"
                  style={{ fontSize: '12px', fontWeight: 500, color: '#64748B', fontFamily: 'var(--font-mono)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(30,41,59,0.06)';
                    (e.currentTarget as HTMLElement).style.color      = '#1A202C';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color      = '#64748B';
                  }}
                >
                  {isHindi ? 'हि' : 'EN'}
                </button>
                {langOpen && (
                  <div
                    className="absolute right-0 mt-1.5 w-28 rounded-xl py-1 animate-fade-in"
                    style={{ zIndex: 110, ...panelStyle }}
                  >
                    {[['en', 'English'], ['hi', 'हिन्दी']].map(([l, label]) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => { setLocale(l as 'en' | 'hi'); setLangOpen(false); }}
                        className="w-full text-left px-3 py-2 flex items-center justify-between transition-colors"
                        style={{ fontSize: '12px', color: locale === l ? '#C85A32' : '#1A202C', fontWeight: locale === l ? 600 : 400 }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(30,41,59,0.04)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                      >
                        {label}
                        {locale === l && <span style={{ color: '#C85A32' }}>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* S Sharma — green avatar pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserOpen(v => !v)}
                  aria-label="User menu"
                  className="flex items-center gap-1.5 pl-0.5 pr-2.5 py-0.5 rounded-full border transition-all"
                  style={{ borderColor: 'rgba(30,41,59,0.10)', background: 'rgba(30,41,59,0.03)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(30,41,59,0.20)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(30,41,59,0.10)'}
                >
                  {/* Deep green circle avatar — matches reference */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white shrink-0"
                    style={{ fontSize: '12px', background: '#1E4D38', fontFamily: 'var(--font-mono)' }}
                  >
                    {initials}
                  </div>
                  <span
                    className="hidden md:block max-w-[72px] truncate"
                    style={{ fontSize: '13px', fontWeight: 500, color: '#1A202C' }}
                  >
                    {shortName}
                  </span>
                  <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#94A3B8' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userOpen && (
                  <div
                    className="absolute right-0 mt-2 rounded-2xl p-3 animate-fade-in"
                    style={{ width: '260px', zIndex: 110, ...panelStyle }}
                    onMouseLeave={() => setUserOpen(false)}
                  >
                    <div className="pb-2.5 mb-2" style={{ borderBottom: '1px solid rgba(30,41,59,0.08)' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A202C' }}>{currentUser.name}</div>
                      <div style={{ fontSize: '11px', fontWeight: 500, color: '#1E4D38', marginTop: '2px' }}>{currentUser.designation}</div>
                      <div style={{ fontSize: '10px', color: '#94A3B8', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>{currentUser.id}</div>
                    </div>
                    <div className="eyebrow mb-1.5" style={{ color: '#94A3B8' }}>Switch Role</div>
                    <div className="space-y-0.5 max-h-52 overflow-y-auto">
                      {demoUsers.map((u: OfficerPreset) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => { switchUser(u.id); setUserOpen(false); }}
                          className="w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between transition-colors"
                          style={{
                            fontSize:   '12px',
                            background: currentUser.id === u.id ? 'rgba(200,90,50,0.06)' : undefined,
                            color:      currentUser.id === u.id ? '#C85A32' : '#1A202C',
                            fontWeight: currentUser.id === u.id ? 600 : 400,
                          }}
                          onMouseEnter={e => { if (currentUser.id !== u.id) (e.currentTarget as HTMLElement).style.background = 'rgba(30,41,59,0.04)'; }}
                          onMouseLeave={e => { if (currentUser.id !== u.id) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                        >
                          <div>
                            <div className="truncate max-w-[170px]" style={{ fontWeight: 500 }}>{u.name}</div>
                            <div style={{ fontSize: '10px', marginTop: '1px', color: '#64748B' }}>{u.designation}</div>
                          </div>
                          {currentUser.id === u.id && (
                            <span className="text-sm shrink-0" style={{ color: '#C85A32' }}>✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Command Center — deep forest green pill */}
              <Link
                href="/command"
                className="hidden sm:inline-flex items-center justify-center rounded-full font-semibold text-white transition-all"
                style={{
                  background:    '#061a10',
                  fontSize:      '13.5px',
                  padding:       '8px 20px',
                  letterSpacing: '0.01em',
                  whiteSpace:    'nowrap',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#0a2918'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#061a10'}
              >
                Command Center
              </Link>

              {/* Hamburger — mobile only */}
              <button
                type="button"
                onClick={() => setMobileOpen(v => !v)}
                aria-label="Menu"
                aria-expanded={mobileOpen}
                className="xl:hidden w-9 h-9 flex items-center justify-center rounded-full transition-all"
                style={{ color: '#64748B' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(30,41,59,0.06)';
                  (e.currentTarget as HTMLElement).style.color      = '#1A202C';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color      = '#64748B';
                }}
              >
                {mobileOpen
                  ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                }
              </button>
            </div>
          </div>

          {/* ── Mobile drawer ── */}
          {mobileOpen && (
            <div
              className="xl:hidden px-4 pb-5 pt-3 animate-slideDown"
              style={{
                borderTop:      '1px solid rgba(30,41,59,0.08)',
                background:     'rgba(255,255,255,0.98)',
                backdropFilter: 'blur(24px)',
                borderRadius:   '0 0 24px 24px',
              }}
            >
              <div className="grid grid-cols-2 gap-1.5 mb-3">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2.5 rounded-xl border text-center transition-colors"
                    style={{
                      fontSize:    '13px',
                      fontWeight:  500,
                      borderColor: isActive(link.href, link.exact) ? '#C85A32' : 'rgba(30,41,59,0.10)',
                      background:  isActive(link.href, link.exact) ? 'rgba(200,90,50,0.06)' : undefined,
                      color:       isActive(link.href, link.exact) ? '#C85A32' : '#64748B',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="pt-2.5 space-y-0.5" style={{ borderTop: '1px solid rgba(30,41,59,0.08)' }}>
                {moreLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl transition-colors"
                    style={{ fontSize: '13px', color: isActive(link.href) ? '#C85A32' : '#1A202C' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(30,41,59,0.04)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <span style={{ fontWeight: 500 }}>{link.label}</span>
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#94A3B8' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </Link>
                ))}
              </div>
              <Link
                href="/command"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-full mt-3 rounded-full font-semibold text-white transition-all"
                style={{ background: '#061a10', fontSize: '13.5px', padding: '11px 16px' }}
              >
                Open Command Center →
              </Link>
            </div>
          )}
        </div>
        {/* ══════════════════════════════════════════════ */}
      </div>
    </div>
  );
};
