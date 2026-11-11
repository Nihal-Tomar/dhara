import type { Metadata, Viewport } from 'next';
import { LocaleProvider } from '@bhumitra/ui';
import { Suspense } from 'react';
import { DharaAiAssistant } from '../components/ai/DharaAiAssistant';
import { AuthProvider } from '../lib/authContext';
import './globals.css';

export const metadata: Metadata = {
  title: { default:'DHARA — National Land Acquisition Command Platform', template:'%s | DHARA' },
  description:'DHARA: unified national digital command platform for land acquisition intelligence, GIS cadastral management, compensation disbursement, and statutory compliance under RFCTLARR Act 2013. DoLR, MoRD, Government of India.',
  keywords:['DHARA','land acquisition','DoLR','RFCTLARR Act 2013','GIS','cadastral','Ministry of Rural Development'],
  robots:{ index:false, follow:false },
  authors:[{ name:'Department of Land Resources, MoRD, Government of India' }],
};

export const viewport: Viewport = {
  width:'device-width',
  initialScale:1,
  themeColor:'#FAF7F2',
};

export default function RootLayout({ children }:Readonly<{ children:React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Plus Jakarta Sans (UI) · Instrument Serif (italic accent) · JetBrains Mono (data) · Noto Devanagari */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="antialiased">
        <a href="#main-content" className="skip-nav">Skip to main content</a>
        <LocaleProvider defaultLocale="en">
          <AuthProvider>
            {children}
            <Suspense fallback={null}>
              <DharaAiAssistant />
            </Suspense>
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
