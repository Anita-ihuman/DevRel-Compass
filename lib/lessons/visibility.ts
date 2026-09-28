import type { PhaseLesson } from './types'
import { R } from './resources'
import { webinar } from './webinars'

export const visibility: PhaseLesson = {
  phaseId: 'visibility',
  duration: '4–6 weeks at 5 hours a week',
  outcomes: [
    'Define a clear personal positioning and voice, and show up consistently without burning out',
    'Use LinkedIn, X and visual platforms deliberately, each for what it does best',
    'Choose DevRel metrics that signal real impact instead of vanity',
    'Build a simple reporting cadence that tells leadership the story of your work',
  ],
  intro: `
Two things decide whether a DevRel career grows: **whether people know your work** and **whether you can prove it matters**. This phase covers both.

Personal brand isn't vanity. In DevRel your reputation *is* part of the job. Developers listen to people they recognise and trust, event organisers invite speakers they've seen, and hiring managers shortlist candidates whose work they've already read. As Adora Nwodo says in her Strategy Room session, visibility doesn't mean hundreds of thousands of followers. It means being known for something specific by the right people.

Analytics is the other half. DevRel teams without numbers get cut; DevRel teams with only vanity numbers get misunderstood. You'll learn to separate signal from noise, report in the language of business outcomes and use data to decide what to stop doing.

Treat these as one system: the same habits of consistency, clarity and reflection power both.
`,
  modules: [
    // ────────────────────────────────────────────────────────────────────────
    {
      groupId: 'personal-brand',
      question: 'How do you become known for something — without becoming an influencer?',
      overview: `
A personal brand is simply **what people say about you when you're not in the room**. You can't control it completely, but you can shape it by choosing a focus, showing your work consistently and being generous.

This module covers positioning, voice, platform strategies (LinkedIn, X, Instagram), cadence, cross-promotion and building in public. The goal is a sustainable system that makes opportunities find you.
`,
      topics: [
        {
          title: 'Building a Personal Brand',
          body: `
Start with **positioning**: the intersection of what you know, what you enjoy and what your target audience needs. Write it as one sentence:

> *I help ___ (audience) do ___ (outcome) through ___ (your angle).*

For example: "I help frontend developers adopt accessible design systems through practical tutorials and talks."

Then build proof around it:
- **Signature content:** 3–5 pieces that define you (a popular tutorial, a talk, an open source project).
- **A home base:** a simple personal site with your positioning, best work, talks and contact info. You own it; platforms change.
- **Consistency:** the same name, photo and one-line bio everywhere.
- **Generosity:** share others' work, answer questions and credit people. Brands built on generosity are the most durable.

Narrow is powerful. You can broaden later, but being "the person who knows X" opens doors that "a developer advocate" doesn't.
`,
          takeaways: [
            'Write a one-sentence positioning statement',
            'Build signature content and an owned home base',
            'Narrow focus opens doors; generosity makes it last',
          ],
          resources: [webinar('04'), R.showYourWork, R.codingCareerHandbook],
        },
        {
          title: 'Creating Your Brand Voice',
          body: `
Your voice is how you sound across everything: posts, talks, replies. The best DevRel voices feel like a **knowledgeable friend**: clear, honest, a little personal.

Find yours:
- **Read your last 10 posts** and circle the lines that sound most like you. Do more of that.
- **Pick three adjectives** (e.g. practical, curious, warm) and check new content against them.
- **Have opinions,** kindly. "I prefer X for Y because Z" is more memorable than neutral summaries.
- **Share the struggle,** not just the success. The bug you spent two days on is more relatable than the polished win.
- **Stay authentic to your culture and background.** Your perspective is an asset, not something to sand down.

When you represent a company, align with its voice but keep your personality. Audiences follow people, not logos.
`,
          takeaways: [
            'Pick three adjectives and write to them',
            'Have kind, specific opinions',
            'Share struggles as well as wins',
          ],
          resources: [R.everybodyWrites, R.msStyleGuide],
        },
        {
          title: 'LinkedIn Strategy',
          body: `
LinkedIn is where **hiring managers, event organisers and decision-makers** see your work. For DevRel careers it's often the highest-leverage platform.

What works:
- **Profile:** a headline with your positioning (not just your title), a featured section with your best work, and an About section written for your target reader.
- **Posts:** lessons learned, behind-the-scenes of projects, frameworks, event recaps and career insights. Lead with a strong first line; the preview cuts off quickly.
- **Native content:** the algorithm tends to favour content on the platform, so post a summary and put links in the first comment or at the end.
- **Engagement:** thoughtful comments on others' posts can build as much visibility as your own posts.
- **Consistency:** 1–3 posts a week beats bursts.

Share your Compass Challenge outputs here. Each is a ready-made post: what you did, what you learned and a link.
`,
          takeaways: [
            'Headline = positioning; featured = best work',
            'Strong first line; lessons and behind-the-scenes content',
            'Thoughtful comments build visibility too',
          ],
          resources: [webinar('04'), R.showYourWork],
        },
        {
          title: 'Twitter / X Strategy',
          body: `
X is real-time and conversational. It's where many developers share quick discoveries, react to launches and talk to each other directly. Depending on your community, Bluesky, Mastodon or Threads may matter as much, so follow your audience.

What works:
- **Threads** that teach: "7 things I learned building X" with code snippets or visuals.
- **Quick wins:** a tip, a snippet or a before/after.
- **Replies:** being helpful in replies to people in your niche builds relationships faster than broadcasting.
- **Live coverage** of events and launches.
- **Lists** to follow your niche without drowning in noise.

Keep it professional-casual. Avoid dunking on people or products. It's memorable in the worst way, especially when you represent a company.
`,
          takeaways: [
            'Teach in threads; share quick, concrete wins',
            'Replies build relationships faster than broadcasts',
            'Go where your audience is — X, Bluesky, Mastodon',
          ],
          resources: [R.learnInPublic, R.vidLearnInPublic],
        },
        {
          title: 'Consistent Publishing Cadence',
          body: `
Consistency beats intensity. Showing up weekly for a year does more than a burst of daily posts followed by silence.

Systems that make it sustainable:
- **Pick a realistic cadence:** for example, one long piece a month and two short posts a week.
- **Batch:** write several posts in one session; schedule them.
- **Keep an idea bank:** questions you've answered, mistakes you've made, things you've learned this week. You'll never start from a blank page.
- **Repurpose:** one tutorial → a thread → a LinkedIn post → a short video → a talk.
- **Protect your energy:** plan off-weeks. Burnout is common in DevRel; a sustainable pace is a professional skill.

Track your cadence rather than your follower count for the first six months. Output is in your control; reach follows.
`,
          takeaways: [
            'Choose a cadence you can sustain for a year',
            'Batch, schedule and keep an idea bank',
            'Track output, not followers, for the first six months',
          ],
          resources: [R.showYourWork, R.codingCareerHandbook],
        },
        {
          title: 'Cross-Platform Promotion',
          body: `
Each platform has its own format and audience. **Repurpose, don't copy-paste.**

A repurposing chain for one tutorial:
1. **Blog post:** the canonical, full version on your site.
2. **LinkedIn:** the story and lesson, with a link in comments.
3. **X/Bluesky thread:** the steps as a visual thread.
4. **Short video:** the most surprising moment in 60 seconds.
5. **Newsletter:** a teaser plus the link.
6. **Community:** share in relevant communities *if it genuinely helps* and follow their self-promotion rules.

Collaborate with other creators: co-write, guest on each other's streams and trade newsletter mentions. Collaboration introduces you to audiences that already trust someone.

Always point back to one **canonical URL** you own, so authority accumulates in one place.
`,
          takeaways: [
            'Adapt format per platform — repurpose, don’t copy',
            'Point everything to a canonical URL you own',
            'Collaborate to reach audiences that already trust someone',
          ],
          resources: [R.vidDuVanderContent, R.devTo],
        },
        {
          title: 'Building in Public',
          body: `
Building in public means **sharing your work, learning and process as you go**, not just finished results. It's one of the most effective growth strategies in DevRel, and it's how many practitioners got their first role.

Why it works:
- People follow journeys; progress updates create a reason to come back.
- Your mistakes help others avoid them, which is generous and memorable.
- It creates evidence of skill that no resume can.
- It attracts collaborators and feedback early.

How to start: pick a project or skill, post weekly updates (what you did, what broke, what you learned), share code, and ask for input. swyx's essay *Learn In Public* is the manifesto. Read it today.

Boundaries matter. Don't share confidential employer information, and it's fine to keep some things private.
`,
          takeaways: [
            'Share process, mistakes and progress — not just results',
            'Weekly updates create a reason for people to follow',
            'Respect confidentiality; not everything needs sharing',
          ],
          resources: [R.learnInPublic, R.vidLearnInPublic, R.showYourWork, R.codingCareerHandbook],
        },
        {
          title: 'Instagram for DevRel',
          body: `
Instagram is optional for most DevRel roles, but powerful for **visual storytelling and human connection**, especially for events, community and developer-lifestyle content.

What works:
- **Event coverage:** stories from conferences and meetups, speaker moments and community faces (with permission).
- **Behind the scenes:** your setup, your preparation for a talk, a day in the life.
- **Carousels that teach:** a concept in 6–10 visual slides; these are often saved and shared.
- **Reels:** short clips of demos or tips; repurpose from other video.

Keep it visually consistent (a few colours and fonts), use captions for accessibility, and focus on community and people rather than product. Treat it as a secondary channel unless your audience is clearly there.
`,
          takeaways: [
            'Best for events, behind-the-scenes and visual explainers',
            'Carousels that teach are saved and shared',
            'Secondary channel unless your audience lives there',
          ],
          resources: [R.excalidraw, R.showYourWork],
        },
      ],
      resources: [webinar('04'), R.learnInPublic, R.showYourWork, R.codingCareerHandbook, R.everybodyWrites],
      challenge: {
        title: 'Build in public for 30 days',
        prompt: `
Pick a project or skill from this roadmap and **share your progress publicly every week for four weeks**. At the end, publish a retrospective: what you built, what you learned and what happened as a result (feedback, connections, opportunities).
`,
        template: `\`\`\`markdown
# Week <N> of building <project> in public

**This week I:** <what you did, 1–2 lines>
**What broke:** <the most useful mistake>
**What I learned:** <one lesson someone else can use>
**Next week:** <one specific goal>
**Link:** <repo / demo / post>

— — —

# 30-day retrospective
- What I built:
- Posts published: <n> · Best performing: <link>
- Feedback / connections / opportunities it created:
- What I'll keep doing:
- What I'll change:
\`\`\``,
      },
    },

    // ────────────────────────────────────────────────────────────────────────
    {
      groupId: 'analytics',
      question: 'How do you prove that DevRel work matters?',
      overview: `
Every DevRel practitioner eventually hears: *"What are we getting for this?"* This module prepares your answer.

The key shift is from **activity metrics** (talks given, posts published) to **outcome metrics** (developers activated, retention improved, support tickets reduced), connected to the goals your company already cares about. You won't be able to attribute everything, and you don't need to. You need a credible, consistent story backed by data.
`,
      topics: [
        {
          title: 'Key DevRel Metrics',
          body: `
Organise metrics by **journey stage** so each has a clear purpose:

| Stage | Example metrics |
|---|---|
| Awareness | Content reach, search impressions, event attendance, new community members |
| Activation | Sign-ups from DevRel sources, time-to-hello-world, first API calls, tutorial completions |
| Engagement | Active community members, returning docs visitors, repo stars and clones |
| Retention | Monthly active developers, churn, community retention |
| Advocacy | Community-created content, champions, referrals, contributor count |
| Product impact | Feedback items shipped, support deflection, docs satisfaction |

Choose a **North Star** that captures developer value, such as "weekly active developers making successful API calls", and 3–5 supporting metrics. Mary Thengvall's *The Business Value of Developer Relations* and the DevRelCon metrics talks provide practical frameworks.
`,
          takeaways: [
            'Organise metrics by journey stage',
            'Pick a North Star plus 3–5 supporting metrics',
            'Shift from activity to outcome metrics',
          ],
          resources: [R.businessValueDevRel, R.northStar, R.vidSpectreMeasuring, R.vidMetricsPanel],
        },
        {
          title: 'Vanity vs Signal Metrics',
          body: `
**Vanity metrics** look good but don't change decisions: follower counts, total community size, page views without context, repo stars.

**Signal metrics** reflect real developer behaviour and connect to outcomes: activation rate, active usage, retention, questions answered by members, and docs searches that end in success.

A quick test: *"If this number doubled, would we do anything differently, and would the business be better off?"* If not, it's vanity.

Vanity metrics aren't useless. Reach can be an early indicator, and leadership sometimes likes them. Just never report them alone. Pair each with a signal: "Our tutorial got 20k views **and** 1,200 developers created an API key from it."
`,
          takeaways: [
            'Vanity looks good; signal changes decisions',
            'Test: "If it doubled, would we act differently?"',
            'Pair any reach number with an outcome',
          ],
          resources: [R.leanAnalytics, R.vidMarketingMetrics],
        },
        {
          title: 'Content Performance Tracking',
          body: `
Track content in a simple, consistent way:

- **UTM parameters** on every link you share (source, medium, campaign) so sign-ups can be attributed.
- **A content inventory:** a spreadsheet or database of every piece with URL, date, type, goal and owner.
- **Monthly snapshot:** views, average engaged time, conversions (sign-ups, key creation, repo clones) and search position for target terms.
- **Quarterly review:** top 10 and bottom 10, update or retire, and double down on patterns.

Be honest about attribution limits. Developers often read content, leave, and sign up weeks later from a colleague's link. Use self-reported attribution ("How did you hear about us?") alongside analytics. It often surfaces DevRel impact that tools miss.
`,
          takeaways: [
            'UTMs plus a content inventory are the foundation',
            'Monthly snapshots, quarterly reviews',
            'Add self-reported attribution to catch what tools miss',
          ],
          resources: [R.ga4Docs, R.vidMarketingMetrics],
        },
        {
          title: 'Community Health Analytics',
          body: `
Community analytics answer: *is this place alive, helpful and growing in the right way?*

Core measures:
- **Activity:** messages, posts and events per week (trend, not absolute)
- **Activation:** new members who participate within 14 days
- **Responsiveness:** median time to first reply; percentage of questions answered
- **Self-sufficiency:** percentage of answers from non-staff
- **Retention:** cohort retention by join month
- **Contributor funnel:** members → contributors → maintainers or leaders

Most platforms have built-in insights (Discord, Discourse, GitHub). Community platforms and CHAOSS metrics help standardise. Look at **cohorts**, not totals: a growing total can hide collapsing retention.
`,
          takeaways: [
            'Measure activation, responsiveness, self-sufficiency and retention',
            'Use cohorts, not totals',
            'CHAOSS provides standard definitions',
          ],
          resources: [R.chaoss, R.orbitModel, R.osgMetrics],
        },
        {
          title: 'Data Visualization for Leadership',
          body: `
Executives give your report about 30 seconds. Design for that.

- **Lead with the headline:** "DevRel-sourced developers activate at 2× the rate of paid acquisition", then show the chart that proves it.
- **One message per chart.** Title charts with the insight, not the metric name.
- **Choose simple forms:** line charts for trends, bar charts for comparisons. Avoid pies and 3D.
- **Highlight what matters** with colour; grey out everything else.
- **Context:** targets, previous period and what changed.
- **Connect to company goals:** use leadership's language (revenue, retention, cost), not DevRel jargon.

*Storytelling with Data* is the definitive guide, and Cole Nussbaumer Knaflic's talk at Google is a great 60-minute primer.
`,
          takeaways: [
            'Headline first; title charts with the insight',
            'Simple forms; highlight one thing with colour',
            'Speak leadership’s language — revenue, retention, cost',
          ],
          resources: [R.storytellingWithData, R.vidStorytellingData],
        },
        {
          title: 'Google Analytics & Product Analytics',
          body: `
Two kinds of tools answer different questions:

- **Web analytics** (Google Analytics 4, Plausible and similar) show *how developers find and use your content*: traffic sources, pages, engagement and conversions from docs and blog.
- **Product analytics** (Amplitude, Mixpanel, PostHog and similar) show *what developers do in the product*: sign-up → key creation → first call → active usage, as funnels and cohorts.

DevRel's power move is **connecting the two**: which content or events lead to activation in the product? That usually needs consistent UTMs, a shared user identifier after sign-up, and collaboration with your data or growth team.

Learn the basics of events, funnels, cohorts and segments. You don't need to be an analyst, but you need to ask good questions of the data and read the answers correctly.
`,
          takeaways: [
            'Web analytics = discovery; product analytics = behaviour',
            'Connect content/events to in-product activation',
            'Learn events, funnels, cohorts and segments',
          ],
          resources: [R.ga4Docs, R.northStar, R.leanAnalytics],
        },
        {
          title: 'Data-Driven Iteration',
          body: `
Data's real job is **deciding what to stop, start and scale**.

A quarterly iteration loop:

1. **Review** each program against its goal metric.
2. **Classify:** scale (clearly working), fix (promising but underperforming), stop (not working, no clear fix).
3. **Experiment:** run small, time-boxed tests of new ideas with a clear success criterion.
4. **Reallocate** time and budget toward what works.
5. **Document** decisions and why, so you learn over time.

Stopping things is the hardest and most valuable part. Every program you stop frees time for one that works. Be as rigorous about your favourite program as your least favourite.
`,
          takeaways: [
            'Use data to decide: scale, fix or stop',
            'Run small, time-boxed experiments',
            'Stopping weak programs is the highest-leverage decision',
          ],
          resources: [R.leanAnalytics, R.measureWhatMatters, webinar('05')],
        },
        {
          title: 'Reporting Cadence',
          body: `
Regular reporting builds trust and protects your team's budget.

- **Weekly** (team): what shipped, key numbers and blockers. A few bullets.
- **Monthly** (manager and partners): progress against goals, highlights, "voice of the developer" insights and product feedback status.
- **Quarterly** (leadership): outcomes versus OKRs, 2–3 stories with data, what you learned, and the plan and asks for next quarter.

A good report structure: **headline → metrics vs targets → stories → insights from developers → next steps and asks.**

Include stories every time: a developer who shipped with your help, a community member who became a contributor, a product fix driven by your feedback. Numbers get attention; stories get remembered and repeated.
`,
          takeaways: [
            'Weekly for the team, monthly for partners, quarterly for leadership',
            'Headline → metrics → stories → insights → asks',
            'Stories get remembered and repeated',
          ],
          resources: [R.vidThengvallCompanyGoals, R.storytellingWithData, R.measureWhatMatters],
        },
      ],
      resources: [R.businessValueDevRel, R.storytellingWithData, R.leanAnalytics, R.chaoss, R.vidMarketingMetrics, R.vidMetricsPanel],
      challenge: {
        title: 'Create a DevRel impact report',
        prompt: `
Write a one-page quarterly-style impact report for real DevRel work: yours (content, community, talks), or a hypothetical program built from public data. Use the structure from this module. It's the document every DevRel manager wishes their team wrote.
`,
        template: `\`\`\`markdown
# DevRel impact report — <period>

## Headline
<One sentence: the most important outcome, with a number.>

## Goals vs results
| Goal | Metric | Target | Actual | Status |
|---|---|---|---|---|
| Activation | Dev sign-ups from DevRel sources | 500 | 612 | ✅ |

## Stories
1. **<Developer / community story>** — what happened, why it matters.
2. ...

## Voice of the developer
- Top 3 pain points (with quotes) and their product status

## What we learned
- Scale: ...
- Fix: ...
- Stop: ...

## Next quarter & asks
- Priorities:
- Asks (budget, headcount, product help):
\`\`\``,
      },
    },
  ],
}
