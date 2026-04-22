export interface RoadmapTopic {
  title: string
  desc: string
  optional?: boolean
}

export interface RoadmapGroup {
  id: string
  title: string
  icon: string
  optional?: boolean
  topics: RoadmapTopic[]
}

export interface RoadmapPhase {
  id: string
  phase: string
  title: string
  color: string
  description: string
  layout?: 'single' | 'grid'
  groups: RoadmapGroup[]
}

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    id: 'foundation',
    phase: '01',
    title: 'Foundation',
    color: '#8b5cf6',
    description:
      'Understand what DevRel is, where it sits in an organization, and build the technical baseline every practitioner needs regardless of background.',
    layout: 'grid',
    groups: [
      {
        id: 'what-is-devrel',
        title: 'What is DevRel?',
        icon: '◎',
        topics: [
          { title: 'History & Evolution of DevRel', desc: 'How the role emerged from engineering and marketing, key milestones from Sun Microsystems to CNCF.' },
          { title: 'Types of DevRel Roles', desc: 'Developer Advocate, Community Manager, DX Engineer, Technical Writer, DevRel Lead — and how they differ.' },
          { title: 'Importance of DevRel', desc: 'Why organizations invest in DevRel and how it drives developer adoption, retention, and product feedback.' },
          { title: 'The DevRel Mindset', desc: 'Community-first thinking, long-term relationship building, and authentic representation.' },
          { title: 'DevRel vs Developer Marketing', desc: 'Understanding the overlap, the distinctions, and how they work together effectively.' },
          { title: 'DevRel in Different Org Structures', desc: 'DevRel under Product, Marketing, Engineering — how reporting lines shape priorities.' },
        ],
      },
      {
        id: 'technical-foundation',
        title: 'Technical Foundation',
        icon: '⚙',
        topics: [
          { title: 'Basic Programming Skills', desc: 'At least one language deeply enough to build demos, read others\' code, and debug integrations.' },
          { title: 'APIs & SDKs', desc: 'Understanding REST, GraphQL, webhooks, and how SDKs abstract them. Ability to use and explain APIs credibly.' },
          { title: 'Git & GitHub', desc: 'Version control basics, branching, pull requests, issues — the language of open source collaboration.' },
          { title: 'IDEs & Developer Tools', desc: 'VS Code, JetBrains, terminal workflows — being genuinely comfortable in a developer environment.' },
          { title: 'Issue Tracking Systems', desc: 'GitHub Issues, Jira, Linear — triaging, labelling, and managing community-reported bugs.' },
          { title: 'Cloud & Infrastructure Basics', desc: 'Enough AWS/GCP/Azure to understand deployment, containers, and developer pain in production.' },
        ],
      },
    ],
  },
  {
    id: 'four-pillars',
    phase: '02',
    title: 'The Four Core Pillars',
    color: '#2dd4bf',
    description:
      'The four disciplines that define DevRel work at every level. Most practitioners specialize in one or two early on, then expand coverage with experience. All four are required for senior roles.',
    layout: 'grid',
    groups: [
      {
        id: 'content-creation',
        title: 'Content Creation',
        icon: '✍',
        topics: [
          { title: 'Content Strategy', desc: 'Audience identification, content calendar, distribution channels, and goal alignment with business outcomes.' },
          { title: 'Blog Posts & Tutorials', desc: 'Long-form technical writing that educates developers — from getting started guides to deep-dives.' },
          { title: 'Documentation', desc: 'Getting Started guides, API references, FAQs — the backbone of developer experience at scale.' },
          { title: 'Code Samples & Example Apps', desc: 'Runnable, well-commented code that shows real-world usage patterns developers can copy-paste and build on.' },
          { title: 'Video & Live Streaming', desc: 'Demos, walkthroughs, and live coding sessions — YouTube, Twitch, and community platforms.' },
          { title: 'Podcasts & Audio', desc: 'Interviews, discussions, and educational audio for developer audiences on the move.' },
          { title: 'Newsletters', desc: 'Regular digests that keep your community informed, engaged, and returning.' },
          { title: 'Editing & Brand Voice', desc: 'Writing concisely, with personality — building a consistent voice across all output formats.' },
          { title: 'Content Performance Analysis', desc: 'Measuring reach, engagement, and downstream conversion from every content asset you ship.' },
          { title: 'Guest Blogging', desc: 'Writing for external publications (dev.to, Smashing Magazine, InfoQ) to reach new audiences.' },
          { title: 'Animations & Visual Explainers', desc: 'Diagrams, motion graphics, and visual content that explains complex concepts faster than text.' },
        ],
      },
      {
        id: 'community-building',
        title: 'Community Building',
        icon: '⬡',
        topics: [
          { title: 'Building a Community from Scratch', desc: 'Choosing platforms, seeding activity, onboarding early members, and creating the culture from day one.' },
          { title: 'Community Management', desc: 'Day-to-day moderation, health monitoring, member support, and keeping energy high.' },
          { title: 'Community Guidelines & Code of Conduct', desc: 'Setting expectations, enforcing rules consistently, and creating psychologically safe spaces.' },
          { title: 'Forums & Discussion Platforms', desc: 'Discord, Slack, Discourse, Reddit, GitHub Discussions — where developers actually gather and talk.' },
          { title: 'Meetups & Local Events', desc: 'Organizing, promoting, and facilitating in-person and virtual gatherings around your community.' },
          { title: 'Encouraging Participation', desc: 'Recognition programs, contributor spotlights, first-contribution guides, and engagement loops.' },
          { title: 'Managing Difficult Members & Conflict', desc: 'Handling disputes with empathy and clarity while protecting community culture.' },
          { title: 'Community Growth Strategies', desc: 'Acquisition tactics, referral programs, cross-community partnerships, and ambassador programs.' },
          { title: 'Community Health Metrics', desc: 'DAU/MAU, retention, message volume, contributor growth — measuring vitality not just size.' },
          { title: 'Onboarding New Members', desc: 'Welcome flows, starter resources, and quick-win paths that turn lurkers into active contributors.' },
        ],
      },
      {
        id: 'public-speaking',
        title: 'Public Speaking & Events',
        icon: '◈',
        topics: [
          { title: 'CFP Writing & Talk Proposals', desc: 'How to pitch compelling talks — abstract writing, title selection, speaker bio strategy.' },
          { title: 'Talk Structure & Narrative', desc: 'Building a story arc: hook, premise, demonstrations, takeaways. Making technical content memorable.' },
          { title: 'Live Demo Delivery', desc: 'Running demos that don\'t break — rehearsal strategy, fallback plans, and recovery skills.' },
          { title: 'Conference Speaking', desc: 'Tier-1 events (KubeCon, AWS re:Invent, DevRelCon, Open Source Summit) — norms and expectations.' },
          { title: 'Meetup & Lightning Talks', desc: 'Lower-stakes stages to build confidence, gather feedback, and refine material fast.' },
          { title: 'Engaging Your Audience', desc: 'Storytelling techniques, audience interaction, pacing, and energy management for long sessions.' },
          { title: 'Handling Q&A', desc: 'Anticipating tough questions, bridging to your message, and managing what you don\'t know.' },
          { title: 'Workshop Facilitation', desc: 'Hands-on sessions that teach by doing — curriculum design, pacing, and participant support.' },
          { title: 'Event Management', desc: 'Running your own events — logistics, promotion, sponsorship, and post-event follow-up.' },
          { title: 'Media Appearances', desc: 'Podcast guest appearances, webinar panels, press interviews — representing your company or project publicly.' },
          { title: 'Handouts & Supporting Materials', desc: 'Slide design, code repositories, resource lists — materials that extend the value of a talk.' },
        ],
      },
      {
        id: 'developer-experience',
        title: 'Developer Experience (DX)',
        icon: '⚡',
        topics: [
          { title: 'Developer Journey Mapping', desc: 'Charting every touchpoint from discovery through onboarding to advanced production usage.' },
          { title: 'Onboarding & Time-to-Hello-World', desc: 'Reducing friction from sign-up to first successful API call — the single most critical DX metric.' },
          { title: 'Developer Satisfaction Measurement', desc: 'CSAT surveys, NPS, qualitative interviews — understanding how developers actually feel.' },
          { title: 'Feedback Collection at Scale', desc: 'Structured surveys, community listening, support ticket analysis, and one-on-one interviews.' },
          { title: 'Feedback Loop to Product & Engineering', desc: 'Synthesizing developer pain into structured, prioritized product recommendations engineering can act on.' },
          { title: 'Building & Contributing to SDKs', desc: 'Reducing integration friction by contributing to client libraries across major languages.' },
          { title: 'Documentation as a Product', desc: 'Treating docs as a living product — versioned, tested, and iterated based on developer usage patterns.' },
          { title: 'DX Audits', desc: 'Systematic review of a platform\'s developer experience from a fresh set of eyes.' },
          { title: 'Error Messages & Edge Cases', desc: 'Making failures clear, actionable, and non-frustrating — the DX of things going wrong.' },
        ],
      },
    ],
  },
  {
    id: 'visibility',
    phase: '03',
    title: 'Visibility & Growth',
    color: '#22c55e',
    description:
      'Build your personal brand as a practitioner and use data to measure, justify, and scale your work\'s impact on the business.',
    layout: 'grid',
    groups: [
      {
        id: 'personal-brand',
        title: 'Personal Brand & Social Presence',
        icon: '◉',
        topics: [
          { title: 'Building a Personal Brand', desc: 'Your unique POV, area of expertise, and consistent presence — being known for something specific.' },
          { title: 'Creating Your Brand Voice', desc: 'Tone, style, and personality that resonates authentically with developer audiences.' },
          { title: 'LinkedIn Strategy', desc: 'Professional presence, long-form thought leadership, company representation, and career visibility.' },
          { title: 'Twitter / X Strategy', desc: 'Real-time developer engagement, thread-based education, and community interaction at speed.' },
          { title: 'Consistent Publishing Cadence', desc: 'Content scheduling, batching, and systems for showing up regularly without burning out.' },
          { title: 'Cross-Platform Promotion', desc: 'Amplifying content across platforms, repurposing formats, and collaborating with other creators.' },
          { title: 'Building in Public', desc: 'Sharing your work, learnings, and process openly — one of the most powerful DevRel growth strategies.' },
          { title: 'Instagram for DevRel', desc: 'Visual storytelling for events, behind-the-scenes, community highlights, and conference coverage.' },
        ],
      },
      {
        id: 'analytics',
        title: 'Analytics & Metrics',
        icon: '▣',
        topics: [
          { title: 'Key DevRel Metrics', desc: 'Community size, activation rate, content reach, talk attendance, developer NPS — the core dashboard.' },
          { title: 'Vanity vs Signal Metrics', desc: 'Distinguishing followers and views from indicators of real developer engagement and adoption.' },
          { title: 'Content Performance Tracking', desc: 'Page views, bounce rate, time on page, and conversion to sign-up — content ROI.' },
          { title: 'Community Health Analytics', desc: 'Message frequency, new member activation, churn rate, and contributor-to-lurker ratio.' },
          { title: 'Data Visualization for Leadership', desc: 'Presenting DevRel metrics to executives in a way that connects to business outcomes.' },
          { title: 'Google Analytics & Product Analytics', desc: 'GA4, Amplitude, Mixpanel — tracking developer behavior from docs to sign-up to production.' },
          { title: 'Data-Driven Iteration', desc: 'Using data to kill underperforming programs, double down on what works, and justify new investments.' },
          { title: 'Reporting Cadence', desc: 'Weekly/monthly/quarterly DevRel reports — telling the story of your work to stakeholders.' },
        ],
      },
    ],
  },
  {
    id: 'open-source',
    phase: '04',
    title: 'Open Source',
    color: '#f59e0b',
    description:
      'Open source is the cultural substrate of developer communities. Understanding and participating in it is non-negotiable for effective DevRel at any level.',
    layout: 'single',
    groups: [
      {
        id: 'oss',
        title: 'Open Source Participation & Strategy',
        icon: '⊕',
        topics: [
          { title: 'Contributing Code & Documentation', desc: 'Pull requests, issue fixes, docs improvements — showing up where developers actually work.' },
          { title: 'Issues & Pull Request Management', desc: 'Reviewing contributions, writing clear issues, triaging community-submitted bugs.' },
          { title: 'Labelling, Cleanup & Triage', desc: 'Maintaining a healthy issue backlog as a public signal of project vitality and responsiveness.' },
          { title: 'Good First Issues', desc: 'Curating approachable entry points for new contributors — the onboarding ramp for open source.' },
          { title: 'Open Source Governance Models', desc: 'CNCF, Apache Foundation, BDFL, OpenJS — how major projects are governed and decisions are made.' },
          { title: 'Open Source Strategy for Companies', desc: 'When and how to open source products or components to drive community and adoption.' },
          { title: 'Sustaining Contributors', desc: 'Recognition, maintainer programs, contributor summits — keeping people engaged long-term.' },
          { title: 'Licensing & Legal Basics', desc: 'MIT, Apache 2.0, GPL, BSL — what the most common licenses mean and why it matters for DevRel.' },
          { title: 'Open Source as DevRel Leverage', desc: 'Using OSS contributions to build credibility, trust, and industry relationships.' },
        ],
      },
    ],
  },
  {
    id: 'advanced',
    phase: '05',
    title: 'Advanced DevRel',
    color: '#ef4444',
    description:
      'Strategic, leadership, and cross-functional capabilities that define senior, staff, and leadership-level practitioners. This is where DevRel becomes a business function, not just a role.',
    layout: 'grid',
    groups: [
      {
        id: 'developer-marketing',
        title: 'Developer Marketing',
        icon: '◇',
        optional: true,
        topics: [
          { title: 'Developer Marketing Strategy', desc: 'Aligning DevRel programs with marketing goals — awareness, acquisition, activation, retention.' },
          { title: 'Initial Outreach & Partnerships', desc: 'Cold outreach to potential community members, integration partners, and co-marketing collaborators.' },
          { title: 'Collaborations & Co-Marketing', desc: 'Joint content, events, and promotions with complementary tools, platforms, or creators.' },
          { title: 'Education & Certification Programs', desc: 'Structured learning paths, certifications, and workshops that drive deep product adoption at scale.' },
          { title: 'Developer Advocacy as a Growth Channel', desc: 'Measuring and attributing developer program contributions to sign-up, conversion, and revenue.' },
        ],
      },
      {
        id: 'strategy-programs',
        title: 'DevRel Strategy & Leadership',
        icon: '◆',
        topics: [
          { title: 'Building a DevRel Program', desc: 'Mission, metrics, team structure, budget — building the function from zero with executive buy-in.' },
          { title: 'DevRel OKRs & Goal Setting', desc: 'Setting ambitious, measurable goals that connect community health to business outcomes.' },
          { title: 'Insights & Recommendations', desc: 'Turning developer and community data into structured, executive-ready product recommendations.' },
          { title: 'Cross-functional Collaboration', desc: 'Working with Product, Engineering, Marketing, Sales — influence without authority at scale.' },
          { title: 'Hiring & Building a DevRel Team', desc: 'Writing JDs, interviewing, onboarding DevRel hires, and developing junior practitioners.' },
          { title: 'Execution & Prioritization', desc: 'Ruthless prioritization, shipping consistently, managing stakeholder expectations across functions.' },
          { title: 'Continuous Learning & Trend Tracking', desc: 'Staying current across technology, community trends, and the DevRel function itself.' },
          { title: 'Active Listening & Community Sensing', desc: 'Reading the room at conferences and in communities — translating sentiment into strategic signal.' },
          { title: 'Advocacy Programs', desc: 'Champion, ambassador, and MVP programs that turn super-users into an extension of your DevRel team.' },
        ],
      },
    ],
  },
]
