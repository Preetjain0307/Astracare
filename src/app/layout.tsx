import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/components/providers/QueryProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'AstraCare AI — Intelligent Women\'s Health Platform',
    template: '%s | AstraCare AI',
  },
  description:
    'AstraCare AI is an AI-powered women\'s health tracking and predictive healthcare system designed to support every stage of your health journey.',
  keywords: ['women\'s health', 'health tracking', 'AI healthcare', 'reproductive health', 'period tracker'],
  authors: [{ name: 'AstraCare AI' }],
  creator: 'AstraCare AI',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    title: 'AstraCare AI — Intelligent Women\'s Health Platform',
    description: 'AI-powered women\'s health tracking and predictive healthcare system.',
    siteName: 'AstraCare AI',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-white text-slate-900">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
