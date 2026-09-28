import type { PhaseLesson } from './types'
import { R } from './resources'
import { webinar } from './webinars'
import { ENTRY_PATHS } from '@/lib/constants'

// One section per background, straight from the entry-path data.
const entryPathSections = ENTRY_PATHS.map(
  (p) => `### ${p.icon} From ${p.from}
*${p.timeline}*

${p.description}

**Skills to bridge:** ${p.bridgeSkills.join(' · ')}`,
).join('\n\n')

export const foundation: PhaseLesson = {
  phaseId: 'foundation',
  duration: '3–4 weeks at 5 hours a week',
  outcomes: [
    'Explain what Developer Relations is, why companies fund it, and how it differs from marketing',
    'Name the main DevRel roles and pick the one that fits your background',
    'Describe how reporting lines shape what a DevRel team is measured on',
    'Build and explain a small demo against a real API, using Git and GitHub like a working developer',
    'Speak credibly about cloud deployment, issue tracking, and the tools your audience uses every day',
  ],
  intro: `
Developer Relations sits between a company and the developers who use its product. Developers trust other developers, not ads, so a company that wants developers to adopt its API, SDK, database or platform needs people who can **teach, build and listen** in public. That is the job.

The simplest working definition comes from Mary Thengvall: DevRel is *the umbrella term for the strategies and tactics that build relationships with developers*. The relationship runs both ways. You bring the product to developers through content, talks, docs and community. You also bring developers back to the company, turning their friction, feature requests and bug reports into signal that product and engineering can act on. The second half is the one beginners forget, and it is what separates DevRel from promotion.

This phase gives you two foundations:

1. **A clear model of the function.** Where it came from, the roles inside it, why companies pay for it, and how the org chart changes what "good" looks like. Without this you will say yes to everything and get measured on the wrong things.
2. **A technical baseline.** You don't need to be a staff engineer, but you do need to build a working demo, read someone else's code, open a pull request and talk about deployment without bluffing. Developers notice immediately when someone doesn't really get it, and credibility is the currency of this whole career.

If you come from engineering, the first module will be new and the second will be review. If you come from marketing, writing or community work, it's the other way round. Either way, finish both before moving on. Every later phase assumes them.
`,
  modules: [
    // ────────────────────────────────────────────────────────────────────────
    {
      groupId: 'what-is-devrel',
      question: 'What is Developer Relations, and why do companies pay for it?',
      overview: `
Before you can do DevRel well, you need to be able to explain it, to a hiring manager, to your future boss, and to the engineer who thinks it's "marketing with hoodies". This module covers the history, the roles, the business case, the mindset, the line between DevRel and marketing, and the way org structure shapes all of it.

By the end you should be able to answer, in two sentences each: *What does DevRel do? Who is it for? How do you know it's working?*
`,
      topics: [
        {
          title: 'History & Evolution of DevRel',
          body: `
DevRel didn't start as a job title. It grew out of a problem: platforms only succeed when developers build on them.

**The evangelist era (1980s–2000s).** Apple hired "software evangelists" in the 1980s to convince developers to build Macintosh applications. Guy Kawasaki made the title famous. Microsoft, Sun Microsystems (Java) and later Google built large evangelism teams. The model was mostly one-way: travel, give keynotes, win developers over to a platform.

**The API economy (late 2000s–2010s).** Twilio, Stripe, SendGrid and others sold *directly to developers*. A developer could sign up with a credit card and ship in an afternoon, so developer experience *was* the sales funnel. Twilio's "developer evangelist" team became a template: engineers who wrote code in public, answered questions, and treated time-to-first-API-call as a core metric.

**Open source and foundations (2010s).** The rise of GitHub, the CNCF (Kubernetes) and company-backed open source pulled DevRel toward community building and contributor programs. Roles split into advocacy, community, documentation and developer experience.

**Measurement and maturity (late 2010s–now).** As teams grew, executives asked the hard question: *what are we getting for this?* Books like *The Business Value of Developer Relations* (2018) and *Developer Relations* by Lewko and Parton (2021) pushed the field toward strategy, metrics and journey thinking. AI tooling is now reshaping how developers discover and learn products, which puts even more weight on docs, examples and trust.

**Why it matters for you:** each era left behind expectations that still exist. Some companies still want keynote evangelists; others want DX engineers who fix onboarding. Knowing the history helps you read a job description and see which era it's hiring for.
`,
          takeaways: [
            'DevRel began as platform evangelism and evolved toward two-way relationships and measurable outcomes',
            'Developer-first API companies made developer experience a revenue driver',
            'Job descriptions often reveal which "era" of DevRel a company believes in',
          ],
          resources: [R.vidThengvallBusinessValue, R.businessValueDevRel, R.vidThengvallTrends],
        },
        {
          title: 'Types of DevRel Roles',
          body: `
"DevRel" covers a family of roles. When you search for DevRel jobs, postings fall into seven broad categories. They overlap, and titles are inconsistent between companies, so read each posting for the **work and the metrics**, not the title. Here's how they compare.

### At a glance

| Category | Core output | Typical metric | Closest background |
|---|---|---|---|
| Developer Advocate | Content, talks, demos, feedback | Reach and activation influenced | Engineering |
| Developer Relations | Programs, strategy, team | Adoption and community health | Any, plus experience |
| Developer Education | Courses and learning paths | Learner outcomes, product usage | Teaching, writing |
| Technical Writer | Documentation | Docs success, ticket deflection | Writing, support |
| Developer Marketing | Launches and campaigns | Sign-ups and pipeline | Marketing |
| Community Manager | Healthy community spaces | Activation and retention | Community |
| Developer Experience | Friction removed from the product | Time-to-hello-world | Engineering |

One more label you'll see: **Developer Success / Solutions** roles help specific customers succeed with the product. They sit closer to sales and support, but they're a common stepping stone into DevRel.

### Where to start
Early in your career, pick the category closest to your current strengths and add adjacent skills from there. An engineer usually starts as an advocate or DX engineer, a writer in docs or education, and a community organiser in community. Seniority means covering more of the table, not switching categories every year.

### Reading a job posting
- **Look at the metrics and the reporting line.** "Pipeline" and "MQLs" point to a marketing-led role, "roadmap" and "activation" to a product-led one.
- **Check the split.** A posting that asks for content, community, docs, events *and* SDKs is a generalist DevRel role. That's great for learning, but ask what matters most.
- **Ask what success looks like at six months.** A clear answer means the role is well defined.
`,
          takeaways: [
            'DevRel jobs fall into seven categories that overlap — read postings for the work and metrics, not the title',
            'Start in the category nearest your current strengths, then expand into adjacent skills',
            'Metrics and reporting lines reveal what a role will really be judged on',
          ],
          resources: [R.vidThengvallWhatIsDevRel, R.developerAdvocateBook, R.devRelBook, R.devMarketingDoesNotExist, R.docsForDevelopers],
        },
        {
          title: 'Where DevRel Practitioners Come From',
          body: `
DevRel is one of the most interdisciplinary roles in tech. Almost nobody starts their career in it. People **move in from a neighbouring role**, and the one you come from decides which strengths you already have and which gaps you need to close.

There is no "best" background. Hiring managers look for technical credibility, clear communication and genuine care for developers. Every path below can get you there, just from a different starting point.

${entryPathSections}

### How to use this
1. **Find your starting point.** If you straddle two, pick the one your last role was closest to.
2. **Lean into your strength.** It's your differentiator. An engineer-turned-advocate and a writer-turned-advocate are valuable for different reasons.
3. **Close one gap at a time.** Use the bridge skills above as your first goals, and use this roadmap's Compass Challenges as proof you've closed them.
4. **Do DevRel work in your current role.** Internal docs, demos, lunch-and-learns and answering questions in community channels all count as experience.
`,
          takeaways: [
            'Most people move into DevRel from a neighbouring role — there is no single "right" background',
            'Each background brings a different strength and a different gap to close',
            'Start with your strength, then close gaps one at a time with public, visible work',
          ],
          resources: [R.developerAdvocateBook, R.learnInPublic, R.vidHightowerAdvocacy],
        },
        {
          title: 'Importance of DevRel',
          body: `
Companies fund DevRel because **developers adopt tools differently from other buyers.** They try before they buy, they distrust sales pitches, and they decide based on docs, examples and what peers recommend. That creates a few business outcomes DevRel is uniquely placed to move:

- **Awareness with credibility.** A tutorial that solves a real problem reaches developers in a way an ad never does.
- **Activation.** Good onboarding, samples and docs shorten the time from sign-up to "it works", which is where most developer products lose people.
- **Retention and expansion.** Developers who feel supported, and part of a community, stay and bring their teams.
- **Product feedback.** DevRel hears unfiltered developer pain every day. Channelled well, that becomes a competitive advantage for the product team.
- **Hiring and brand.** A strong developer community makes engineers want to work for you.

The trap is that these outcomes are **lagging and indirect**. A talk today may lead to a sign-up in six months via a colleague's recommendation. That is why DevRel teams that can't articulate their impact get cut in downturns, and why you'll spend a whole phase on analytics later.

Watch Ace Abati's Strategy Room session on why technically excellent products still fail to win developers. It is the clearest argument for why this function exists.
`,
          takeaways: [
            'Developers adopt through trust, trial and peer recommendation — DevRel works on all three',
            'DevRel moves awareness, activation, retention, feedback and employer brand',
            'Impact is indirect and delayed, so you must learn to tell (and measure) the story',
          ],
          resources: [webinar('06'), R.vidThengvallCompanyGoals, R.businessValueDevRel],
        },
        {
          title: 'The DevRel Mindset',
          body: `
Skills can be learned in any order. The mindset is what makes them add up.

**Community first, company second — honestly.** Your job is to help developers succeed, even when the answer is "our product isn't the right fit for this". That honesty is exactly what makes your recommendations trusted when the product *is* the right fit.

**Long-term relationships over short-term wins.** A single viral post fades. Showing up every week in the same community, answering questions and remembering names compounds.

**Advocate in both directions.** You represent developers inside the company just as much as the company to developers. If you only ever carry messages outward, you're doing marketing.

**Teach, don't pitch.** Lead with the problem the developer has, then show the solution. Mention your product where it genuinely helps.

**Build credibility by building.** Ship small demos, contribute fixes, write code in public. You earn the right to have opinions by doing the work.

**Systems over heroics.** Rohit Ghumare's Strategy Room session makes the case that sustainable DevRel is a set of feedback loops, not one person doing everything. Design programs that keep working when you're on holiday.
`,
          takeaways: [
            'Honesty about fit is what makes your recommendations credible',
            'Consistency compounds; heroics burn out',
            'Advocacy runs both ways: developers → company is half the job',
          ],
          resources: [webinar('05'), R.vidHightowerAdvocacy, R.artOfCommunity],
        },
        {
          title: 'DevRel vs Developer Marketing',
          body: `
The two overlap and cooperate, but they're optimised for different things.

| | Developer Relations | Developer Marketing |
|---|---|---|
| **Goal** | Developer success, trust, long-term adoption | Pipeline, launches, awareness at scale |
| **Primary tools** | Tutorials, docs, talks, community, feedback loops | Campaigns, positioning, paid channels, email, launches |
| **Time horizon** | Months to years | Weeks to quarters |
| **Success looks like** | Developers ship with your product and recommend it | Qualified sign-ups and measurable campaign return |
| **Voice** | A practitioner talking to peers | The company talking to its market |

Healthy teams **work together**. Marketing brings reach, positioning and launch discipline. DevRel brings technical credibility, content that developers actually read, and a direct line to community sentiment. Friction starts when DevRel is measured purely on marketing numbers like leads and MQLs, or when marketing co-opts DevRel's community for promotions that erode trust.

A good practical rule: *if a developer would feel sold to, it's marketing, and it should be labelled and handled as marketing.* Adam DuVander's book title makes the point: "developer marketing does not exist" when it doesn't also educate.
`,
          takeaways: [
            'DevRel optimises for trust and developer success; marketing optimises for reach and pipeline',
            'They should collaborate — reach plus credibility beats either alone',
            'Protect community trust: never disguise a promotion as education',
          ],
          resources: [R.devMarketingDoesNotExist, R.vidDuVanderMarketing, webinar('01')],
        },
        {
          title: 'DevRel in Different Org Structures',
          body: `
Where DevRel reports is the single biggest predictor of how it will be measured.

- **Under Marketing.** Budget for events and content is easier to get. Expect metrics like reach, sign-ups and influenced pipeline. Risk: being treated as a content factory and losing technical credibility.
- **Under Product.** Strong feedback loops and influence on the roadmap. Expect metrics like activation, feature adoption and DX improvements. Risk: less budget for community and events.
- **Under Engineering.** Deep technical credibility and access to engineers. Great for DX and SDK work. Risk: public-facing work may be undervalued ("why aren't you shipping features?").
- **Standalone / reporting to the CEO or CTO.** Common in developer-first startups where developers *are* the customer. Maximum flexibility and the most pressure to prove value.

None is "correct". What matters is **alignment**: know your leader's goals and translate your work into them. In an interview, always ask *"Who does DevRel report to, and what are they measured on?"*. The answer tells you what your job really is.
`,
          takeaways: [
            'Reporting line determines metrics, budget and what gets valued',
            'Every structure has a characteristic risk — know yours',
            'Always ask who DevRel reports to and how that leader is measured',
          ],
          resources: [R.devRelBook, R.vidThengvallCompanyGoals, R.vidScalingTeam],
        },
      ],
      resources: [
        R.businessValueDevRel,
        R.devRelBook,
        R.vidThengvallWhatIsDevRel,
        R.devrelWeekly,
        R.devRelChannel,
      ],
      challenge: {
        title: 'Write your DevRel manifesto',
        prompt: `
Write and publish a short post (600–900 words) titled **"What Developer Relations means to me"**. Explain the function in your own words, pick the role you're aiming for and why, and describe how you'd know your work is succeeding.

Publishing matters more than polish. This becomes the first piece of your public portfolio, and hiring managers love seeing how a candidate thinks about the role.
`,
        template: `\`\`\`markdown
# What Developer Relations means to me

## The one-sentence version
DevRel is ... (your definition — in plain words)

## Why companies need it
- Developers adopt tools by ...
- So a company needs people who ...

## The role I'm aiming for
I'm aiming for a ___ role because my background in ___ gives me ___.
The skills I still need to build: ___, ___, ___.

## How I'll know it's working
If I'm doing this job well, within 6 months I'd expect to see ...

## What I'm doing next
This week I'm starting ___. Follow along at ___.
\`\`\``,
      },
    },

    // ────────────────────────────────────────────────────────────────────────
    {
      groupId: 'technical-foundation',
      question: 'How technical do I need to be to be credible with developers?',
      overview: `
You don't need to be the best engineer in the room. You need to be **credible**: able to build a working demo, read and debug other people's code, use the same tools your audience uses, and talk about production without hand-waving.

This module is a checklist of that baseline. If you come from engineering, skim it, find your gaps (cloud? issue triage?) and move on. If you don't, this is the most important module in the roadmap. Budget real time for it and **build things** as you go. Reading about Git is not the same as resolving a merge conflict at 11pm before a talk.
`,
      topics: [
        {
          title: 'Basic Programming Skills',
          body: `
Pick **one language and get genuinely comfortable** before spreading out. For most DevRel roles, JavaScript/TypeScript or Python is the safest choice because they are the most common languages in tutorials, SDKs and developer communities. If your target company's product is Go-, Rust- or Java-centric, follow the audience.

"Comfortable" for DevRel means you can:

- Build a small app from scratch that calls an external API and handles errors
- Read an unfamiliar codebase and find where something happens
- Debug with a debugger or logs rather than guessing
- Write code that is **clear enough to teach from**: good names, small functions, comments that explain *why*
- Install dependencies, manage environment variables and run tests

Your code will be copied by thousands of people, so readability beats cleverness. The best way to learn is to build small, complete projects and explain each one in a short post. You're practising programming and DevRel at the same time.

If you're starting from zero, CS50 builds real fundamentals; freeCodeCamp and The Odin Project are project-based paths into web development.
`,
          takeaways: [
            'Go deep in one language first — usually JavaScript/TypeScript or Python',
            'Aim for "can build, read, debug and teach", not "can pass a hard interview"',
            'Write code that is easy to copy and understand; it will be',
          ],
          resources: [R.cs50, R.freeCodeCamp, R.odinProject, R.pragmaticProgrammer],
        },
        {
          title: 'APIs & SDKs',
          body: `
Most DevRel jobs involve a product that developers integrate through an **API** (a contract for talking to a service over the network) or an **SDK** (a library that wraps that API in a specific language).

Know these cold:

- **HTTP fundamentals:** methods (GET, POST, PUT, PATCH, DELETE), status codes (200, 201, 400, 401, 403, 404, 429, 500), headers and JSON bodies.
- **REST:** resources and URLs, pagination, filtering, idempotency, versioning.
- **Authentication:** API keys, OAuth 2.0 flows, bearer tokens and never committing secrets.
- **GraphQL:** a single endpoint where clients ask for exactly the fields they need. Know when it helps and when it's overkill.
- **Webhooks:** the API calls *you* when something happens, which raises questions of signature verification, retries and idempotency.
- **Rate limits and errors:** what a 429 means, backoff and retries, and reading error payloads.
- **SDKs:** how they hide boilerplate (auth, retries, pagination), and why their ergonomics matter as much as the API's.

You should be able to explore an API with curl or Postman, then build the same thing with the SDK, and **explain the difference** to a beginner. That explanation is the job.
`,
          takeaways: [
            'Know HTTP methods, status codes, auth and error handling by heart',
            'Understand REST, GraphQL and webhooks — and when each fits',
            'Practise explaining raw API calls vs the SDK equivalent',
          ],
          resources: [R.mdnHttp, R.vidApisBeginners, R.postmanLearning, R.graphqlLearn, R.vidGraphql100, R.googleApiDesign],
        },
        {
          title: 'Git & GitHub',
          body: `
Git is how code moves between developers. GitHub (and GitLab, Bitbucket) is where developer communities *live*. You'll use them for sample code, docs, open source contributions and your own portfolio.

The baseline:

- **Everyday Git:** clone, status, add, commit, push, pull, branch, switch, merge, and reading **git log**.
- **Fixing things:** resolving merge conflicts, undoing a commit (revert vs reset), stashing work.
- **Pull requests:** small focused changes, clear descriptions, responding to review graciously.
- **Issues:** writing a reproducible bug report, labelling, linking issues to PRs.
- **Repository hygiene:** README, LICENSE, CONTRIBUTING, .gitignore, and a code of conduct.
- **GitHub features:** Discussions, Actions (basic CI), Releases and Pages.

Your GitHub profile is part of your DevRel resume. A pinned repo with a clean README and a runnable demo says more than a bullet point.
`,
          takeaways: [
            'Everyday Git plus conflict resolution is the non-negotiable minimum',
            'PRs and issues are how you collaborate in public — write them well',
            'Your GitHub profile is a portfolio; curate it',
          ],
          resources: [R.vidGitCrash, R.proGit, R.githubSkills, R.githubPRDocs],
        },
        {
          title: 'IDEs & Developer Tools',
          body: `
Developers can tell within minutes whether someone is at home in a development environment. Live demos and streams make it very obvious.

Get comfortable with:

- **An editor/IDE:** VS Code is the most common; know JetBrains IDEs if your audience is Java/Kotlin. Learn multi-cursor editing, search across files, the integrated terminal, the debugger and extensions.
- **The terminal:** navigating, piping, environment variables, and a package manager (npm/pnpm, pip/uv, Homebrew).
- **Browser devtools:** network tab, console and inspecting requests. Essential for debugging API demos.
- **API clients:** curl, Postman or similar.
- **Containers:** running a Docker image locally.
- **AI coding assistants:** your audience uses them, so know their strengths, their failure modes and how your product shows up in them.

For demos: increase your font size, use a clean theme and profile, hide notifications, and keep your shell history free of secrets.
`,
          takeaways: [
            'Fluency in an editor, terminal and devtools is visible — and it builds trust',
            'Know the tools your audience uses, including AI assistants',
            'Set up a clean, readable "demo profile" before you present',
          ],
          resources: [R.missingSemester, R.vscodeDocs, R.soSurvey],
        },
        {
          title: 'Issue Tracking Systems',
          body: `
Community feedback arrives as issues, forum posts, support tickets and chat messages. DevRel often owns the **triage**: turning noise into well-described, prioritised problems that engineering can act on.

Learn to:

- **Write a great bug report:** environment, versions, steps to reproduce, expected vs actual, minimal code sample.
- **Triage:** reproduce, label (type, area, priority, "good first issue"), deduplicate, close with kindness.
- **Link the loop:** connect community reports to internal tickets, and **tell the reporter** when it ships. This closing step builds enormous goodwill.
- **Use the common tools:** GitHub Issues and Projects for open source; Jira and Linear inside companies.

Good triage is one of the most underrated DevRel skills. It's a direct, visible feedback loop between developers and product.
`,
          takeaways: [
            'A reproducible bug report is a gift to engineering — teach your community to write them',
            'Label, deduplicate and prioritise so signal survives the noise',
            'Always close the loop with the person who reported it',
          ],
          resources: [R.githubIssuesDocs, R.githubLabelsDocs, R.linearMethod],
        },
        {
          title: 'Cloud & Infrastructure Basics',
          body: `
Most developer pain shows up **in production**, not on a laptop. To empathise with it, and to build demos that deploy, you need working cloud literacy.

Cover the concepts first, then one provider:

- **Compute models:** virtual machines, containers, serverless functions, and when each fits.
- **Containers and orchestration:** what Docker solves; what Kubernetes adds (scheduling, scaling, self-healing), and why it's often overkill.
- **Networking basics:** DNS, HTTPS/TLS, load balancers and environment-specific URLs.
- **Config and secrets:** environment variables and secret managers. Never hard-code keys.
- **Databases and storage:** managed Postgres, key-value stores and object storage.
- **Observability:** logs, metrics, traces, and how developers debug a failing deploy.
- **CI/CD:** tests and deploys on every push.

Deploy something real, even tiny, to a cloud platform, break it and fix it. That experience makes your content honest.
`,
          takeaways: [
            'Understand VMs vs containers vs serverless and the trade-offs',
            'Know how config, secrets, logs and deploys work in practice',
            'Deploy and debug something real — it makes your content honest',
          ],
          resources: [R.vidDocker100, R.vidK8s100, R.vidServerless100, R.dockerGetStarted, R.k8sBasics, R.gcpSkillsBoost, R.awsSkillBuilder],
        },
      ],
      resources: [R.missingSemester, R.proGit, R.mdnHttp, R.postmanLearning, R.dockerGetStarted],
      challenge: {
        title: 'Ship a "Hello World" demo developers can run in 5 minutes',
        prompt: `
Build a small, runnable demo that integrates a real API, deploy it, and publish a short walkthrough. The goal is a **time-to-hello-world under five minutes** for someone who has never seen it.

This is a real DevRel deliverable. Sample apps like this are what advocates build every week.
`,
        template: `\`\`\`markdown
# <Project name> — <what it does in one line>

![screenshot or gif](./demo.gif)

## Try it in 5 minutes
1. Get an API key: <link>
2. Clone and install
   git clone <repo> && cd <repo> && npm install
3. Configure
   cp .env.example .env   # add your key
4. Run
   npm run dev   → open http://localhost:3000

## How it works
- \`src/client.ts\` — creates the API client
- \`src/app.ts\` — the one call that matters (explained)

## Common errors
| Error | Why | Fix |
|---|---|---|
| 401 Unauthorized | Missing/invalid key | Check .env |

## Next steps
- <link to the official docs for going further>
\`\`\``,
      },
    },
  ],
}
