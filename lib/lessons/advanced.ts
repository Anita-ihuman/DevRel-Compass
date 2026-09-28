import type { PhaseLesson } from './types'
import { R } from './resources'
import { webinar } from './webinars'

export const advanced: PhaseLesson = {
  phaseId: 'advanced',
  duration: 'Ongoing — 6+ weeks, then continuous practice',
  outcomes: [
    'Align DevRel programs with marketing goals without losing developer trust',
    'Design a DevRel program from zero: mission, metrics, team, budget',
    'Set DevRel OKRs that connect community health to business outcomes',
    'Influence product, engineering, marketing and sales without authority',
    'Hire, grow and lead DevRel practitioners, and build advocacy programs that scale',
  ],
  intro: `
Senior DevRel is less about doing more talks and more about **designing systems that create outcomes**. At this level you're expected to set strategy, justify investment, work across the company and grow other people.

Two ideas run through this phase:

1. **DevRel is a business function.** Your programs exist to serve company goals, adoption, retention and product quality, in ways only DevRel can. You'll learn to set goals leadership understands and to show progress against them.
2. **Leverage over effort.** You can't personally talk to every developer. Senior practitioners multiply impact through programs (champions, education), systems (feedback loops, content engines) and people (hiring, mentoring).

Watch Rohit Ghumare's Strategy Room session on systems thinking and Linda Ikechukwu's session on turning developer education into business outcomes. Together they frame this whole phase.
`,
  modules: [
    // ────────────────────────────────────────────────────────────────────────
    {
      groupId: 'developer-marketing',
      question: 'How do you grow adoption through marketing that developers actually trust?',
      overview: `
This module is optional for many DevRel paths, but valuable if you work closely with marketing or lead a team that does. The core principle: **developer marketing works when it educates.** Developers ignore hype and reward usefulness.
`,
      topics: [
        {
          title: 'Developer Marketing Strategy',
          body: `
Developer marketing aligns DevRel-style credibility with marketing's reach and discipline across the funnel: **awareness → acquisition → activation → retention → referral**.

Strategy basics:
- **Positioning for developers:** what problem you solve, for whom, and why it's better, in technical terms, with proof.
- **Channels:** technical content and SEO, communities, events, partnerships, developer newsletters and podcasts, and (carefully) paid placements in developer media.
- **Product-led motions:** free tiers, sandboxes and templates that let developers experience value before talking to anyone.
- **Launches:** changelogs, launch posts, demo videos, launch-day community presence.
- **Measurement:** funnel metrics tied to product usage, not just leads.

DevRel's role is to keep it **honest and technical**: review messaging for accuracy, provide real examples and represent developer sentiment.
`,
          takeaways: [
            'Cover the full funnel, not just awareness',
            'Position technically, with proof',
            'DevRel keeps developer marketing honest and useful',
          ],
          resources: [R.devMarketingDoesNotExist, R.vidDuVanderMarketing, webinar('01')],
        },
        {
          title: 'Initial Outreach & Partnerships',
          body: `
Partnerships multiply reach by borrowing trust from someone developers already follow.

Types of partners: complementary tools (integrations), platforms and marketplaces, creators and educators, communities and meetups, and universities and bootcamps.

Effective outreach:
- **Research first:** understand their audience and what they need.
- **Lead with their benefit:** what does the partnership give *them* and their community?
- **Be specific:** "a joint tutorial showing X + Y for real-time dashboards" beats "let's collaborate".
- **Start small:** one piece of content or one event, then grow.
- **Follow through:** deliver early and promote generously.

Keep a simple partner tracker (who, status, last contact, next step, outcomes). Relationships compound when maintained.
`,
          takeaways: [
            'Partner where trust already exists',
            'Lead with their benefit; be specific; start small',
            'Track and maintain relationships',
          ],
          resources: [R.peoplePowered, R.devRelBook],
        },
        {
          title: 'Collaborations & Co-Marketing',
          body: `
Co-marketing is joint work with a partner: content, events or launches that serve both audiences.

Formats that work:
- **Joint tutorials** using both products together
- **Co-hosted webinars or livestreams**
- **Integration launches** announced by both sides
- **Hackathon or event sponsorships** with real technical involvement
- **Creator collaborations:** paid or unpaid work with trusted developer creators (always disclosed)

Make it work: agree on goals, audiences, responsibilities, timeline, promotion commitments and how you'll share results **before** starting. The best collaborations are genuinely useful to developers even if they never use either product.
`,
          takeaways: [
            'Joint content should be useful on its own merits',
            'Agree on goals, roles and promotion up front',
            'Always disclose paid collaborations',
          ],
          resources: [R.devMarketingDoesNotExist, R.vidDuVanderContent],
        },
        {
          title: 'Education & Certification Programs',
          body: `
Structured education such as courses, learning paths, certifications and workshops drives **deep adoption at scale**. Developers who've learned your product thoroughly build more with it and recommend it.

Program design:
- **Start from outcomes:** what should learners be able to do? Tie it to real use cases.
- **Learning paths:** sequence content from beginner to advanced, with hands-on labs.
- **Assessment:** quizzes and practical projects; certifications if they carry real value (employers recognise them).
- **Delivery:** self-paced online, live cohorts, workshops and partner-delivered training.
- **Measure business outcomes:** product usage after completion, retention of certified users and support tickets.

Linda Ikechukwu's Strategy Room session is an excellent deep dive on connecting developer education to business results. This roadmap is itself an example of a learning path.
`,
          takeaways: [
            'Design from learner outcomes and real use cases',
            'Hands-on labs and meaningful assessment',
            'Measure product outcomes, not just completions',
          ],
          resources: [webinar('03'), R.googleTechWriting, R.githubSkills],
        },
        {
          title: 'Developer Advocacy as a Growth Channel',
          body: `
To be treated as a growth channel, DevRel has to show **contribution to sign-ups, activation and revenue**, while protecting the trust that makes it work.

Approaches:
- **Attribution:** UTMs, referral codes, dedicated landing pages and self-reported attribution.
- **Influenced vs sourced:** "sourced" = first touch was DevRel; "influenced" = DevRel touched the journey. Report both honestly.
- **Cohort comparisons:** do DevRel-sourced developers activate and retain better? They often do, which is a powerful argument.
- **Developer Qualified Leads:** some teams define signals (e.g. active usage in a company account) that indicate readiness for a sales conversation.
- **Guardrails:** don't let lead targets turn community spaces into sales channels.

Ace Abati's Strategy Room session makes the case that word of mouth is the best developer marketing. Measure it where you can, and protect it always.
`,
          takeaways: [
            'Report sourced and influenced impact honestly',
            'Compare DevRel cohorts’ activation and retention',
            'Guard community trust from sales pressure',
          ],
          resources: [webinar('06'), R.vidMarketingMetrics, R.businessValueDevRel],
        },
      ],
      resources: [R.devMarketingDoesNotExist, webinar('06'), webinar('03'), R.vidDuVanderMarketing],
      challenge: {
        title: 'Design a developer education path',
        prompt: `
Design a short learning path (3–5 modules) that takes developers from zero to a real outcome with a product or technology of your choice. Include learning objectives, a hands-on lab per module and how you'd measure success. Publish it as a doc or post.
`,
        template: `\`\`\`markdown
# Learning path: <outcome> with <product>

**Audience:** <who> · **Prerequisites:** <...> · **Time:** <hours>

## Module 1 — <title>
- Objective: learners can <verb> ...
- Lesson: <link/outline>
- Lab: <hands-on task>
- Check: <quiz / proof>

## Module 2 — ...

## Capstone project
<a real project that combines the modules>

## Success metrics
- Completion rate
- % of completers active in product 30 days later
- Support tickets from completers vs non-completers
\`\`\``,
      },
    },

    // ────────────────────────────────────────────────────────────────────────
    {
      groupId: 'strategy-programs',
      question: 'How do you build, lead and scale a DevRel function?',
      overview: `
This module is the bridge from practitioner to leader. It covers building a program, setting goals, turning insight into influence, collaborating across the company, hiring, prioritising and scaling your impact through advocacy programs.
`,
      topics: [
        {
          title: 'Building a DevRel Program',
          body: `
Building a DevRel function from zero starts with **company goals**, not tactics.

1. **Understand the business:** company goals, target developers, product maturity and go-to-market motion. Interview leaders in product, engineering, marketing and sales.
2. **Write a mission:** one sentence connecting developers' success to company success.
3. **Pick a focus:** you can't do everything. Early-stage products often need DX and content; mature products may need community and advocacy programs.
4. **Define metrics** (North Star plus supporting) and a reporting cadence.
5. **Plan resources:** people, budget (events, tools, swag, travel) and dependencies.
6. **Run a 90-day plan:** quick wins to build trust, one foundational program and a first report.

Present it as a strategy doc with clear asks. Mary Thengvall's advice, *"first, understand the company goals"*, is the most important step.
`,
          takeaways: [
            'Start from company goals and stakeholder interviews',
            'Focus: pick what the product stage needs most',
            'Mission, metrics, resources, 90-day plan',
          ],
          resources: [R.vidThengvallCompanyGoals, R.businessValueDevRel, R.devRelBook, webinar('05')],
        },
        {
          title: 'DevRel OKRs & Goal Setting',
          body: `
**OKRs** (Objectives and Key Results) connect ambitious objectives to measurable results.

- **Objective:** qualitative and inspiring. "Make our platform the easiest way for Python developers to add real-time features."
- **Key results:** 2–4 measurable outcomes. "Reduce Python time-to-hello-world from 15 to 5 minutes", "Increase 30-day retention of Python sign-ups from 20% to 30%", "Grow member-answered community questions from 30% to 50%".

Good DevRel OKRs:
- Are **outcomes, not activities** ("give 10 talks" is a task, not a key result)
- **Ladder up** to company OKRs visibly
- Mix **leading** indicators (you can influence now) and **lagging** ones (business results)
- Are **few**: 2–3 objectives per quarter

Review progress monthly, grade at quarter end and learn. *Measure What Matters* and John Doerr's TED talk are the canonical introductions.
`,
          takeaways: [
            'Objectives inspire; key results measure outcomes',
            'Ladder to company OKRs; avoid activity-based KRs',
            'Few, reviewed monthly, graded quarterly',
          ],
          resources: [R.measureWhatMatters, R.vidDoerrOkrs, R.northStar],
        },
        {
          title: 'Insights & Recommendations',
          body: `
Senior DevRel turns developer and community data into **strategic recommendations** executives can act on.

The shape of a strong insight:
- **Observation:** what you see ("40% of churned trial accounts never created a second project")
- **Evidence:** data plus developer quotes
- **Interpretation:** why it's happening
- **Implication:** why it matters to the business
- **Recommendation:** what to do, with options and trade-offs

Deliver insights regularly (a quarterly "state of the developer" report works well) and target the right audience: product for roadmap, marketing for positioning, leadership for strategy. Over time, being the person with the best understanding of developers makes you a strategic partner rather than a service function.
`,
          takeaways: [
            'Observation → evidence → interpretation → implication → recommendation',
            'Publish a regular "state of the developer" report',
            'Become the company’s expert on developers',
          ],
          resources: [R.vidThengvallCompanyGoals, R.storytellingWithData, R.momTest],
        },
        {
          title: 'Cross-functional Collaboration',
          body: `
DevRel depends on other teams to succeed, and rarely has authority over them. **Influence without authority** is the core senior skill.

Relationships to build:
- **Product:** feedback loops, roadmap input and launch planning
- **Engineering:** technical accuracy, SDKs, docs contributions and bug escalation
- **Marketing:** positioning, campaigns, events and content distribution
- **Sales and success:** customer insights, technical enablement and developer-qualified signals
- **Support:** common issues, docs gaps and community routing

How to influence:
- Understand each team's goals and pressures; frame your asks in their terms.
- Give before you ask: share insights, help with launches, make their work easier.
- Make it easy to say yes: clear, small, well-evidenced requests.
- Establish rituals: monthly syncs and shared dashboards.
`,
          takeaways: [
            'Map each team’s goals and frame asks in their terms',
            'Give before you ask',
            'Small, evidenced requests and regular rituals',
          ],
          resources: [R.crucialConversations, R.managersPath, R.vidScalingTeam],
        },
        {
          title: 'Hiring & Building a DevRel Team',
          body: `
Hiring well is the highest-leverage thing a DevRel leader does.

- **Hire for the strategy:** match roles to your priorities (DX engineer, community lead, educator, advocate).
- **Write clear JDs:** outcomes the person will own, the skills required vs nice-to-have and who they'll work with. Avoid "rockstar" and unicorn lists.
- **Interview for real work:** a portfolio review, a short technical exercise (explain an API, review a doc), a presentation, and a community scenario.
- **Evaluate:** technical credibility, communication, empathy, judgment and self-direction.
- **Onboard deliberately:** a 30-60-90 plan, stakeholder introductions and early wins.
- **Grow people:** career ladders with clear expectations per level, regular feedback, and sponsorship for speaking and visibility.

Diversity matters practically: a team that reflects the developer community reaches more of it.
`,
          takeaways: [
            'Hire roles that match your strategy',
            'Interview with realistic work samples',
            'Onboard with a 30-60-90 plan and build career ladders',
          ],
          resources: [R.managersPath, R.vidScalingTeam, R.devRelBook],
        },
        {
          title: 'Execution & Prioritization',
          body: `
DevRel attracts endless requests: "Can you speak at this?", "Can you write a post about that?", "Can you join this call?". Without ruthless prioritisation, you'll be busy and ineffective.

Tools:
- **Impact vs effort:** score requests; say yes to high impact and low effort, plan high/high, decline low impact.
- **Strategy filter:** "Does this serve our OKRs?" If not, the answer is usually no, or later.
- **Intake process:** a simple request form with goal, audience, deadline and success measure. It makes trade-offs visible.
- **Capacity planning:** reserve time for planned programs, reactive work and learning.
- **Saying no well:** "Not this quarter, because we're focused on X. Here's what would change that."

Ship consistently. A predictable rhythm of good work builds more trust than occasional heroics.
`,
          takeaways: [
            'Filter everything through strategy and impact vs effort',
            'Use an intake process to make trade-offs visible',
            'Say no clearly, with reasons and alternatives',
          ],
          resources: [R.linearMethod, R.measureWhatMatters],
        },
        {
          title: 'Continuous Learning & Trend Tracking',
          body: `
Technology, developer behaviour and the DevRel profession all change quickly. AI-assisted development, for example, is changing how developers discover and learn tools.

Build a learning system:
- **Curated inputs:** DevRel Weekly, industry newsletters, the Stack Overflow survey and your ecosystem's release notes.
- **Communities:** DevRel communities, DevRelCon and local meetups.
- **Hands-on time:** build with new tools monthly; your credibility depends on it.
- **Reflection:** a short monthly note on what changed, what it means for your developers and what you'll try.
- **Share it:** turn your learning into content, which reinforces it and helps others.

Block time on your calendar for learning. If it's not scheduled, it won't happen.
`,
          takeaways: [
            'Curate inputs; don’t drown in them',
            'Build with new tools monthly',
            'Schedule learning time and share what you learn',
          ],
          resources: [R.devrelWeekly, R.soSurvey, R.devRelChannel, webinar('02')],
        },
        {
          title: 'Active Listening & Community Sensing',
          body: `
Senior practitioners develop a **sense** for what developers are feeling, often before the data shows it.

Practices:
- **Listen more than you post:** read community channels, forums, social media and competitor communities daily.
- **Hallway conversations:** at events, ask open questions ("What's the hardest part of your week?") and listen.
- **Pattern tracking:** keep a running log of recurring themes, frustrations and excitement.
- **Sentiment reviews:** periodically summarise the mood in your community and ecosystem for your team.
- **Watch the edges:** new communities, emerging tools and where early adopters are moving.

Translate what you hear into strategic signal: "Developers are increasingly asking about X. Competitors have started Y. I recommend Z."
`,
          takeaways: [
            'Listen daily across your and adjacent communities',
            'Log recurring themes and sentiment',
            'Turn listening into strategic recommendations',
          ],
          resources: [R.momTest, R.artOfCommunity, R.vidJonoLessons],
        },
        {
          title: 'Advocacy Programs',
          body: `
Champion, ambassador and MVP programs turn your most engaged developers into an **extension of your team**, multiplying reach far beyond headcount.

Design:
- **Purpose:** what do you need (content, local events, community answers, product feedback), and what do champions get (recognition, early access, growth, community, swag, travel)?
- **Criteria:** clear, public criteria for joining, based on contributions not follower counts.
- **Tiers:** optional levels that reward sustained contribution.
- **Support:** onboarding, a private community, regular calls, content and speaking support, and direct lines to product.
- **Expectations:** light and flexible. These are volunteers.
- **Measurement:** champion-created content, events, answers and influenced sign-ups, plus champion satisfaction and retention.

Good programs are relationships, not transactions. Invest in champions' growth and they'll invest in your community.
`,
          takeaways: [
            'Clear value exchange for champions and for you',
            'Public, contribution-based criteria',
            'Support and invest in champions’ growth',
          ],
          resources: [R.vidChampions, R.vidChampionProgram, R.vidJonoLeaders, R.peoplePowered],
        },
      ],
      resources: [R.businessValueDevRel, R.devRelBook, R.measureWhatMatters, R.managersPath, webinar('05'), R.vidScalingTeam],
      challenge: {
        title: 'Write a DevRel strategy for a company',
        prompt: `
Write a DevRel strategy document for a real or hypothetical developer company. Include mission, focus, OKRs, programs, team, budget and a 90-day plan. This is the capstone of the roadmap, and exactly the kind of document you'd present when interviewing for a senior or lead role.
`,
        template: `\`\`\`markdown
# DevRel strategy: <company>

## 1. Context
Company goals · target developers · product stage · go-to-market

## 2. Mission
<One sentence connecting developer success to company success.>

## 3. Focus areas (and what we won't do)
1. ...
2. ...
Not now: ...

## 4. OKRs (next two quarters)
**O1:** ...
- KR1 ...
- KR2 ...

## 5. Programs
| Program | Journey stage | Owner | Success metric |
|---|---|---|---|

## 6. Team & budget
Roles to hire (in order) · budget by category

## 7. Stakeholders & rituals
Who we partner with and how often

## 8. 90-day plan
Days 1–30: listen & quick wins
Days 31–60: launch foundation program
Days 61–90: first impact report

## 9. Risks & mitigations
\`\`\``,
      },
    },
  ],
}
