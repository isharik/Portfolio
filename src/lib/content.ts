/**
 * Single source of truth for portfolio content.
 * Edit here to update the site — components read from these exports.
 */

export const profile = {
  name: 'Sharik',
  initials: 'S',
  role: 'LLM Evaluator & AI Operations',
  location: 'India',
  availability: 'Open to remote roles',
  email: 'sharikhussain99@gmail.com',
  phone: '+91 60056 22259',
  resume: '/resume.pdf', // served from public/; used by Contact + Projects download links
  eyebrow: 'CUSTOMER SUPPORT · CONTENT · AI',
  // Headline is split so the accent word can be styled separately
  headlineLead: 'The human in',
  headlineAccent: "AI’s loop.",
  summary:
    "I work across customer support, content, and AI—helping people, communities, and products communicate clearly. From resolving real-time customer issues to creating content for emerging ecosystems and supporting AI workflows, I make complex technology easier to understand and use.",
  intro:
    'Currently an AI & QA Specialist at Invisible Technologies and an AI & Robotics Trainer at Micro1, I bring 3+ years of experience across cloud operations, customer experience, and Web3. I was also selected as a Content Creator and Storyteller for Pharos Network.',
} as const

export const booking = {
  // Calendly scheduling link. Empty string => the button falls back to email.
  url: 'https://calendly.com/sharikhussain99/30min',
  label: 'Book a 30-min call',
  detail: 'Pick any open slot — we meet on Google Meet',
} as const

export const socials = {
  github: 'https://github.com/isharik',
  linkedin: 'https://linkedin.com/in/sharikhussain1',
  twitter: 'https://twitter.com/isharik99',
  twitterHandle: '@isharik99',
  email: 'sharikhussain99@gmail.com',
} as const

export const stats = [
  { value: '4+', label: 'Years in tech & AI' },
  { value: '3+', label: 'Years in Web3' },
  { value: '5', label: 'Company roles' },
  { value: '4', label: 'Languages' },
] as const

export const focusAreas = [
  'LLM Evaluation',
  'AI Quality Assurance',
  'Cloud & Systems',
  'Customer Operations',
  'Web3 Ecosystems',
  'Content & Storytelling',
] as const

export type Experience = {
  role: string
  company: string
  logo: string
  companyDesc: string
  period: string
  type: string
  current: boolean
  description: string
  highlights: string[]
  tags: string[]
}

