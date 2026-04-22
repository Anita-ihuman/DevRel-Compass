import type { SkillMeta, DevRelSkills } from '@/types'

export const SKILLS: SkillMeta[] = [
  { key: 'technicalCredibility',         label: 'Technical Credibility',            hint: 'Coding, demos, infra, OSS contributions, technical certs' },
  { key: 'contentCreation',              label: 'Content Creation',                 hint: 'Blog posts, docs, video, newsletters, API guides' },
  { key: 'communityBuilding',            label: 'Community Building',               hint: 'Programs built, platform engagement, health metrics' },
  { key: 'publicSpeakingEvangelism',     label: 'Public Speaking & Evangelism',     hint: 'Conference talks, workshops, keynotes, meetups' },
  { key: 'developerExperience',          label: 'Developer Experience',             hint: 'DX audits, onboarding, SDK/tooling contributions' },
  { key: 'openSourceParticipation',      label: 'Open Source Participation',        hint: 'OSS contributions, governance, maintainer roles' },
  { key: 'productFeedbackLoop',          label: 'Product Feedback Loop',            hint: 'Developer insights, survey programs, roadmap influence' },
  { key: 'developerEducationEnablement', label: 'Developer Education & Enablement', hint: 'Courses, certifications, workshop curricula, LMS' },
]

export const LOADING_MESSAGES = [
  'Reading your resume...',
  'Mapping your DevRel skills...',
  'Analyzing job fit...',
  'Calculating your score...',
  'Building your roadmap...',
]

export const SYSTEM_PROMPT = `You are a world-class DevRel career coach and hiring expert with deep knowledge of global Developer Relations expectations. You assess candidates against the standards used by leading DevRel teams at companies like Google, AWS, Stripe, Twilio, HashiCorp, and CNCF member organizations.

Analyze the provided resume and return ONLY a valid JSON object. No markdown, no backticks, no explanation — just raw JSON.

Return this exact structure:
{
  "candidateName": "string",
  "overallScore": 0,
  "careerLevel": "Junior DevRel | Mid-Level DevRel | Senior DevRel | Staff/Principal DevRel | DevRel Leader",
  "devrelSkills": {
    "technicalCredibility": 0,
    "contentCreation": 0,
    "communityBuilding": 0,
    "publicSpeakingEvangelism": 0,
    "developerExperience": 0,
    "openSourceParticipation": 0,
    "productFeedbackLoop": 0,
    "developerEducationEnablement": 0
  },
  "topStrength": "string — the single most impressive thing about this candidate in 1 sentence",
  "jobFit": [
    {
      "label": "string — name of the requirement area",
      "score": 0,
      "description": "string — 2 sentences: what matches and what is missing"
    }
  ],
  "strengths": ["string", "string", "string"],
  "gaps": ["string", "string", "string"],
  "roadmap": [
    {
      "priority": "High | Medium | Low",
      "timeframe": "0–3 months | 3–6 months | 6–12 months",
      "action": "string — specific, concrete action",
      "why": "string — 1 sentence on why this moves the needle",
      "resource": "string — a specific resource, community, or platform to use (e.g. DevRelCon, CNCF Slack, devrel.co, Mary Thengvall book)"
    }
  ],
  "verdict": "string — 2–3 sentences, honest and direct, no fluff",
  "fitScore": null,
  "fitLabel": null
}

Scoring calibration:
- 0–30: Little to no evidence of this skill
- 31–50: Early-stage or indirect evidence
- 51–70: Solid working evidence with some gaps
- 71–85: Strong, consistent evidence across multiple roles
- 86–100: Exceptional, industry-leading evidence

A candidate with 4+ years of DevRel experience, conference speaking history, open source community leadership, and multi-format content production should score 75–90 overall. Do not be artificially modest — score what the evidence actually supports. Be specific, not generic, in all text fields.`

// ─── Career Roadmap Data ──────────────────────────────────────────────────────

export interface CareerStage {
  id: string
  level: string
  years: string
  tagline: string
  description: string
  color: string
  skills: Partial<DevRelSkills>
  milestones: string[]
  activities: string[]
  companies: string
}

