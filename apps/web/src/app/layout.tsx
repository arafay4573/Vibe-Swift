import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { ScrollToTop } from '@/components/ScrollToTop';

export const metadata: Metadata = {
  title: 'VIBE SWIFT — Reverse-Engineering & Cloning Studio',
  description: 'AI-driven reverse-engineering and cloning engine integrating morluto/rea. Synthesizes Next.js & Tailwind architecture with The Swifters studio aesthetic.',
  icons: {
    icon: '/swifters-logo-mark.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 antialiased selection:bg-zinc-800 selection:text-white">
        <Header />
        <main className="flex-1 pt-16 sm:pt-20">{children}</main>
        <ScrollToTop />
      </body>
    </html>
  );
}
