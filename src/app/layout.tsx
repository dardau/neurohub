import React from 'react';
import type { Metadata, Viewport } from 'next';
import { DM_Sans, Fraunces } from 'next/font/google';
import '../styles/tailwind.css';

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-fraunces',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'NeuroHub AI — AI-реабилитация детей с ЗРР, ЗПР, РАС',
  description:
    'NeuroHub AI — первая AI-платформа персонализированной реабилитации для детей с ЗРР, ЗПР, РАС и ДЦП на рынке СНГ. Геймификация, аналитика, удалённый доступ.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
  openGraph: {
    title: 'NeuroHub AI — AI-реабилитация детей',
    description: 'AI-платформа для детей с ЗРР, ЗПР, РАС и ДЦП. Персонализированные программы, геймификация, аналитика в реальном времени.',
    images: [{ url: '/assets/images/app_logo.png', width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${dmSans.variable} ${fraunces.variable}`}>
      <body className={dmSans.className}>
        {children}
</body>
    </html>
  );
}