export const CAREER_STAGES: CareerStage[] = [
  {
    id: 'junior',
    level: 'Junior DevRel',
    years: '0–2 years',
    tagline: 'Learning the craft, finding your voice',
    description:
      'You are building the fundamentals. Your job is to learn how developers think, ship your first content, participate in community, and speak on a small stage. You execute on programs others designed while developing your own instincts.',
    color: '#2dd4bf',
    skills: {
      technicalCredibility: 52,
      contentCreation: 48,
      communityBuilding: 38,
      publicSpeakingEvangelism: 32,
      developerExperience: 40,
      openSourceParticipation: 38,
      productFeedbackLoop: 28,
      developerEducationEnablement: 28,
    },
    milestones: [
      'Publish your first technical tutorial or blog post',
      'Give your first talk at a meetup or small conference',
      'Contribute to or help moderate a community channel',
      'Complete a meaningful open source contribution',
    ],
    activities: [
      'Writing getting-started guides and code samples',
      'Attending and helping at developer events',
      'Responding to community questions on Discord/Slack/GitHub',
      'Shadowing senior DevRel on demo builds and talks',
    ],
    companies: 'Startups, scale-ups with small DevRel teams',
  },
  {
    id: 'mid',
    level: 'Mid-Level DevRel',
    years: '2–4 years',
    tagline: 'Owning programs, measuring impact',
    description:
      'You now own full programs rather than tasks. You have a conference speaking history, published content that drives real traffic, and measurable community metrics you can speak to. You are beginning to feed insights back to the product team.',
    color: '#8b5cf6',
    skills: {
      technicalCredibility: 65,
      contentCreation: 65,
      communityBuilding: 60,
      publicSpeakingEvangelism: 57,
      developerExperience: 62,
      openSourceParticipation: 55,
      productFeedbackLoop: 55,
      developerEducationEnablement: 48,
    },
    milestones: [
      'Accepted to and delivered a talk at a major conference (KubeCon, DevRelCon, etc.)',
      'Grew or managed a developer community with trackable health metrics',
      'Shipped a DX improvement that reached engineering or product',
      'Built a content series with measurable reach or engagement',
    ],
    activities: [
      'Owning an event presence end-to-end',
      'Managing community health dashboards and onboarding pipelines',
      'Running developer surveys and synthesizing findings for product',
      'Writing and maintaining SDK documentation or tutorials',
    ],
    companies: 'Growth-stage startups, mid-size tech, cloud vendors',
  },
  {
    id: 'senior',
    level: 'Senior DevRel',
    years: '4–7 years',
    tagline: 'Strategy, influence, measurable business outcomes',
    description:
      'You connect DevRel work to business metrics. You mentor others, define program strategy, and have a track record of community or product outcomes you drove. Cross-functional partners — product, marketing, engineering — come to you. You are known in the industry.',
    color: '#f59e0b',
    skills: {
      technicalCredibility: 76,
      contentCreation: 74,
      communityBuilding: 74,
      publicSpeakingEvangelism: 72,
      developerExperience: 74,
      openSourceParticipation: 68,
      productFeedbackLoop: 70,
      developerEducationEnablement: 65,
    },
    milestones: [
      'Demonstrated measurable business impact from a DevRel program',
      'Mentored junior or mid-level DevRel practitioners',
      'Influenced product roadmap decisions through developer insight',
      'Known speaker or contributor in a technical community',
    ],
    activities: [
      'Defining DevRel program strategy and OKRs',
      'Running developer advisory boards or feedback councils',
      'Leading cross-functional DevRel initiatives with product and engineering',
      'Speaking at tier-1 conferences and building industry relationships',
    ],
    companies: 'Enterprise tech, major cloud providers, developer tools unicorns',
  },
  {
    id: 'staff',
    level: 'Staff / Principal DevRel',
    years: '7–10 years',
    tagline: 'Industry voice, company-defining programs',
    description:
      'You operate at the intersection of DevRel and product strategy. Your work shapes how developers across the industry perceive a platform. You define frameworks others adopt, publish research, and carry industry-level influence. You may manage people or function as an individual contributor at the highest impact.',
    color: '#22c55e',
    skills: {
      technicalCredibility: 84,
      contentCreation: 82,
      communityBuilding: 82,
      publicSpeakingEvangelism: 85,
      developerExperience: 83,
      openSourceParticipation: 78,
      productFeedbackLoop: 80,
      developerEducationEnablement: 75,
    },
    milestones: [
      'Delivered a keynote or mainstage talk at a flagship industry event',
      'Published research, a framework, or a report the community references',
      'Built a program that is considered a benchmark in the industry',
      'Defined DevRel strategy at the organizational or platform level',
    ],
    activities: [
      'Representing the company at the highest-profile industry events',
      'Defining and publishing DevRel measurement frameworks',
      'Advising product teams on developer ecosystem strategy',
      'Writing thought leadership that shapes the broader DevRel conversation',
    ],
    companies: 'FAANG, top-tier developer platforms, open source foundations',
  },
  {
    id: 'leader',
    level: 'DevRel Leader',
    years: '10+ years',
    tagline: 'Building teams, setting org-level direction',
    description:
      'You build and lead DevRel functions. You define the mission, hire the team, set the strategy, and operate at executive level. You translate developer ecosystem health into business language. The DevRel programs you build outlast your tenure and define how the industry thinks about the function.',
    color: '#ef4444',
    skills: {
      technicalCredibility: 82,
      contentCreation: 80,
      communityBuilding: 88,
      publicSpeakingEvangelism: 90,
      developerExperience: 86,
      openSourceParticipation: 82,
      productFeedbackLoop: 88,
      developerEducationEnablement: 84,
    },
    milestones: [
      'Built, hired, and scaled a DevRel team from scratch or at inflection',
      'Defined and owned the developer strategy for an organization',
      'Secured exec-level buy-in and budget for a developer program',
      'Grown a developer ecosystem measurably over multiple years',
    ],
    activities: [
      'Hiring, mentoring, and developing DevRel talent',
      'Operating as the executive voice for developer community',
      'Building partnerships with foundations, platforms, and communities',
      'Reporting developer ecosystem health to C-suite and board',
    ],
    companies: 'Director+ at major platforms, VP/Head of DevRel, founding DevRel at unicorns',
  },
]

