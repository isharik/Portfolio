# Sharik Fataing — Personal Portfolio

Premium portfolio built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion.

## ⚡ Quick Start in VS Code

```bash
npm install
npm run dev
```
Open http://localhost:3000

## 📸 Adding Your Profile Photo

1. Save your LinkedIn profile photo as `profile.jpg`
2. Place it inside the `public/` folder
3. The site will automatically display it — if no photo is found, it shows your initials as a fallback

## 🚀 Deploy to Vercel

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

2. Go to vercel.com → Add New Project → Import repo → Deploy

## 📁 File Structure

```
src/
├── app/
│   ├── globals.css       ← colors, animations, scroll
│   ├── layout.tsx        ← SEO metadata
│   └── page.tsx          ← assembles all sections
└── components/
    ├── ui/
    │   ├── Navbar.tsx        ← sticky nav, smooth scroll
    │   ├── ThemeProvider.tsx ← dark/light mode
    │   ├── FadeIn.tsx        ← scroll-triggered fade animation
    │   └── Stagger.tsx       ← staggered list animations
    └── sections/
        ├── Hero.tsx          ← headline, photo, stats
        ├── About.tsx         ← bio, education, languages
        ├── Experience.tsx    ← 4 roles with full detail
        ├── Highlights.tsx    ← curated achievements
        ├── Skills.tsx        ← grouped skill tags
        ├── Projects.tsx      ← Octobot + content work
        ├── Contact.tsx       ← all contact methods
        └── Footer.tsx
```
