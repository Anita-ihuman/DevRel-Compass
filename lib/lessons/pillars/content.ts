import type { SkillModule } from '../types'
import { R } from '../resources'

export const contentCreation: SkillModule = {
  groupId: 'content-creation',
  question: 'What makes technical content effective, and how do you produce it consistently?',
  overview: `
Content is the most visible part of DevRel and the most common entry point into it. It is also where most effort is wasted: posts that nobody finds, tutorials that break in a month, videos that don't answer anyone's question.

Effective technical content has three properties:

1. **It solves a real problem for a specific developer.** "How to paginate a Postgres query in Prisma" beats "Introducing our new features".
2. **It works.** The code runs, the versions are pinned, the steps are complete.
3. **It is findable.** It targets what developers search for and lives where they already are.

This module covers the formats (blogs, docs, code, video, audio, newsletters, visuals), the strategy that ties them together, and how to measure whether any of it matters.
`,
  topics: [
    {
      title: 'Content Strategy',
      body: `
Strategy is deciding **what not to make**. Start with four questions:

1. **Who is it for?** Define 1–3 developer personas by role, skill level and job-to-be-done, e.g. "backend developer evaluating queue services for a side project".
2. **Where are they in the journey?** Discover → evaluate → learn → build → scale. Each stage needs different content: comparisons and "why" pieces early, tutorials and reference in the middle, advanced patterns and case studies later.
3. **What business goal does it serve?** Awareness, activation, retention or feedback. Be explicit.
4. **How will it reach them?** Search, community, newsletter, social or partner channels. Distribution is part of the plan, not an afterthought.

Then build a **content calendar** that mixes *pillar pieces* (deep, evergreen guides you update over time), *timely pieces* (launches, trends) and *community pieces* (answers to real questions you keep seeing). Mine the questions: support tickets, forum threads, Stack Overflow and Discord. The best content ideas are questions developers have already asked.

Adam DuVander's DevRelCon talk on scaling DevRel with content is a good model for turning this into a system.
`,
      takeaways: [
        'Define persona, journey stage, business goal and channel for every piece',
        'Mix evergreen pillar content with timely and community-driven pieces',
        'Mine support and community questions for the best topics',
      ],
      resources: [R.vidDuVanderContent, R.devMarketingDoesNotExist, R.devRelBook],
    },
    {
      title: 'Blog Posts & Tutorials',
      body: `
A **tutorial** takes a learner from nothing to a working result by following steps. A **blog post** can explain, argue, compare or tell a story. Both need structure.

A tutorial skeleton that works:

1. **Outcome first.** Show the finished result (a screenshot or GIF) and say what they'll learn and how long it takes.
2. **Prerequisites.** Exact versions, accounts and prior knowledge.
3. **Small steps, each verifiable.** After each step the reader should see something work.
4. **Explain the why,** briefly, right where it matters.
5. **Full code** in a linked repo, tagged to a version.
6. **Troubleshooting.** The three errors people will hit.
7. **Next steps.** Where to go deeper.

Editing rules: one idea per paragraph, headings that work as a table of contents, code blocks that are copy-paste safe (no prompts in the copied text, no hidden steps), and **test the tutorial from scratch** on a clean environment before publishing. A tutorial that doesn't work costs you more trust than no tutorial at all.
`,
      takeaways: [
        'Show the end result first, then small verifiable steps',
        'Pin versions and link to a runnable repo',
        'Test from a clean environment before you publish',
      ],
      resources: [R.diataxis, R.googleTechWriting, R.everybodyWrites, R.vidEggerDocs],
    },
    {
      title: 'Documentation',
      body: `
Docs are the most-read content any developer company produces, and the least glamorous. Developers use them every day, usually in a hurry and usually when something is wrong.

The most useful mental model is **Diátaxis**, which says there are four different kinds of documentation, each with a different job:

- **Tutorials** — learning-oriented. Take a beginner by the hand to a first success.
- **How-to guides** — task-oriented. Steps to accomplish a specific goal ("rotate an API key").
- **Reference** — information-oriented. Accurate, complete, consistent (API endpoints, parameters, errors).
- **Explanation** — understanding-oriented. Concepts, architecture, trade-offs.

Most bad docs mix these: a reference page that wanders into a tutorial, or a tutorial that stops to explain architecture. Keep them separate and link between them.

Other essentials: a **Getting Started** page that reaches first success fast, copy-pasteable code in multiple languages, searchable navigation, and a clear "was this helpful?" feedback path. *Docs for Developers* is the best book-length guide.
`,
      takeaways: [
        'Four doc types: tutorials, how-tos, reference, explanation — don’t mix them',
        'Getting Started is the highest-leverage page you own',
        'Give readers a feedback path and act on it',
      ],
      resources: [R.diataxis, R.docsForDevelopers, R.writeTheDocsGuide, R.vidLuffDocs, R.googleStyleGuide],
    },
    {
      title: 'Code Samples & Example Apps',
      body: `
Developers learn by copying. Your samples are the code they'll copy, so they need to be good.

**Snippets** (5–30 lines) show one concept inline in docs. **Sample apps** show a realistic end-to-end use case. **Starters and templates** are opinionated projects people build on.

Qualities of great sample code:

- **Runs as-is**, with pinned dependencies and an .env.example
- **Minimal.** Only what the concept needs; no unrelated frameworks
- **Idiomatic.** Written the way that language's community writes it
- **Safe.** No secrets, sensible error handling, no deprecated APIs
- **Explained.** Comments on the *why*, and a README that stands alone
- **Maintained.** Tested in CI and updated when the API changes. Stale samples are a top source of developer frustration

Keep samples in public repos, tag versions, and track which samples people actually clone. Retire the ones nobody uses rather than keep maintaining them.
`,
      takeaways: [
        'Samples must run as-is, stay minimal and be idiomatic',
        'Test samples in CI so they don’t rot when the API changes',
        'Retire samples nobody uses; maintain the ones they do',
      ],
      resources: [R.goodDocsProject, R.githubSkills, R.vidHightowerDemo],
    },
    {
      title: 'Video & Live Streaming',
      body: `
Video wins for **showing** things: a workflow, a debugging session, a UI. It's also how many developers discover content, especially on YouTube.

Formats that work in DevRel:

- **Short explainers** (1–5 min): one concept, tightly scripted. Think Fireship's "in 100 seconds".
- **Tutorials** (10–30 min): build something start to finish, with chapters.
- **Live streams:** live coding, Q&A and pairing with community members. Lower production, higher connection.
- **Talk recordings:** repurpose every talk you give.

Craft basics: audio quality matters more than video quality, so buy a decent USB microphone first. Script the intro, bullet-point the rest. Zoom in on code; use large fonts. Cut dead time aggressively. Add chapters, captions and a description with links.

OBS Studio is the free standard for recording and streaming. Start with one format and a consistent schedule before trying more.
`,
      takeaways: [
        'Video is best for showing workflows; audio quality matters most',
        'Short explainers, tutorials and live streams serve different goals',
        'Repurpose every talk and stream into clips and posts',
      ],
      resources: [R.obs, R.vidDocker100, R.vidHightowerDemo],
    },
    {
      title: 'Podcasts & Audio',
      body: `
Podcasts suit **conversation, story and opinion**, not step-by-step instruction. They build a relationship over time because people listen during commutes, workouts and chores.

Ways to use audio in DevRel:

- **Guesting** on existing developer podcasts. This is the fastest route, since the audience is already there.
- **Hosting** a show: interviews with community members, maintainers, customers. Great for relationship building and for surfacing stories.
- **Audio versions** of popular posts or newsletters.

If you host: pick a narrow theme, commit to a realistic cadence (every two weeks is fine), prepare questions but follow curiosity, publish show notes with links and a transcript for accessibility and search, and clip highlights for social. Community Pulse is a long-running example of a DevRel-focused show.
`,
      takeaways: [
        'Audio suits stories and conversations, not step-by-step instruction',
        'Guesting on existing shows is the fastest way in',
        'If hosting: narrow theme, realistic cadence, show notes and transcripts',
      ],
      resources: [R.communityPulse, R.vidDuVanderMarketing],
    },
    {
      title: 'Newsletters',
      body: `
A newsletter is the one channel you **own**. Algorithms can't bury it. It keeps developers coming back and gives you a direct line for launches, events and calls for feedback.

What makes a developer newsletter worth opening:

- **A consistent promise.** "Five links about X every Friday" or "one deep lesson a month". Readers subscribe to a promise.
- **Curation with opinion.** Don't just list links; say why each matters.
- **Community in it.** Highlight member projects, contributors and questions.
- **Clean and scannable.** Clear subject line, short sections, one main call to action.

Measure open rate carefully (privacy features inflate it), and focus on click-through and replies. Replies are gold for feedback. DevRel Weekly is a good model of a practitioner-curated newsletter, and this site's own newsletter follows the same idea.
`,
      takeaways: [
        'Newsletters are an owned channel — no algorithm between you and readers',
        'Make a clear promise and keep it consistently',
        'Curate with opinion and feature your community',
      ],
      resources: [R.devrelWeekly, R.everybodyWrites],
    },
    {
      title: 'Editing & Brand Voice',
      body: `
Most first drafts are 30% too long. Editing is where content becomes good.

**An editing pass that works:**

1. **Structure.** Does every section earn its place? Could the reader skim the headings and get the point?
2. **Clarity.** Cut filler ("basically", "in order to", "it should be noted that"). Prefer active voice. Define each term once.
3. **Accuracy.** Run every code block. Check every link.
4. **Inclusivity.** Avoid "simply", "just" and "obviously", which make struggling readers feel stupid. Use inclusive language and alt text on images.

**Voice** is the consistent personality across everything you publish. For most developer brands, that's *knowledgeable peer*: direct, friendly, precise, occasionally funny, never hype-y. Write it down in a short voice guide with do/don't examples so teammates and guest authors can match it.

Tools help: Hemingway for readability, Vale to enforce a style guide in CI, and the Google and Microsoft style guides as references.
`,
      takeaways: [
        'Edit for structure, clarity, accuracy and inclusivity — in that order',
        'Drop "simply", "just", "obviously"',
        'Document your voice with do/don’t examples',
      ],
      resources: [R.googleStyleGuide, R.msStyleGuide, R.hemingway, R.valeLinter, R.everybodyWrites],
    },
    {
      title: 'Content Performance Analysis',
      body: `
Measure content by the **job it was meant to do**, not by views alone.

| Goal | Useful signals |
|---|---|
| Awareness | Search impressions, new visitors, referral sources |
| Education | Time on page, scroll depth, tutorial completion, repo clones |
| Activation | Sign-ups or API keys created after reading (attributed) |
| Retention | Returning readers, newsletter subscribers |
| Feedback | Comments, replies, issues opened, questions reduced in support |

Practical habits: add UTM parameters to links you share, track a small set of pieces monthly, and review your **top 10 and bottom 10** each quarter. Update winners (they compound in search) and learn from losers: wrong topic, wrong channel or wrong format?

Combine numbers with qualitative signal. A single "this saved me a day" comment from the right developer can matter more than a thousand views.
`,
      takeaways: [
        'Measure against the goal the piece was meant to serve',
        'Review top and bottom performers quarterly; update winners',
        'Pair metrics with qualitative feedback',
      ],
      resources: [R.ga4Docs, R.leanAnalytics, R.vidMarketingMetrics],
    },
    {
      title: 'Guest Blogging',
      body: `
Guest posts put your ideas in front of an audience you haven't built yet, borrowing the trust of an established publication.

Where to look: freeCodeCamp News, DEV Community, Smashing Magazine, CSS-Tricks-style publications, InfoQ, The New Stack, and partner or ecosystem blogs such as your cloud provider's or framework's.

How to pitch:

1. **Read the publication.** Know its audience, tone and what it has already covered.
2. **Pitch a specific piece:** a working title, a 3–5 bullet outline, who it's for, and why you're the right person.
3. **Link to your best existing writing.**
4. **Keep it educational.** Most publications reject product promotion; mention your product only where it's genuinely the example.

After publishing, share it widely, thank the editors and link it from your portfolio. A few strong guest posts can do more for your career than dozens of posts on your own blog.
`,
      takeaways: [
        'Guest posts borrow an established audience’s trust',
        'Pitch specific, outlined pieces that fit the publication',
        'Educate first — promotion gets rejected',
      ],
      resources: [R.freeCodeCampNews, R.smashingWrite, R.devTo],
    },
    {
      title: 'Animations & Visual Explainers',
      body: `
A good diagram replaces three paragraphs. Visuals are especially powerful for **architecture, flows, data movement and "before/after" comparisons**.

Levels of effort:

- **Diagrams:** Excalidraw (hand-drawn, friendly), Mermaid (diagrams as code, in Markdown) and draw.io.
- **Annotated screenshots and GIFs:** show exactly where to click.
- **Motion:** short animations for concepts that change over time, such as request lifecycles or consensus algorithms. Manim (the engine behind 3Blue1Brown) is great for programmatic animations.

Principles: one idea per visual, consistent colours and shapes (the same shape means the same thing everywhere), label everything, write alt text, and make it readable on a phone. If a visual needs a paragraph to explain, simplify the visual.
`,
      takeaways: [
        'Use visuals for architecture, flows and change over time',
        'One idea per visual; consistent shapes and labels',
        'Always add alt text and check mobile readability',
      ],
      resources: [R.excalidraw, R.manim, R.storytellingWithData],
    },
  ],
  resources: [
    R.googleTechWriting,
    R.diataxis,
    R.docsForDevelopers,
    R.googleStyleGuide,
    R.everybodyWrites,
    R.writeTheDocs,
    R.vidDuVanderContent,
  ],
  challenge: {
    title: 'Publish your first technical tutorial',
    prompt: `
Write and publish a tutorial that takes a developer from zero to a working result using a real tool or API. Choose something you recently learned. Your beginner perspective is an asset, because you still remember what was confusing.

Keep it focused: one outcome, 20–45 minutes for the reader, and a public repo with the finished code.
`,
    template: `\`\`\`markdown
---
title: "How to <achieve outcome> with <tool>"
description: "<one sentence: who it's for and what they'll build>"
---

![Finished result](./result.png)

**What you'll build:** ...
**Time:** ~30 minutes · **Level:** Beginner

## Prerequisites
- Node.js 22+ (or Python 3.12+)
- A free <tool> account → <link>
- Familiarity with <concept>

## Step 1 — Set up the project
<command>
You should now see: <expected output>

## Step 2 — <next verifiable step>
<code>
Why this matters: <one or two sentences>

## Step 3 — ...

## Troubleshooting
- **<Error message>** — <cause> → <fix>

## What's next
- <deeper tutorial / docs link>

Full code: <repo link, tagged v1.0>
\`\`\``,
  },
}
