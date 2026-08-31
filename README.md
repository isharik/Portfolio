# Sharik Fataing — Portfolio

A premium, interactive portfolio built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. Light + dark mode, a CSS grid/aurora/spotlight background, a master–detail experience section, a project album, and a "Book a call" contact flow.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Contact — booking link

The Contact section leads with a **"Book a call"** card. Point it at your scheduler by setting one line in `src/lib/content.ts`:

```ts
export const booking = {
  url: 'https://calendly.com/your-handle/15min', // or a Google Calendar appointment link
  label: 'Book a 15-min intro call',
  detail: 'Pick any open slot — we meet on Google Meet',
}
```

- **Google Calendar (uses your Gmail + auto Google Meet):** Google Calendar → *Create → Appointment schedule* → set your availability → **Share → Copy booking page link** → paste as `booking.url`.
- **Calendly:** create an event type, connect Google Meet as the location, and paste the event link.
- Leave `url` empty and the button falls back to your email. Direct **Email** and **X** routes always show beneath it.

## Editing content

All copy lives in one file — **`src/lib/content.ts`**. Update `profile`, `experiences`, `projects`, `skillGroups`, `credentials`, etc. and every section updates automatically. No JSX editing required.

## Profile photo

Replace `public/profile.jpg` with your photo (keep the filename), or change `profile.photo` in `src/lib/content.ts`. It's loaded responsively via `next/image`.

## Resume button (optional)

Drop a `resume.pdf` into `public/` and set `profile.resume = '/resume.pdf'` in `content.ts` to reveal the Resume button in the hero.

## Deploy to Vercel

```bash
git add .
git commit -m "Portfolio redesign"
git push
```

Import the repo at [vercel.com](https://vercel.com) and deploy. No environment variables required.

## Structure

```
src/
├── app/
│   ├── globals.css          ← design tokens, glass, grid/aurora bg, reveals, motion
│   ├── layout.tsx           ← fonts, SEO metadata, JSON-LD, theme script
│   ├── page.tsx             ← assembles the page
│   └── sitemap.ts / robots.ts
├── components/
│   ├── layout/    Navbar, Footer
│   ├── sections/  Hero, About, Experience (master–detail), Projects, Skills, Contact
│   ├── three/     Background (CSS grid + cursor spotlight + aurora)
│   └── ui/        GlassCard, SectionHeading, MagneticButton, ThemeToggle,
│                  Reveal, ScrollProgress, ThemeProvider
└── lib/           content.ts (all data), utils.ts
```

## Notes

- **Background**: CSS-only grid + two drifting aurora blobs + a cursor-following spotlight. No WebGL, no render loop. The spotlight is disabled on touch devices and under `prefers-reduced-motion`.
- **Accessibility**: semantic HTML, visible focus rings, keyboard-navigable experience rail, ARIA labels on icon buttons, reduced-motion support.
