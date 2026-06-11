import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'LuminaFlow — Freelancerlar için Akıllı Nakit Akışı',
    template: '%s | LuminaFlow',
  },
  description:
    'Freelancerlar ve solo girişimciler için akıllı nakit akışı, dinamik vergi rezervi ve finansal runway yönetimi.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'LuminaFlow — Freelancerlar için Akıllı Nakit Akışı',
    description:
      'Freelancerlar ve solo girişimciler için akıllı nakit akışı, dinamik vergi rezervi ve finansal runway yönetimi.',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'LuminaFlow — Freelancerlar için Akıllı Nakit Akışı',
      },
    ],
    type: 'website',
    locale: 'tr_TR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LuminaFlow — Freelancerlar için Akıllı Nakit Akışı',
    description:
      'Freelancerlar ve solo girişimciler için akıllı nakit akışı, dinamik vergi rezervi ve finansal runway yönetimi.',
    images: ['/og-image.svg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
