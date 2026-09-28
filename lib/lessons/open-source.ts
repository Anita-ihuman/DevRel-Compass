import type { PhaseLesson } from './types'
import { R } from './resources'

export const openSource: PhaseLesson = {
  phaseId: 'open-source',
  duration: '4–6 weeks at 5 hours a week',
  outcomes: [
    'Make meaningful contributions to open source projects — code, docs and triage',
    'Maintain a healthy repository: issues, labels, good first issues and reviews',
    'Explain common governance models and open source licenses to developers and colleagues',
    'Advise on when and how a company should open source something — and how to sustain it',
  ],
  intro: `
Open source is where developers learn, collaborate and build their reputations. Most modern software depends on it, and many developer communities form around it. For DevRel, open source is both a **skill** (contributing, maintaining) and a **strategy** (using openness to build trust, adoption and community).

Nadia Eghbal's *Working in Public* describes an important shift: many popular projects now have large numbers of users but very few maintainers. The bottleneck isn't contributions; it's **maintainer attention**. Good DevRel in open source makes maintainers' lives easier. It triages, documents, onboards contributors well and never floods projects with low-effort PRs.

This phase covers the full picture, from your first pull request to company open source strategy, governance and licensing.
`,
  modules: [
    {
      groupId: 'oss',
      question: 'How do you participate in — and help sustain — open source?',
      overview: `
Start as a contributor, learn how maintainers think, then learn the strategy and legal context. By the end you should be comfortable making contributions, running a small project, and advising a team on open source decisions.
`,
      topics: [
        {
          title: 'Contributing Code & Documentation',
          body: `
Contributions don't have to be code. **Docs fixes, examples, tests, bug reproductions and translations** are often the most valuable, and the easiest place to start.

A respectful contribution workflow:
1. **Read CONTRIBUTING.md and the code of conduct.** Follow the project's conventions.
2. **Find or open an issue first** for anything beyond a typo, and confirm the change is wanted.
3. **Fork, branch, make a small, focused change.** One concern per PR.
4. **Test it** and follow formatting and lint rules.
5. **Write a clear PR description:** what, why, how tested, and a link to the issue.
6. **Respond to review graciously** and promptly. Reviews are how you learn the codebase.

Never open low-effort or AI-generated "drive-by" PRs to farm contributions. Maintainers notice, and it harms both the project and your reputation.
`,
          takeaways: [
            'Docs, tests and reproductions are valuable contributions',
            'Read CONTRIBUTING, discuss first, keep PRs small',
            'Respect maintainers’ time — no low-effort drive-by PRs',
          ],
          resources: [R.osgHowToContribute, R.firstContributions, R.vidOssBeginners, R.githubPRDocs],
        },
        {
          title: 'Issues & Pull Request Management',
          body: `
On the maintainer side, issues and PRs are the project's front door. How they're handled signals whether contributions are welcome.

Good practices:
- **Issue templates** for bugs and features (versions, reproduction and expected vs actual).
- **PR templates** with a checklist (tests, docs, changelog).
- **Timely first response,** even just "Thanks, we'll look at this this week". Silence is the top reason contributors don't return.
- **Kind, specific reviews:** explain the why, suggest rather than demand, and praise what's good.
- **Automation:** CI checks, linting, bots for stale issues (use carefully) and CODEOWNERS for routing.
- **Saying no well:** explain why, thank them, and suggest alternatives.

DevRel practitioners often help by being the first responder on issues and PRs, making maintainers' lives easier.
`,
          takeaways: [
            'Templates and CI set clear expectations',
            'A fast first response keeps contributors coming back',
            'Review kindly and specifically; say no gracefully',
          ],
          resources: [R.osgBestPractices, R.githubIssuesDocs, R.githubPRDocs],
        },
        {
          title: 'Labelling, Cleanup & Triage',
          body: `
A tidy issue tracker is a **public signal of project health**. An overgrown one tells people the project is abandoned, even when it isn't.

Triage practices:
- **Label consistently:** type (bug, feature, docs, question), area, priority and status (needs-repro, needs-info, accepted), plus "good first issue" and "help wanted".
- **Regular triage sessions:** weekly, work through new issues: reproduce, label, deduplicate and route.
- **Close with care:** stale, duplicate or out-of-scope issues get a kind explanation and a link.
- **Move questions to Discussions** or forums so issues stay actionable.
- **Milestones or projects** to show what's planned.

Triage is one of the best ways to contribute to a project you care about, and to learn it deeply. Many maintainers started as triagers.
`,
          takeaways: [
            'A tidy tracker signals a healthy project',
            'Consistent labels and weekly triage sessions',
            'Close kindly; move questions to Discussions',
          ],
          resources: [R.githubLabelsDocs, R.osgBestPractices, R.githubDiscussionsDocs],
        },
        {
          title: 'Good First Issues',
          body: `
Good first issues are the **onboarding ramp** for new contributors. Done well, they turn users into contributors; done badly, they frustrate everyone.

A good "good first issue":
- Is **small and well-scoped:** achievable in a few hours
- Includes **context:** what's wrong, where in the code to look and what "done" means
- Links to **setup instructions** and relevant docs
- Has a **mentor**: someone who'll respond to questions and review quickly
- Is **genuinely useful**, not busywork

Keep a steady supply, label them consistently (so sites like goodfirstissue.dev find them), and consider reserving some for first-time contributors only. Celebrate first contributions publicly; it's powerful recognition.
`,
          takeaways: [
            'Small, scoped, with context and a clear definition of done',
            'Assign a responsive mentor',
            'Celebrate first contributions publicly',
          ],
          resources: [R.goodFirstIssue, R.firstContributions, R.osgBuildingCommunity],
        },
        {
          title: 'Open Source Governance Models',
          body: `
Governance defines **who makes decisions and how**. It matters most when people disagree or when a project outgrows its founders.

Common models:
- **BDFL (Benevolent Dictator For Life):** one person has final say. Simple, and common in early projects.
- **Meritocracy / committers:** contributors earn commit rights and decision power through sustained contribution (the Apache model).
- **Liberal contribution / consensus:** decisions are made by the people doing the work, via consensus or voting.
- **Company-led:** a single company controls direction. Transparency about this matters for trust.
- **Foundation-hosted:** a neutral foundation (Apache, CNCF, OpenJS, Linux Foundation) holds trademarks and provides governance processes, which signals neutrality to other companies.

Document governance in a GOVERNANCE.md: roles, how decisions are made, how people gain and lose roles, and how conflicts are resolved.
`,
          takeaways: [
            'BDFL, meritocracy, consensus, company-led and foundation models',
            'Foundations signal neutrality to other contributors',
            'Document governance before you need it',
          ],
          resources: [R.osgLeadership, R.apacheHowItWorks, R.cncfProjects, R.producingOSS],
        },
        {
          title: 'Open Source Strategy for Companies',
          body: `
Companies open source software for different reasons, and the reason should shape how they do it:

- **Adoption:** remove barriers so developers try and embed the technology (open core, SDKs, CLIs)
- **Ecosystem:** create a standard others build on
- **Recruiting and brand:** show engineering quality and culture
- **Collaboration:** share maintenance of commodity infrastructure with others
- **Trust and transparency:** let users inspect security-sensitive code

Key questions before open sourcing: What's the goal and how will you measure it? Who will maintain it long-term? What's the business model (open core, hosted service, support)? What license? Will you accept outside contributions?

Many companies run an **OSPO** (Open Source Program Office) to handle policy, compliance and strategy. The TODO Group publishes excellent OSPO guides. DevRel often partners with the OSPO on community and adoption.
`,
          takeaways: [
            'Know the goal: adoption, ecosystem, brand, collaboration or trust',
            'Plan maintenance, business model and license up front',
            'OSPOs coordinate company open source — partner with them',
          ],
          resources: [R.todoGroup, R.workingInPublic, R.osgBestPractices],
        },
        {
          title: 'Sustaining Contributors',
          body: `
Attracting a first contribution is easy compared to **keeping contributors engaged for years**. Maintainer burnout is one of open source's biggest risks.

What sustains people:
- **Recognition:** credit in release notes, all-contributors tables, shout-outs and contributor spotlights.
- **Growth paths:** from contributor to reviewer to maintainer, with clear criteria.
- **Community:** contributor calls, chat channels and summits. People stay for people.
- **Reducing toil:** automation, templates, good docs and triage help.
- **Funding:** GitHub Sponsors, Open Collective, company-paid maintainer time and grants.
- **Respecting boundaries:** normalise stepping back; plan succession.

As DevRel, you can champion contributors inside your company: advocating for paid maintainer time, sponsorships and recognition programs.
`,
          takeaways: [
            'Recognition, growth paths and community keep people',
            'Automation and triage help reduce maintainer toil',
            'Advocate for funding and paid maintainer time',
          ],
          resources: [R.workingInPublic, R.vidEghbal, R.osgBestPractices],
        },
        {
          title: 'Licensing & Legal Basics',
          body: `
You don't need to be a lawyer, but you do need to explain licenses accurately, and know when to call a lawyer.

The main families:
- **Permissive** (MIT, Apache 2.0, BSD): use, modify and redistribute, including in proprietary software, with attribution. Apache 2.0 adds an explicit patent grant.
- **Copyleft** (GPL, AGPL, LGPL, MPL): derivatives must be released under the same license when distributed (AGPL extends this to network use). Strength varies. LGPL and MPL are weaker copyleft.
- **Source-available** (BSL, SSPL, Elastic License): code is visible but with restrictions, often on competing hosted services. These are **not** OSI-approved open source licenses, and changes to them can upset communities.

Other essentials: a **CLA or DCO** for contributions, **trademark** policy separate from code license, and checking **dependency licenses** for compatibility. Use choosealicense.com and the OSI list, and involve legal counsel for company decisions.
`,
          takeaways: [
            'Permissive vs copyleft vs source-available — know the differences',
            'Source-available licenses are not OSI open source',
            'CLAs/DCOs, trademarks and dependency licenses matter; involve legal',
          ],
          resources: [R.chooseALicense, R.osiLicenses, R.osgLegal, R.vidLicenses],
        },
        {
          title: 'Open Source as DevRel Leverage',
          body: `
Done well, open source is one of DevRel's most powerful levers:

- **Credibility:** contributions are public proof that you build and understand the ecosystem.
- **Relationships:** maintainers and contributors become peers, collaborators and advocates.
- **Integrations:** contributing integrations to popular projects puts your product where developers already work.
- **Content:** real-world contributions become talks, posts and case studies.
- **Feedback:** issues and discussions are unfiltered signal about developer needs.

The key is **giving before taking**. Contribute to the ecosystem your developers use, not only your company's repos. Sponsor maintainers, fix docs and help triage. The trust you build is what makes your company's projects welcome later.
`,
          takeaways: [
            'Public contributions are proof of credibility',
            'Integrations put you where developers already work',
            'Give before taking — contribute to the wider ecosystem',
          ],
          resources: [R.vidHightowerAdvocacy, R.openSourceGuides, R.workingInPublic],
        },
      ],
      resources: [R.openSourceGuides, R.workingInPublic, R.producingOSS, R.chooseALicense, R.todoGroup, R.chaoss],
      challenge: {
        title: 'Land your first meaningful open source contribution',
        prompt: `
Get a pull request merged into an open source project you (or your target audience) use. Docs, tests, examples or code all count, as long as it's genuinely useful. Then write a short post about the experience: how you found the issue, what you learned and how the maintainers helped.
`,
        template: `\`\`\`markdown
## PR description template

**What:** <one-line summary of the change>
**Why:** Fixes #<issue> — <the problem it solves>
**How:** <approach, any trade-offs>
**Testing:** <how you verified it — commands, screenshots>
**Checklist:**
- [ ] Follows CONTRIBUTING.md
- [ ] Tests added/updated
- [ ] Docs updated

— — —

## Post: "My first contribution to <project>"
- How I chose the project and issue
- Getting set up (what was hard)
- The change and the review
- What I learned
- Link to the merged PR
\`\`\``,
      },
    },
  ],
}
