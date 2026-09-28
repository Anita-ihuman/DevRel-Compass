import type { SkillModule } from '../types'
import { R } from '../resources'

export const developerExperience: SkillModule = {
  groupId: 'developer-experience',
  question: 'How do you find and remove the friction developers hit with your product?',
  overview: `
Developer Experience (DX) is **how it feels to build with your product**, from the first search result to running it in production. Great DX is invisible: things work, errors explain themselves, and docs answer the question you actually had. Bad DX is where developers quietly give up and pick a competitor.

DevRel is uniquely placed to improve DX because you are both a user of the product and the person hearing everyone else's pain. This module turns that position into a practice: map the journey, measure friction, collect feedback at scale, and, crucially, **get it fixed** by making a compelling case to product and engineering.
`,
  topics: [
    {
      title: 'Developer Journey Mapping',
      body: `
A developer journey map charts every stage and touchpoint a developer passes through, and how they feel at each one.

A common set of stages (adapted from Lewko & Parton's Developer Journey):

1. **Discover:** search, social, word of mouth and talks
2. **Evaluate:** homepage, pricing, docs skim, comparisons
3. **Learn:** getting started, tutorials, samples
4. **Build:** SDKs, API reference, debugging, support
5. **Scale:** production concerns, performance, billing and limits
6. **Advocate:** community, contributions and recommendations

For each stage, record: what the developer is trying to do, which touchpoints they use, what they're thinking and feeling, pain points, and opportunities. Build it from **evidence**: interviews, analytics, support tickets and your own fresh-eyes walkthrough, not assumptions.

The map's value is shared understanding. Put it in front of product, marketing and engineering; it often reveals that no one owns the handoff between stages.
`,
      takeaways: [
        'Map stages from discovery to advocacy with touchpoints and emotions',
        'Build from evidence — interviews, analytics, support data',
        'Use it to align teams and expose unowned handoffs',
      ],
      resources: [R.devRelBook, R.nngJourneyMapping, R.vidLewkoDxJourney],
    },
    {
      title: 'Onboarding & Time-to-Hello-World',
      body: `
**Time-to-Hello-World (TTHW)**, sometimes called time-to-first-call, measures how long it takes a new developer to get a first successful result. It's the single most useful DX metric because onboarding is where most developer products lose people.

How to measure it:
- **Instrument it:** time from sign-up to first successful API call or first deploy.
- **Test it:** watch 5 developers attempt it without help (screen-share, think aloud). You'll find most issues with just five.
- **Do it yourself** regularly on a clean machine with a fresh account.

Common friction to remove: too many sign-up steps, key or credential confusion, missing prerequisites, copy-paste code that doesn't work, unclear next step after success.

Tactics that help: a quickstart per language, copy-paste-ready code with the user's own key pre-filled when logged in, interactive sandboxes, starter templates and a clear "you did it, here's what to try next".
`,
      takeaways: [
        'TTHW is the most important DX metric',
        'Measure with instrumentation and 5-person usability tests',
        'Pre-fill keys, provide per-language quickstarts, show the next step',
      ],
      resources: [R.vidBeyondDx, R.vidFreemanDx, R.docsForDevelopers],
    },
    {
      title: 'Developer Satisfaction Measurement',
      body: `
Numbers tell you *where* the problem is; developers tell you *why*.

Common instruments:
- **CSAT** (customer satisfaction): "How satisfied were you with X?" on a 1–5 scale, asked right after a specific interaction (a docs page or a support ticket).
- **NPS** (Net Promoter Score): "How likely are you to recommend…?" Useful as a trend, weak as a diagnostic.
- **CES** (Customer Effort Score): "How easy was it to…?" Often the best fit for DX.
- **Docs feedback widgets:** "Was this page helpful?" with an optional comment.
- **Periodic developer surveys:** annual or bi-annual, covering tools, pain points and priorities.
- **Qualitative interviews:** 30-minute conversations with a mix of new, active and churned developers.

The SPACE framework reminds you that developer experience has multiple dimensions (satisfaction, performance, activity, communication, efficiency). No single number captures it. Always pair a score with an open-ended "why?".
`,
      takeaways: [
        'Use CSAT/CES at moments; NPS as a trend',
        'Always pair scores with an open-ended "why?"',
        'Interview new, active and churned developers',
      ],
      resources: [R.spaceFramework, R.momTest, R.soSurvey],
    },
    {
      title: 'Feedback Collection at Scale',
      body: `
Feedback arrives everywhere: community chat, GitHub issues, support tickets, social media, talks, sales calls and surveys. Your job is to **collect it in one place, tag it consistently, and spot patterns**.

A lightweight system:

1. **One intake.** A form, database or board where every piece of feedback lands, with source and link.
2. **Consistent tags:** product area, journey stage, type (bug, missing feature, docs gap, confusion) and severity.
3. **Count and weigh:** how often, how many developers, how important those developers are, and business impact.
4. **Quote real developers.** Exact words are persuasive.
5. **Review regularly:** a weekly or bi-weekly look at trends.

When interviewing, follow *The Mom Test*: ask about past behaviour and specific experiences ("Tell me about the last time you set up auth"), not hypotheticals ("Would you use X?"). People are too polite to give honest answers to hypothetical questions.
`,
      takeaways: [
        'Centralise feedback from every channel with consistent tags',
        'Count frequency and weigh impact; keep verbatim quotes',
        'Ask about past behaviour, not hypotheticals',
      ],
      resources: [R.momTest, R.vidFourPillarsSupport, R.linearMethod],
    },
    {
      title: 'Feedback Loop to Product & Engineering',
      body: `
Feedback that doesn't change the product is just a list of complaints. The skill is **turning developer pain into prioritised, actionable recommendations** that product and engineering want to act on.

A recommendation that gets traction:

- **The problem,** in the developer's words, with 2–3 verbatim quotes
- **Evidence of scale:** how many developers, from which channels, over what period
- **Impact:** on activation, retention, support load or revenue (estimate honestly)
- **A proposed direction,** not a demand for a specific implementation
- **Effort guess** and what happens if nothing changes

Deliver it where decisions happen: planning meetings, a monthly "voice of the developer" report or the product tool (Jira or Linear). Build relationships with PMs before you need them.

Then **close the loop publicly**: when it ships, tell the developers who asked. That visibly proves feedback matters, and they'll give you more of it.
`,
      takeaways: [
        'Package feedback as problem, evidence, impact, direction',
        'Bring it to where decisions are made — build PM relationships early',
        'Close the loop publicly when it ships',
      ],
      resources: [R.vidThengvallCompanyGoals, R.businessValueDevRel, R.vidFourPillarsSupport],
    },
    {
      title: 'Building & Contributing to SDKs',
      body: `
SDKs are often the first code a developer touches. Their ergonomics shape how the whole product feels.

What makes a good SDK:

- **Idiomatic:** feels native to the language (async/await in JS, context managers in Python, builders in Java).
- **Sensible defaults:** retries with backoff, timeouts, pagination helpers and auth from environment variables.
- **Typed:** types and autocomplete are documentation.
- **Great errors:** typed exceptions with the HTTP status, request ID and a helpful message.
- **Consistent across languages** in concepts, without being identical in syntax.
- **Versioned carefully:** semantic versioning, changelogs, deprecation warnings before removal.

Many SDKs are now generated from OpenAPI specs, then hand-polished. DevRel contributions often include examples, README improvements, missing helpers, and bug reports from real usage, all of which directly reduce integration friction.
`,
      takeaways: [
        'Idiomatic, typed, with sensible defaults and great errors',
        'Semantic versioning and deprecation warnings protect users',
        'Contribute examples, docs and real-usage bug reports',
      ],
      resources: [R.googleApiDesign, R.githubPRDocs, R.osgHowToContribute],
    },
    {
      title: 'Documentation as a Product',
      body: `
Treat docs like software: they have users, a roadmap, bugs and releases.

- **Owners and roadmap:** who's responsible, what's planned, and what's the biggest gap?
- **Docs as code:** docs in Git, reviewed in PRs, built and deployed with CI. Engineers can contribute alongside code changes.
- **Testing:** check links automatically, and **run code samples in CI** so they fail loudly when the API changes. Lint prose with Vale.
- **Versioning:** docs that match the product version the reader is using.
- **Analytics:** top pages, search terms (especially searches with no results), exit pages and feedback-widget comments.
- **Iteration:** a regular cycle of fixing the worst-rated and most-visited pages.

Search queries with zero results are one of the best sources of documentation work. They're developers telling you exactly what's missing.
`,
      takeaways: [
        'Docs need owners, a roadmap, tests and releases',
        'Run code samples and link checks in CI',
        'Zero-result searches show you exactly what’s missing',
      ],
      resources: [R.vidDocsAsCode, R.writeTheDocsGuide, R.valeLinter, R.docsForDevelopers],
    },
    {
      title: 'DX Audits',
      body: `
A DX audit is a structured, fresh-eyes review of the whole developer experience. It's also one of the best portfolio pieces a DevRel candidate can produce.

How to run one:

1. **Pick a persona and a goal**, e.g. "a Python developer building a webhook consumer".
2. **Go through the journey** from search to production, recording your screen and timing each step.
3. **Log every friction point** with a severity (blocker, major, minor), where it happened and a screenshot.
4. **Score each stage** (e.g. 1–5 on clarity, speed and delight) so you can compare over time or against competitors.
5. **Recommend fixes,** prioritised by impact and effort, with quick wins at the top.

Be kind and specific. The people who built it will read it. Frame it as "here's how we make this great", not a list of failures.
`,
      takeaways: [
        'Audit a specific persona and goal end-to-end',
        'Log friction with severity, evidence and timing',
        'Prioritise fixes by impact and effort; stay constructive',
      ],
      resources: [R.nngJourneyMapping, R.vidLeRouxDx, R.vidInclusivePortal],
    },
    {
      title: 'Error Messages & Edge Cases',
      body: `
Developers spend much of their time with your product in a failure state. Error messages are the DX of things going wrong.

A great error message answers three questions:
1. **What happened?** Specific, not "Something went wrong".
2. **Why?** The likely cause.
3. **What can I do?** A concrete next step, ideally with a link to docs.

Compare: \`Error 400\` versus \`400 invalid_parameter: 'email' must be a valid address (got "jane@"). See https://docs.example.com/errors#invalid_parameter\`.

Other DX practices for failure:
- Stable, documented **error codes** developers can handle programmatically
- A **request ID** in every error for support conversations
- Clear rate-limit headers and retry guidance
- Validation that catches mistakes early (at compile time or in the CLI) rather than in production

Collect the most frequent errors from logs and support. Improving the top five messages can noticeably reduce support volume.
`,
      takeaways: [
        'Every error: what happened, why, what to do next',
        'Stable error codes and request IDs make errors debuggable',
        'Improve the most frequent errors first',
      ],
      resources: [R.nngErrorMessages, R.googleApiDesign, R.mdnHttp],
    },
  ],
  resources: [R.devRelBook, R.docsForDevelopers, R.momTest, R.spaceFramework, R.nngJourneyMapping, R.vidFreemanDx, R.vidLewkoDxJourney],
  challenge: {
    title: 'Publish a DX audit',
    prompt: `
Conduct a full DX audit of a developer product's onboarding, from search to first success to the first "real" task, and publish it. Keep it constructive, specific and evidence-based. Companies hire people who can do exactly this.
`,
    template: `\`\`\`markdown
# DX audit: <product> for <persona>

**Goal:** <what the persona is trying to achieve>
**Date / versions tested:** <...>
**Total time to first success:** <mm:ss>

## Journey scorecard
| Stage | Time | Clarity (1–5) | Friction points |
|---|---|---|---|
| Discover | | | |
| Sign up | | | |
| Getting started | | | |
| First real task | | | |

## Friction log
1. **[Blocker]** <what happened> — <where> — <screenshot>
2. **[Major]** ...
3. **[Minor]** ...

## What's great (keep doing this)
- ...

## Top recommendations
| # | Recommendation | Impact | Effort |
|---|---|---|---|
| 1 | | High | Low |

## Method
How I tested, what I didn't cover.
\`\`\``,
  },
}
