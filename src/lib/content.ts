/**
 * Single source of truth for portfolio content.
 * Edit here to update the site — components read from these exports.
 */

export const profile = {
  name: 'Sharik Fataing',
  initials: 'SF',
  role: 'LLM Evaluator & AI Operations',
  location: 'Jammu & Kashmir, India',
  availability: 'Open to remote roles',
  email: 'sharikhussain99@gmail.com',
  phone: '+91 60056 22259',
  photo: '/profile.jpg',
  resume: '/resume.pdf', // served from public/; used by Contact + Projects download links
  eyebrow: 'CUSTOMER SUPPORT · CX · AI EVALUATION',
  // Headline is split so the accent word can be styled separately
  headlineLead: 'The human in',
  headlineAccent: "AI’s loop.",
  summary:
    "I work at the human edge of technology, in customer support and experience, and I test how well AI actually answers. Live ticket or model output, the goal stays the same: make the tech work for real people. These days I also write and create content for the Pharos Network.",
  intro:
    'Currently a QA Specialist and LLM Evaluator at Invisible Technologies and an AI & Robotics Trainer at Micro1, with 3+ years across cloud administration, customer operations, and Web3 ecosystems. Selected as a Storyteller for Pharos Network.',
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
    role: 'LLM Evaluator / QA Specialist',
    company: 'Invisible Technologies',
    companyDesc: 'AI operations & human-in-the-loop services',
    period: 'Jul 2025 — Present',
    type: 'Full-time · Remote',
    current: true,
    description:
      'Evaluate large language model outputs against accuracy, coherence, and task-fitness criteria within structured QA workflows that feed model-improvement pipelines.',
    highlights: [
      'Assess AI outputs across reasoning, coding, and language tasks',
      'Apply structured annotation frameworks to surface systematic weaknesses and edge cases',
      'Deliver calibrated feedback that contributes to fine-tuning and RLHF pipelines',
      'Maintain rigour across high-volume evaluation in an async remote environment',
    ],
    tags: ['LLM Evaluation', 'AI QA', 'Annotation', 'RLHF', 'Structured Feedback'],
  },
  {
    role: 'AI & Robotics Trainer',
    company: 'Micro1',
    companyDesc: 'AI training & talent platform',
    period: 'May 2025 — Present',
    type: 'Full-time · Remote',
    current: true,
    description:
      'Train and evaluate AI systems through structured data annotation, reinforcement-learning workflows, and robotics-focused tasks, applying system-administration knowledge to the training environment.',
    highlights: [
      'Perform data annotation and quality evaluation for AI training datasets',
      'Contribute structured feedback to RLHF workflows',
      'Work on robotics-focused training and evaluation tasks',
      'Use Python for data processing and technical workflows',
    ],
    tags: ['RLHF', 'Data Annotation', 'Robotics', 'Python', 'Certified SysAdmin'],
  },
  {
    role: 'Customer Support Specialist',
    company: 'Datamark',
    companyDesc: 'BPO & customer experience — interpretation services',
    period: 'Mar 2025 — May 2025',
    type: 'Full-time · Remote',
    current: false,
    description:
      'Delivered real-time customer communication and interpretation support in high-stakes environments where precision and speed were equally critical.',
    highlights: [
      'Resolved complex queries in live, time-sensitive support flows',
      'Upheld strict confidentiality protocols across sensitive contexts',
      'Maintained quality across high-volume, fast-paced support',
      'Operated across channels using Zendesk and internal CRM tooling',
    ],
    tags: ['Customer Support', 'Real-time Comms', 'Zendesk', 'CRM'],
  },
  {
    role: 'System Administrator',
    company: 'KodeKloud',
    companyDesc: 'DevOps & cloud engineering training platform',
    period: 'Jan 2024 — Dec 2024',
    type: 'Full-time · Remote',
    current: false,
    description:
      'Managed cloud infrastructure and operational systems for a full year — investigating incidents, reporting on performance, and supporting a distributed, remote-first platform.',
    highlights: [
      'Administered AWS-based infrastructure supporting platform and learner environments',
      'Investigated and resolved technical incidents, minimising downtime',
      'Produced operational reporting and performance analysis',
      'Worked across Slack, Office 365, and Hubstaff in a distributed team',
    ],
    tags: ['AWS', 'Cloud Admin', 'Incident Response', 'Systems Ops'],
  },
  {
    role: 'Technology Consultant Intern',
    company: 'Deloitte',
    companyDesc: 'Global professional services & consulting',
    period: 'May 2020 — Sep 2020',
    type: 'Internship · Remote',
    current: false,
    description:
      'Contributed to cloud-readiness assessments and business-analysis activities for enterprise client engagements, supporting planning and solution documentation.',
    highlights: [
      'Supported cloud-readiness and gap analysis for enterprise clients',
      'Contributed to solution documentation and planning deliverables',
      'Gained early exposure to enterprise consulting and cross-functional teams',
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
  accent: string // gradient stops for the project visual
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
    label: 'Cloud & Systems',
    skills: [
      'AWS Cloud Administration',
      'System Administration',
      'Incident Response',
      'Operational Reporting',
      'Technical Troubleshooting',
      'Infrastructure Monitoring',
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
    title: 'B.Sc. Computer Science',
    org: 'MIET · Jammu & Kashmir',
    period: '2019 — 2023',
    note: 'GPA 3.1 / 4.0',
  },
  {
    title: 'Certified System Administrator',
    org: 'Micro1',
    period: '2025',
    note: 'System administration',
  },
  {
    title: 'Pharos Network Storyteller',
    org: 'Pharos Network',
    period: '2025 — Present',
    note: 'Selected ecosystem contributor',
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
