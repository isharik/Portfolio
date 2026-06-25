import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ui/ThemeProvider'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Sharik Fataing — AI Operations & Technology Professional',
  description:
    'Technology professional operating at the intersection of AI evaluation, cloud systems, customer experience, and emerging technology ecosystems.',
  keywords: ['Sharik Fataing', 'AI Operations', 'LLM Evaluation', 'Customer Support', 'Cloud Administration', 'Pharos Network', 'Web3'],
  authors: [{ name: 'Sharik Fataing' }],
  metadataBase: new URL('https://sharikhussain.dev'),
  openGraph: {
    type: 'website',
    title: 'Sharik Fataing — AI Operations & Technology Professional',
    description: 'Technology professional at the intersection of AI, operations, and emerging technologies.',
    siteName: 'Sharik Fataing',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@isharik99',
    title: 'Sharik Fataing — AI Operations & Technology Professional',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `try{const t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}`
        }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Sharik Fataing',
            jobTitle: 'LLM Evaluator & AI Operations Professional',
            url: 'https://sharikhussain.dev',
            email: 'sharikhussain99@gmail.com',
            sameAs: ['https://linkedin.com/in/sharikhussain1', 'https://twitter.com/isharik99'],
          })
        }} />
      </head>
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
