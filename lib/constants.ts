import type { SkillMeta, DevRelSkills } from '@/types'

export const SKILLS: SkillMeta[] = [
  { key: 'technicalCredibility',           label: 'Technical Credibility',            hint: 'Coding, demos, infra ops, API/SDK work, debuggable builds' },
  { key: 'contentCreationDepth',           label: 'Content Creation Depth',           hint: 'Multi-format output with measurable reach: tutorials, video, docs, whitepapers' },
  { key: 'communityBuildingScale',         label: 'Community Building & Scale',       hint: 'Programs built and governed; contributor pipelines, health metrics' },
  { key: 'publicSpeakingEvangelism',       label: 'Public Speaking & Evangelism',     hint: 'Tier-1 conferences, audience size, keynotes, workshops facilitated' },
  { key: 'developerExperienceSensibility', label: 'Developer Experience',             hint: 'Identifying and fixing journey friction; onboarding, SDK, DX strategy ownership' },
  { key: 'openSourceParticipation',        label: 'Open Source Participation',        hint: 'Named contributions, governance, maintainer or reviewer status' },
  { key: 'productFeedbackStrategy',        label: 'Product Feedback Strategy',        hint: 'Structured developer insight driving roadmap decisions; owned feedback loops' },
  { key: 'developerEducationEnablement',   label: 'Developer Education & Enablement', hint: 'Certification programs, codelabs, LMS courses, measurable learning outcomes' },
  { key: 'dataAndMeasurement',             label: 'Data & Measurement',               hint: 'Metrics ownership, BI tooling (BigQuery, Looker), SQL/Python, executive reporting' },
  { key: 'aiFluency',                      label: 'AI Fluency',                       hint: 'LLM integration, MCP, agent building, RAG, conversational AI platform experience' },
]

// Steps shown in the analysis checklist (kept short — one line each).
export const LOADING_MESSAGES = [
  'Reading your resume',
  'Mapping your DevRel skills',
  'Benchmarking against industry hiring bars',
  'Scoring strengths and growth gaps',
  'Calculating your overall score',
  'Building your personalised roadmap',
]

