import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HeyGen - Home',
  description: 'HeyGen AI Video Platform — Avatars, Voices, Video Translation & AI Studio',
  icons: {
    icon: '/heygen-assets/logos/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className="antialiased bg-white text-[#232833]">{children}</body>
    </html>
  );
}