export interface EntryPath {
  from: string
  icon: string
  description: string
  bridgeSkills: string[]
  timeline: string
}

export const ENTRY_PATHS: EntryPath[] = [
  {
    from: 'Software Engineering',
    icon: '⚙',
    description:
      'The most common entry path. Engineers bring technical credibility and can speak peer-to-peer with developers. Gaps are usually in content creation, public speaking, and community strategy.',
    bridgeSkills: ['Technical writing', 'Public speaking basics', 'Community listening'],
    timeline: '6–12 months to full transition',
  },
  {
    from: 'Developer Marketing',
    icon: '📣',
    description:
      'Marketers who work closely with developer audiences often shift into DevRel. Strengths in content and campaigns; gaps in technical depth and community authenticity.',
    bridgeSkills: ['Build a real project', 'Earn a technical credential', 'Contribute to open source'],
    timeline: '6–18 months to build technical credibility',
  },
  {
    from: 'Technical Writing',
    icon: '✍',
    description:
      'Tech writers have strong documentation fundamentals and understand developer journeys. The shift is about expanding from docs into community, events, and evangelism.',
    bridgeSkills: ['Conference speaking', 'Community program ownership', 'Demo building'],
    timeline: '3–9 months with intentional exposure',
  },
  {
    from: 'Community Management',
    icon: '🌐',
    description:
      'Community managers who work in developer spaces can bridge into DevRel naturally. Technical depth and content creation are the most common gaps to close.',
    bridgeSkills: ['Learn a programming language or framework', 'Publish technical content', 'Build a side project'],
    timeline: '9–18 months for technical foundation',
  },
  {
    from: 'Developer Support / Solutions',
    icon: '🛠',
    description:
      'Support engineers and solutions architects understand developer pain deeply. Transitioning into DevRel is often a matter of shifting from 1:1 to 1:many — from solving to educating.',
    bridgeSkills: ['Content creation at scale', 'Stage presence', 'Community program design'],
    timeline: '3–12 months depending on experience',
  },
]
