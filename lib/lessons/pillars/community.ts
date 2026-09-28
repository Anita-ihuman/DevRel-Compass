import type { SkillModule } from '../types'
import { R } from '../resources'

export const communityBuilding: SkillModule = {
  groupId: 'community-building',
  question: 'How do you build a developer community people actually want to be part of?',
  overview: `
A community is not a Discord server. It's a group of people who **share an identity and help each other**, and your product happens to be the thing they gather around. The server is just where some of that happens.

Healthy communities give members something they can't get alone: answers, recognition, friendships, career opportunities, a chance to shape the product. Your job is to design for that value, protect the culture, and get out of the way as members start leading.

Jono Bacon's *People Powered* offers a useful lens with three community types. **Consumer** communities gather around a product and help each other use it. **Champion** communities have members who actively advocate and create. **Collaborator** communities build the thing together, as in open source. Most developer communities mix all three. Knowing which you are building changes everything that follows.
`,
  topics: [
    {
      title: 'Building a Community from Scratch',
      body: `
Every thriving community started with a handful of people and someone doing things that don't scale.

1. **Define the purpose.** Who is it for, and what will they get? "A place for developers building real-time apps to share patterns and get unstuck" beats "our official community".
2. **Choose one platform** where your audience already is: Discord for real-time and younger audiences, Slack for B2B professionals, GitHub Discussions for open source, Discourse for searchable long-form. Start with one.
3. **Seed it before you launch.** Invite 20–50 people you know personally. Post the first questions yourself. An empty room kills momentum.
4. **Be the most active member** for the first months. Welcome every new person by name. Answer fast.
5. **Create rituals.** Weekly show-and-tell, office hours, a "what are you building" thread. Rhythm creates habit.
6. **Find your first leaders.** Notice who helps others and give them recognition, then responsibility.

*Get Together* (Stripe Press) is a short, excellent guide to this early stage.
`,
      takeaways: [
        'Start with a clear purpose and one platform',
        'Seed with people you know; never launch an empty room',
        'Rituals create habit; early helpers become leaders',
      ],
      resources: [R.getTogether, R.peoplePowered, R.vidDiscordWorkshop],
    },
    {
      title: 'Community Management',
      body: `
Community management is the **daily operating work**: keeping spaces healthy, useful and welcoming.

A typical rhythm:

- **Daily:** read new posts, answer or route questions, welcome new members, act on moderation reports.
- **Weekly:** run rituals (office hours, threads), highlight great contributions, share a digest of top questions with product and docs teams.
- **Monthly:** review health metrics, tidy channels, update the FAQ with recurring questions, thank your volunteers.

Build systems so it scales past you: saved replies for common answers, a routing guide ("billing → support, bugs → GitHub issues"), a moderator rota, and documented escalation paths.

Two traps to avoid: **becoming the help desk**, where you answer everything and members never help each other, and **letting unanswered questions pile up**. The second is the fastest way to signal a dead community. Set a response-time goal, even informally.
`,
      takeaways: [
        'Run on daily/weekly/monthly rhythms',
        'Systematise: saved replies, routing guides, moderator rotas',
        'Enable member-to-member help rather than answering everything yourself',
      ],
      resources: [R.artOfCommunity, R.vidJonoLessons, R.cmx],
    },
    {
      title: 'Community Guidelines & Code of Conduct',
      body: `
A code of conduct (CoC) says what behaviour is expected, what isn't tolerated, how to report problems and what happens next. **It only works if it's enforced, consistently and visibly.**

Essentials:

- **Adopt, don't invent.** The Contributor Covenant is the most widely used template; adapt it to your spaces.
- **Reporting path.** A private way to report (email or form), who receives reports, and what to do if the reported person is a moderator.
- **Enforcement ladder.** Warning → temporary removal → permanent ban, with clear examples.
- **Community guidelines** separate from the CoC. These are practical norms: where to ask what, no DMs to staff for support, how to format code, no self-promotion outside #showcase.
- **Visibility.** Link it in onboarding, pin it and reference it when acting.

Psychological safety is a growth strategy. People who don't feel safe don't ask questions, and communities where nobody asks questions die.
`,
      takeaways: [
        'Adopt a proven CoC (Contributor Covenant) and adapt it',
        'Define a private reporting path and an enforcement ladder',
        'Enforce consistently — an unenforced CoC is worse than none',
      ],
      resources: [R.contributorCovenant, R.osgCoc, R.crucialConversations],
    },
    {
      title: 'Forums & Discussion Platforms',
      body: `
Each platform shapes behaviour differently:

| Platform | Best for | Watch out for |
|---|---|---|
| **Discord** | Real-time chat, events, younger/gaming-adjacent devs | Knowledge disappears into scroll; not indexed by search |
| **Slack** | Professional B2B communities | Message history limits on free plans; feels like work |
| **GitHub Discussions** | Open source projects, Q&A next to the code | Less social; needs a GitHub account |
| **Discourse / forums** | Searchable long-form Q&A, SEO | Slower, feels less alive |
| **Reddit / Stack Overflow** | Meeting developers where they already are | You don't own the space or the rules |

Many teams use **chat for connection and a forum for knowledge**, then regularly move great chat answers into the forum or docs so they're searchable. Also show up where developers already gather, such as relevant subreddits, Stack Overflow tags and other communities, as a helpful member rather than a promoter.
`,
      takeaways: [
        'Platforms shape behaviour — choose by purpose',
        'Pair real-time chat with a searchable knowledge base',
        'Show up in existing communities as a helper, not a promoter',
      ],
      resources: [R.githubDiscussionsDocs, R.vidDiscordWorkshop, R.osgBuildingCommunity],
    },
    {
      title: 'Meetups & Local Events',
      body: `
In-person and virtual meetups turn usernames into relationships. People who've met are far more likely to help each other, contribute and stay.

Running a good meetup:

- **Format:** 1–2 short talks (15–20 min), a demo or lightning talks, and plenty of unstructured time. Networking is the point.
- **Speakers:** mix community members with occasional experts. First-time speakers are gold; offer coaching.
- **Logistics:** venue (partner offices are often free), food, accessibility, a clear agenda and a code of conduct.
- **Promotion:** Meetup, Luma or your community channels, plus partners. Remind people 24 hours before; expect 40–60% of free RSVPs to attend.
- **Follow-up:** slides, recordings, photos, a thank-you post and next date.

Scale through **chapter programs**: give local organisers a playbook, a small budget, swag and recognition.
`,
      takeaways: [
        'Meetups turn online members into real relationships',
        'Leave plenty of unstructured time — networking is the point',
        'Scale with chapter programs and organiser playbooks',
      ],
      resources: [R.getTogether, R.vidChampions],
    },
    {
      title: 'Encouraging Participation',
      body: `
Most community members lurk. That's normal and fine. The goal is to make the **next step** up the participation ladder easy and rewarding.

A common ladder: *lurker → asker → answerer → contributor → leader*. At each step, remove friction and add recognition:

- **Make asking easy:** clear channels, question templates and fast friendly replies.
- **Make answering visible:** thank helpers publicly, feature "answer of the week".
- **Make contributing obvious:** good first issues, docs fixes, a showcase channel and writing opportunities.
- **Make leading possible:** moderator roles, champion programs and speaking slots.

Recognition doesn't have to cost money: shout-outs, contributor spotlights, badges or roles, invitations to early previews, LinkedIn recommendations. Be careful with points and leaderboards. They can reward noise over quality. Jono Bacon's talk on smart incentivisation covers the pitfalls.
`,
      takeaways: [
        'Design the lurker → asker → answerer → contributor → leader ladder',
        'Recognition is the cheapest, most powerful incentive',
        'Avoid gamification that rewards noise over quality',
      ],
      resources: [R.vidJonoIncentives, R.orbitModel, R.peoplePowered],
    },
    {
      title: 'Managing Difficult Members & Conflict',
      body: `
Conflict is inevitable. How you handle it defines your culture more than any guideline.

Common situations and approaches:

- **The frustrated user** venting about a bug: acknowledge the frustration, move to specifics, route to a fix and follow up. Frustration usually means they care.
- **The persistent self-promoter:** remind them of guidelines privately, redirect to #showcase, then escalate if needed.
- **The expert who's harsh to beginners:** thank their expertise privately, explain the norm, model the tone you want.
- **Heated technical disagreement:** fine, if it's about ideas. Step in when it becomes personal.
- **Harassment or CoC violations:** act quickly and follow your enforcement process. Protect the target first.

General principles: move heated conversations to private channels, assume good intent until proven otherwise, document every moderation action, and never argue in public. *Crucial Conversations* is excellent preparation for the hardest cases.
`,
      takeaways: [
        'Frustration often signals care — acknowledge, then get specific',
        'Take conflict private; document moderation decisions',
        'Harassment gets fast, consistent enforcement — protect the target first',
      ],
      resources: [R.crucialConversations, R.contributorCovenant, R.vidJonoLessons],
    },
    {
      title: 'Community Growth Strategies',
      body: `
Grow *after* you have something worth joining. Growth into an empty or unhealthy community just accelerates churn.

Channels that work for developer communities:

- **Content that invites people in:** every tutorial, talk and video ends with a reason to join.
- **Product touchpoints:** a link to the community from docs, error messages, onboarding emails and the dashboard.
- **Events:** meetups, hackathons, workshops and virtual office hours.
- **Partnerships:** co-host with adjacent communities, cross-promote, and exchange speakers.
- **Ambassador and champion programs:** members who represent you in their own networks.
- **Referral by delight:** the most sustainable growth is members who recommend it because it helped them.

Measure growth quality, not just quantity. What share of new members post in their first two weeks? The Orbit model is a helpful way to think about moving people from reach to love.
`,
      takeaways: [
        'Fix health before investing in growth',
        'Put the community into every product and content touchpoint',
        'Measure growth quality — early activation, not just joins',
      ],
      resources: [R.orbitModel, R.vidChampionProgram, R.peoplePowered],
    },
    {
      title: 'Community Health Metrics',
      body: `
Size is the least interesting number. Health is about **activity, helpfulness, retention and diversity of contributors**.

Useful metrics:

- **Active members** (weekly/monthly) and the ratio of active to total
- **New member activation:** percentage who post or react within 14 days
- **Response time and answer rate:** how quickly, and whether, questions get answered
- **Member-to-member answers:** share of questions answered by non-staff (a key maturity signal)
- **Retention:** members active this month who were also active three months ago
- **Contributor growth:** new contributors to docs, code and events
- **Sentiment:** qualitative themes from conversations and surveys

CHAOSS publishes open, well-defined community health metrics, especially for open source. Pick 3–5 metrics, track them monthly, and pair them with stories. Leadership remembers stories.
`,
      takeaways: [
        'Health beats size: activity, helpfulness, retention, contributor growth',
        'Member-to-member answers is a key maturity signal',
        'Track a few metrics monthly and pair them with stories',
      ],
      resources: [R.chaoss, R.osgMetrics, R.orbitModel, R.vidMetricsPanel],
    },
    {
      title: 'Onboarding New Members',
      body: `
The first week decides whether a new member stays. Design it on purpose.

- **Welcome message** (automated plus a human touch): what this place is, where to start, the three most useful channels and the guidelines.
- **Introductions thread:** a simple prompt such as "What are you building? What brought you here?" Reply to every intro.
- **Starter resources:** a pinned "start here" with a getting-started guide, FAQ and upcoming events.
- **Quick win:** a first small action. Introduce yourself, share a project, react to a showcase, or try a good first issue.
- **Connect people:** "@A, you're both working on X, you should chat". Introductions between members are the most powerful retention tool you have.

Review onboarding quarterly. Join your own community with a fresh account and see how it feels.
`,
      takeaways: [
        'Design the first week: welcome, intros, start-here, quick win',
        'Reply to every introduction',
        'Introduce members to each other — connections retain people',
      ],
      resources: [R.osgBuildingCommunity, R.getTogether, R.artOfCommunity],
    },
  ],
  resources: [R.peoplePowered, R.artOfCommunity, R.getTogether, R.chaoss, R.contributorCovenant, R.cmx, R.communityPulse],
  challenge: {
    title: 'Design a community launch plan',
    prompt: `
Pick a real product, open source project or topic you care about and write a **90-day plan to launch or revitalise its developer community**. Publish it as a post or a public doc. It shows you think in systems, not just tactics.
`,
    template: `\`\`\`markdown
# 90-day community plan: <name>

## Purpose
This community is for <who> to <get what value>.
Community type: consumer / champion / collaborator (and why)

## Platform
<platform> because <reason>. Knowledge lives in <where>.

## Guidelines & safety
- Code of conduct: <link/adapted from>
- Reporting path: <how>

## Days 0–30: Seed
- Invite <N> founding members from <sources>
- Rituals: <weekly thing>, <monthly thing>

## Days 31–60: Activate
- Onboarding flow: <steps>
- Recognition: <how>

## Days 61–90: Grow
- Channels: <content, product touchpoints, events, partners>

## Health metrics (reviewed monthly)
1. <metric> — target <x>
2. <metric> — target <x>
3. <metric> — target <x>
\`\`\``,
  },
}