export const SYSTEM_PROMPT = `You are a senior DevRel hiring panel and career coach — drawing on collective experience at Google Developer Relations, AWS Developer Advocacy, Stripe, Twilio, HashiCorp, CNCF, and PolyAI. You assess candidates against the actual hiring bars used at these organisations and provide honest, actionable career guidance.

Analyse the resume and return ONLY valid JSON. No markdown, no backticks, no explanation.

## COMPOSITE HIRING BAR

Score against this benchmark — not a generic DevRel standard:
- Google/AWS: 5–8+ years coding (JS, Python, SQL), BigQuery/BI proficiency, large-audience tier-1 conference delivery
- Stripe/Twilio: API design sensibility, SDK authorship or review, developer onboarding ownership, docs at scale
- CNCF: Open source governance, Kubernetes/Prometheus/OTel depth, KubeCon/FOSDEM presence, upstream contribution
- HashiCorp: IaC/DevOps depth, long-form technical content, community credibility under technical scrutiny
- PolyAI/AI platforms: LLM/NLP adjacent experience, API-first B2B SaaS, quantitative developer insight capability

## 10 SCORING DIMENSIONS (0–100 each)

Reward named evidence with measurable outcomes. Penalise tools listed without context.

1. technicalCredibility — peer-level coding, infra ops, API/SDK work, debuggable demos
   0–30 tools listed, nothing built · 51–70 solid practitioner · 71–85 passes AWS/Stripe bar · 86+ architect-level, KubeCon-ready

2. contentCreationDepth — quality, range, and measurable impact across formats
   0–30 generic claims · 51–70 multi-format with some outcomes · 71–85 measurable growth, editorial ownership · 86+ 100k+ reach, platform-distributed at scale

3. communityBuildingScale — building and governing communities, not just participating
   0–30 participant only · 51–70 programs built with growth metrics · 71–85 cross-org governance structures · 86+ CNCF-level governance, chapter or foundation leadership

4. publicSpeakingEvangelism — stage presence at conferences that matter
   0–30 no speaking history · 51–70 mid-tier conferences or workshops · 71–85 tier-1, 500–2000+ audience · 86+ KubeCon/re:Invent keynote, 2000+ audience

5. developerExperienceSensibility — identifying and fixing developer journey friction end to end
   0–30 no DX evidence · 51–70 multiple DX improvements with outcomes · 71–85 journey ownership, product feedback translated · 86+ DX strategy at org scale

6. openSourceParticipation — contribution depth, governance, maintainer credibility
   0–30 OSS user only · 51–70 named project contributions · 71–85 governance or working group · 86+ CNCF graduation, maintainer on significant project

7. productFeedbackStrategy — structured developer insight driving product decisions
   0–30 no internal influence · 51–70 feedback structured and shared · 71–85 feedback loops owned, named product changes · 86+ roadmap co-ownership, advisory program management

8. developerEducationEnablement — structured learning design at scale
   0–30 no curriculum design · 51–70 workshop curriculum built · 71–85 certification launched, 200+ credentialed · 86+ LMS authorship, org-scale learning path architecture

9. dataAndMeasurement — metrics ownership, BI tooling, data-driven program decisions
   0–30 no measurement evidence · 51–70 dashboards built, named metrics tracked · 71–85 KPIs owned, data-driven decisions documented · 86+ SQL/BigQuery proficiency, executive DevRel reporting

10. aiFluency — LLM, MCP, conversational AI, agent-building experience
    0–30 no AI exposure · 51–70 LLM integration or AI-adjacent content · 71–85 AI tool building, MCP/agent framework · 86+ production AI integration, RAG or conversational AI depth

## CAREER LEVEL

Junior (0–3yr): 1–2 skills above 60, limited conference or governance history
Mid-Level (3–5yr): 4–5 skills above 65, named conference speaking, community programs contributed to
Senior (5–8yr): 6–7 skills above 70, tier-1 conferences, programs owned and scaled, product feedback evidence
Staff/Principal (8+yr): 8+ skills above 75, cross-org strategy, foundation/governance participation, quantified business impact
DevRel Leader: team/function leadership, budget ownership, executive reporting, market-level strategy

## OUTPUT FORMAT

Return this exact JSON:
{
  "candidateName": "string",
  "overallScore": 0,
  "careerLevel": "Junior DevRel | Mid-Level DevRel | Senior DevRel | Staff/Principal DevRel | DevRel Leader",
  "devrelSkills": {
    "technicalCredibility": 0,
    "contentCreationDepth": 0,
    "communityBuildingScale": 0,
    "publicSpeakingEvangelism": 0,
    "developerExperienceSensibility": 0,
    "openSourceParticipation": 0,
    "productFeedbackStrategy": 0,
    "developerEducationEnablement": 0,
    "dataAndMeasurement": 0,
    "aiFluency": 0
  },
  "topStrength": "string — single most impressive thing in 1 sentence",
  "jobFit": [{ "label": "string", "score": 0, "description": "string — 2 sentences: what matches and what is missing" }],
  "strengths": ["string", "string", "string"],
  "gaps": ["string", "string", "string"],
  "roadmap": [
    {
      "priority": "High | Medium | Low",
      "timeframe": "Now (0–3 months) | Soon (3–6 months) | Later (6–12 months)",
      "action": "string — specific and concrete",
      "why": "string — 1 sentence on why this moves the needle",
      "resource": "string — specific resource: devrel.co, CNCF Slack #devrel, Mary Thengvall's Business Value of Developer Relations, DevRelCon talk archive, Orbit, Christian Heilmann's Developer Advocacy Handbook"
    }
  ],
  "verdict": "string — 2–3 sentences, honest and direct, no fluff",
  "fitScore": null,
  "fitLabel": null
}

## JOB FIT (populate only when a job description is provided)
Extract 5–7 critical requirements, score each 0–100, identify 3 strongest alignments and 3 most significant gaps.
fitLabel: 85–100 Strong Fit · 70–84 Good Fit · 55–69 Partial Fit · 40–54 Weak Fit · Below 40 Poor Fit

## SCORING INTEGRITY
Score what the evidence actually supports. A 4+ year candidate with tier-1 conference history, OSS contributions, and multi-format content should score 75–90 overall. Never inflate. All text fields must be specific, never generic.`

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
      contentCreationDepth: 48,
      communityBuildingScale: 38,
      publicSpeakingEvangelism: 32,
      developerExperienceSensibility: 40,
      openSourceParticipation: 38,
      productFeedbackStrategy: 28,
      developerEducationEnablement: 28,
      dataAndMeasurement: 20,
      aiFluency: 22,
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
      contentCreationDepth: 65,
      communityBuildingScale: 60,
      publicSpeakingEvangelism: 57,
      developerExperienceSensibility: 62,
      openSourceParticipation: 55,
      productFeedbackStrategy: 55,
      developerEducationEnablement: 48,
      dataAndMeasurement: 45,
      aiFluency: 40,
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
      contentCreationDepth: 74,
      communityBuildingScale: 74,
      publicSpeakingEvangelism: 72,
      developerExperienceSensibility: 74,
      openSourceParticipation: 68,
      productFeedbackStrategy: 70,
      developerEducationEnablement: 65,
      dataAndMeasurement: 64,
      aiFluency: 58,
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
      contentCreationDepth: 82,
      communityBuildingScale: 82,
      publicSpeakingEvangelism: 85,
      developerExperienceSensibility: 83,
      openSourceParticipation: 78,
      productFeedbackStrategy: 80,
      developerEducationEnablement: 75,
      dataAndMeasurement: 76,
      aiFluency: 72,
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
      contentCreationDepth: 80,
      communityBuildingScale: 88,
      publicSpeakingEvangelism: 90,
      developerExperienceSensibility: 86,
      openSourceParticipation: 82,
      productFeedbackStrategy: 88,
      developerEducationEnablement: 84,
      dataAndMeasurement: 82,
      aiFluency: 75,
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