export const experiences: Experience[] = [
  {
    role: 'AI & QA Specialist',
    company: 'Invisible Technologies',
    logo: '/logos/invisible.png',
    companyDesc: 'AI operations & human-in-the-loop services',
    period: 'Jul 2025 — Present',
    type: 'Full-time · Remote',
    current: true,
    description:
      'I evaluate large language model responses across reasoning, coding, and language tasks. I use structured QA criteria to catch inaccuracies, weak reasoning, and edge cases, then provide calibrated feedback that supports model improvement.',
    highlights: [
      'I assess responses for factual accuracy, coherence, instruction-following, and task fit',
      'I review reasoning, code, and language outputs to surface errors and edge cases',
      'I apply structured annotation and calibrated feedback in model-improvement workflows',
      'I maintain consistent quality across high-volume, asynchronous evaluation work',
    ],
    tags: ['LLM Evaluation', 'AI QA', 'Annotation', 'RLHF', 'Structured Feedback'],
  },
  {
    role: 'AI & Robotics Trainer',
    company: 'Micro1',
    logo: '/logos/micro1.png',
    companyDesc: 'AI training & talent platform',
    period: 'May 2025 — Present',
    type: 'Full-time · Remote',
    current: true,
    description:
      'I contribute to AI training and evaluation through structured annotation, RLHF workflows, and robotics-focused tasks. I pair careful quality review with Python-supported data handling to keep each assignment accurate and consistent.',
    highlights: [
      'I annotate training data and assess outputs against task-specific quality criteria',
      'I provide structured feedback for reinforcement-learning and human-feedback workflows',
      'I complete robotics-focused training and evaluation tasks with close attention to detail',
      'I use Python for data processing and supporting technical workflows',
    ],
    tags: ['RLHF', 'Data Annotation', 'Robotics', 'Python', 'Certified SysAdmin'],
  },
  {
    role: 'Mathematics & STEM AI Trainer',
    company: 'Outlier',
    logo: '/logos/outlier.svg',
    companyDesc: 'AI training & expert evaluation platform',
    period: 'Dec 2024 — Present',
    type: 'Part-time · Remote',
    current: true,
    description:
      'I evaluate and improve AI-generated solutions across mathematics, STEM, computer science, and logical reasoning. I create and validate technical tasks, then identify the mistakes and reasoning gaps that affect answer quality.',
    highlights: [
      'I evaluate model solutions across mathematics, STEM, computer science, and logic',
      'I create, solve, and validate technical prompts and responses for correctness',
      'I identify calculation errors, invalid reasoning, and inconsistencies in generated answers',
      'I apply Python and Java to coding and computational-reasoning tasks',
    ],
    tags: ['Mathematics', 'STEM', 'AI Training', 'Python', 'Java'],
  },
  {
    role: 'Python Expert & Mathematics QA Lead',
    company: 'SuperAnnotate',
    logo: '/logos/superannotate.svg',
    companyDesc: 'AI data annotation & quality platform',
    period: 'Aug 2026 — Present',
    type: 'Part-time · Remote',
    current: true,
    description:
      'I lead QA reviews of Python and mathematics responses for correctness, reasoning quality, and task fit. I use structured criteria to catch errors and gaps, then provide calibrated feedback that supports stronger AI responses.',
    highlights: [
      'I assess Python solutions for correctness, clarity, and task requirements',
      'I review mathematical reasoning to catch calculation errors and missed assumptions',
      'I evaluate technical responses for completeness, consistency, and quality',
      'I provide structured feedback for model evaluation and response improvement',
    ],
    tags: ['Python', 'Mathematics QA', 'Code Review', 'AI Evaluation', 'Quality Assurance'],
  },
  {
    role: 'Customer Support Specialist',
    company: 'Datamark',
    logo: '/logos/datamark.jpg',
    companyDesc: 'BPO & customer experience — interpretation services',
    period: 'Mar 2025 — May 2026',
    type: 'Full-time · Remote',
    current: false,
    description:
      'I supported customers through real-time communication and interpretation in sensitive, time-critical situations. I combined clear explanations and accurate issue handling with careful confidentiality practices.',
    highlights: [
      'I resolved customer queries in live, time-sensitive support conversations',
      'I communicated information clearly while following confidentiality protocols',
      'I maintained service quality in high-volume, fast-paced support work',
      'I managed conversations through Zendesk and internal CRM tools',
    ],
    tags: ['Customer Support', 'Real-time Comms', 'Zendesk', 'CRM'],
  },
  {
    role: 'System Administrator',
    company: 'KodeKloud',
    logo: '/logos/kodekloud.png',
    companyDesc: 'DevOps & cloud engineering training platform',
    period: 'Jan 2024 — Dec 2024',
    type: 'Full-time · Remote',
    current: false,
    description:
      'I supported cloud infrastructure and daily systems operations in a remote environment. My work covered AWS-based platform and learner environments, incident investigation, and operational reporting.',
    highlights: [
      'I administered AWS-based infrastructure for platform and learner environments',
      'I investigated technical incidents and worked to minimise service disruption',
      'I prepared operational reports and performance analysis',
      'I coordinated work across Slack, Office 365, and Hubstaff',
    ],
    tags: ['AWS', 'Cloud Admin', 'Incident Response', 'Systems Ops'],
  },
  {
    role: 'Technology Consultant Intern',
    company: 'Deloitte',
    logo: '/logos/deloitte.ico',
    companyDesc: 'Global professional services & consulting',
    period: 'May 2020 — Sep 2020',
    type: 'Internship · Remote',
    current: false,
    description:
      'I contributed to cloud-readiness assessments and business analysis for enterprise client engagements. I supported planning and solution documentation while collaborating with cross-functional consulting teams.',
    highlights: [
      'I supported cloud-readiness reviews and gap analysis for enterprise clients',
      'I prepared solution documentation and planning deliverables',
      'I collaborated with cross-functional teams in an enterprise consulting environment',
    ],
    tags: ['Cloud Readiness', 'Business Analysis', 'Consulting'],
  },
]

export type Project = {
  title: string
  tagline: string
  description: string
  tags: string[]
  link: string | null
  repo: string | null
  status: 'Live' | 'Ongoing' | 'Internal'
  accent: string // gradient stops — used as a fallback / tint behind the thumbnail
  image: string | null // local /projects/* thumbnail
  imageFit?: 'cover' | 'contain'
}

