import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono, Pixelify_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { SoundProvider } from '@/components/ui/SoundProvider'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-sans' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], display: 'swap', variable: '--font-display' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-mono' })
const pixelify = Pixelify_Sans({ subsets: ['latin'], display: 'swap', weight: ['400', '500'], variable: '--font-pixel' })

const SITE = 'https://sharikhussain.dev'
const TITLE = 'Sharik'
const DESCRIPTION =
  'Computer-science graduate working where technology meets people — LLM evaluation, cloud administration, customer operations, and Web3 ecosystems. Pharos Network storyteller.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'Sharik',
    'LLM Evaluation',
    'AI Operations',
    'AI Quality Assurance',
    'Cloud Administration',
    'Customer Support',
    'Pharos Network',
    'Web3',
  ],
  authors: [{ name: 'Sharik' }],
  creator: 'Sharik',
  alternates: { canonical: SITE },
  openGraph: {
    type: 'website',
    url: SITE,
    siteName: 'Sharik',
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@isharik99',
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f7f8' },
    { media: '(prefers-color-scheme: dark)', color: '#08080a' },
  ],
  width: 'device-width',
  initialScale: 1,
}

const themeScript = `document.documentElement.classList.add('js');try{var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.classList.toggle('dark',t==='dark')}catch(e){document.documentElement.classList.add('dark')}`

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Sharik',
  jobTitle: 'LLM Evaluator & AI Operations Professional',
  url: SITE,
  email: 'sharikhussain99@gmail.com',
  address: { '@type': 'PostalAddress', addressRegion: 'Jammu & Kashmir', addressCountry: 'IN' },
  sameAs: ['https://github.com/isharik', 'https://linkedin.com/in/sharikhussain1', 'https://twitter.com/isharik99'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable} ${pixelify.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <ThemeProvider>
          <SoundProvider>{children}</SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