export const projects: Project[] = [
  {
    title: 'Proxima',
    tagline: 'Agent marketplace on BNB',
    description:
      'The front door for autonomous agents on BNB Smart Chain. Find an agent by what it actually does, check its real on-chain record, and hire it inside a spend cap you can pull back any time.',
    tags: ['BNB Smart Chain', 'ERC-8004', 'Next.js', 'Web3'],
    link: 'https://proxima-byecho.vercel.app/',
    repo: null,
    status: 'Live',
    accent: '#f5b301, #dd7d0a',
    image: '/projects/proxima.png',
    imageFit: 'contain',
  },
  {
    title: 'Pharos Octobot',
    tagline: 'AI financial copilot',
    description:
      'An AI financial copilot for the Pharos ecosystem — surfacing on-chain context and guidance through a conversational interface.',
    tags: ['Python', 'Streamlit', 'AI', 'Web3', 'Pharos'],
    link: 'https://pharos-octobot-by-echo.streamlit.app/',
    repo: null,
    status: 'Live',
    accent: '#6d5bd6, #b15bd6',
    image: '/projects/octobot-v2.png',
    imageFit: 'contain',
  },
  {
    title: 'Pulse OS',
    tagline: 'AI business operating system',
    description:
      'An AI-powered business operating system that brings everything a company needs into one unified workspace.',
    tags: ['Next.js 15', 'TypeScript', 'Tailwind', 'Framer Motion', 'AI'],
    link: 'https://pulse-os-one.vercel.app/',
    repo: null,
    status: 'Live',
    accent: '#5b8bd6, #5bd6c9',
    image: '/projects/pulseos.png',
    imageFit: 'contain',
  },
  {
    title: 'Prosper Atlas',
    tagline: 'Performance market for liquid alpha',
    description:
      'A 3D interactive site mapping the Prosper ecosystem on Pharos — curators, vaults, and performance markets for liquid alpha.',
    tags: ['Next.js', 'R3F', 'WebGL', 'Web3'],
    link: 'https://prosper-atlas-echoplex.vercel.app/',
    repo: null,
    status: 'Live',
    accent: '#d69b5b, #d6675b',
    image: '/projects/prosper.png',
    imageFit: 'contain',
  },
  {
    title: 'Web3 Content Library',
    tagline: 'Ecosystem education',
    description:
      'A growing body of educational threads and community posts covering L1 networks, DeFi, and Web3 onboarding — published as @isharik99.',
    tags: ['Content', 'Web3', 'Community', 'Education'],
    link: 'https://twitter.com/isharik99',
    repo: null,
    status: 'Ongoing',
    accent: '#5bd67e, #5bc9d6',
    image: null,
  },
  {
    title: 'AI Evaluation Playbooks',
    tagline: 'QA frameworks & rubrics',
    description:
      'Structured annotation guides, quality rubrics, and feedback templates developed during LLM evaluation work to bring consistency and calibration to output assessment.',
    tags: ['LLM Eval', 'Documentation', 'AI Ops', 'QA'],
    link: null,
    repo: null,
    status: 'Internal',
    accent: '#8a8a94, #b6b6c0',
    image: null,
  },
]

export type SkillGroup = { label: string; skills: string[] }

export const skillGroups: SkillGroup[] = [
  {
    label: 'AI & LLM Operations',
    skills: [
      'LLM Output Evaluation',
      'Annotation & Labeling',
      'AI Quality Assurance',
      'Structured Feedback',
      'RLHF Workflow Support',
      'Model Behaviour Analysis',
    ],
  },
  {
    label: 'Coding & Development',
    skills: [
      'Python',
      'JavaScript',
      'TypeScript',
      'HTML & CSS',
      'React & Next.js',
      'Web Development',
    ],
  },
  {
    label: 'Customer Success',
    skills: [
      'Real-time Support',
      'Ticket Resolution',
      'Customer Communication',
      'Confidentiality Protocols',
      'Interpretation Services',
      'CRM Management',
    ],
  },
  {
    label: 'Tools & Platforms',
    skills: ['Zendesk', 'Intercom', 'Slack', 'Hubstaff', 'Office 365', 'Google Workspace', 'Zapier', 'Albato'],
  },
  {
    label: 'Community & Content',
    skills: [
      'Ecosystem Storytelling',
      'Community Building',
      'Educational Content',
      'Web3 Ecosystems',
      'Threads & Campaigns',
      'Onboarding Material',
    ],
  },
  {
    label: 'Automation & Process',
    skills: ['Zapier Workflows', 'Albato Integrations', 'Process Documentation', 'Workflow Optimisation', 'Operational SOPs'],
  },
]

export const languages = [
  { lang: 'English', level: 'Native' },
  { lang: 'Hindi', level: 'Native' },
  { lang: 'Urdu', level: 'Native' },
  { lang: 'Kashmiri', level: 'Conversational' },
] as const

export const credentials = [
  {
    title: 'B.E. Computer Science',
    org: 'MIET · India',
    logo: '/logos/miet.png',
    period: '2019 — 2023',
    note: 'GPA 3.1 / 4.0',
    href: null,
  },
  {
    title: 'Certified System Administrator',
    org: 'Micro1',
    logo: '/logos/micro1-mark.svg',
    period: '2025',
    note: 'System administration',
    href: 'https://micro1-portal-data.s3.amazonaws.com/engineer-certificates/1759308472-4893f61f-5c08-4178-8451-d4131afc3683.jpg',
  },
  {
    title: 'Pharos Network Storyteller',
    org: 'Pharos Network',
    logo: '/logos/pharos-network.png',
    period: '2025 — Present',
    note: 'Selected ecosystem contributor',
    href: 'https://twitter.com/isharik99',
  },
] as const

export const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
] as const
