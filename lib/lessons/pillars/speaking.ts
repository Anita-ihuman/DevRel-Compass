import type { SkillModule } from '../types'
import { R } from '../resources'

export const publicSpeaking: SkillModule = {
  groupId: 'public-speaking',
  question: 'How do you give technical talks and run events that people remember?',
  overview: `
Speaking is DevRel's highest-leverage, highest-anxiety skill. One good talk reaches hundreds of people live and thousands via the recording. It builds your credibility faster than almost anything else, and it gets easier with practice.

The core insight from Nancy Duarte and Chris Anderson is the same: **a great talk is built around one idea**, structured as a journey from "what is" to "what could be", and delivered to the audience in the room rather than to your slides.

This module covers the full lifecycle: pitching (CFPs), building (structure and demos), delivering (engagement, Q&A), teaching (workshops), running events, and representing your company in the media.
`,
  topics: [
    {
      title: 'CFP Writing & Talk Proposals',
      body: `
A **CFP** (call for papers/proposals) is how most conferences choose speakers. Reviewers read hundreds of abstracts, often in a hurry. Make yours easy to say yes to.

Anatomy of a strong proposal:

- **Title:** specific and intriguing. "Your Postgres Is Lying to You: Debugging Query Plans" beats "Database Performance".
- **Abstract** (public, 100–200 words): the problem, why it matters now, what attendees will learn, and who it's for.
- **Takeaways:** 3 concrete things attendees will be able to do.
- **Details for reviewers** (private): outline with timings, why you're qualified, whether it's been given before, and links to past talks or writing.
- **Bio:** 2–3 sentences, third person, relevant credentials only.

Tips: submit to the **conference's audience**, not a generic one. Avoid product pitches. Reviewers reject vendor talks. Submit several different talks. Rejection is normal: experienced speakers are rejected more often than they're accepted. Create a Sessionize profile and watch PaperCall and community lists for open CFPs.
`,
      takeaways: [
        'Specific title, problem-first abstract, 3 concrete takeaways',
        'Use the private notes to show an outline and credibility',
        'Tailor to the event’s audience; never pitch your product',
      ],
      resources: [R.vidCfpWwc, R.vidCfpCode, R.sessionize, R.papercall],
    },
    {
      title: 'Talk Structure & Narrative',
      body: `
Structure is what lets an audience follow you without effort.

**Find the one idea.** Write your talk's point in a single sentence. Everything that doesn't serve it goes, however interesting.

**Use a narrative shape.** Duarte's pattern alternates between *what is* (the current pain) and *what could be* (the better way), ending with a call to action. A simple technical version:

1. **Hook** (1–2 min): a story, a surprising fact, a live failure.
2. **The problem:** why the status quo hurts, with a real example.
3. **The idea:** the concept that fixes it.
4. **Show it:** demo or worked example.
5. **Complications:** trade-offs, when not to use it. This builds trust.
6. **Takeaways:** 3 things to remember.
7. **Call to action:** one thing to do tomorrow.

Slides support you; they are not your notes. One idea per slide, big text, readable code (≤15 lines, large font, highlighted lines). Rehearse out loud at least three times, including once for a friend.
`,
      takeaways: [
        'One idea per talk, one idea per slide',
        'Alternate "what is" and "what could be"; end with a call to action',
        'Rehearse out loud at least three times',
      ],
      resources: [R.vidDuarte, R.resonate, R.talkLikeTed],
    },
    {
      title: 'Live Demo Delivery',
      body: `
Live demos are powerful because they're risky. The audience sees it's real. Manage the risk rather than avoid it.

**Preparation:**
- Script the demo step by step; rehearse until it's boring.
- Use a dedicated clean profile, large fonts, notifications off and no secrets on screen.
- Pre-install everything; don't depend on conference Wi-Fi (tether, or run locally).
- Keep **checkpoints**: git branches or tags for each stage, so you can jump ahead.

**Fallbacks:**
- A recorded video of the demo, ready to play.
- Screenshots in your slides for the key moments.

**When it breaks** (it will): stay calm, narrate what you're checking, give it 30 seconds, then switch to the fallback with good humour. Audiences are on your side. A graceful recovery often builds *more* credibility than a perfect run.

Kelsey Hightower's Cloud Next demo is the gold standard of calm, narrated, real live coding.
`,
      takeaways: [
        'Script, rehearse and use checkpoints (branches or tags)',
        'Always have a recorded fallback and screenshots',
        'When it breaks: narrate, 30 seconds, then fallback — calmly',
      ],
      resources: [R.vidHightowerDemo, R.demystifyingPublicSpeaking],
    },
    {
      title: 'Conference Speaking',
      body: `
Big conferences (KubeCon, AWS re:Invent, Open Source Summit, DevRelCon, framework conferences) have their own norms.

- **Tracks and levels.** Know whether your talk is beginner, intermediate or advanced, and match the track.
- **Timing.** Hard stops are strictly enforced. Aim to finish two minutes early.
- **Speaker logistics.** Submit slides on time, test your adapter (bring your own), arrive early and meet the AV team.
- **Accessibility.** High contrast, readable fonts, describe visuals aloud, and avoid flashing animations.
- **The hallway track.** The conversations after your talk are often more valuable than the talk. Stay around.
- **Travel and budget.** Many events cover speaker travel for community speakers. Ask. Diversity scholarships exist too.

Build up to tier-1 events: meetups → regional conferences → larger events. Organisers often invite speakers they've seen give strong talks elsewhere, and recordings of your past talks help a lot.
`,
      takeaways: [
        'Match your level and track; respect hard time limits',
        'Accessibility and logistics are part of professionalism',
        'Build from meetups to regional to tier-1 events',
      ],
      resources: [R.talkLikeTed, R.devrelCon, R.sessionize],
    },
    {
      title: 'Meetup & Lightning Talks',
      body: `
Meetups and lightning talks (typically 5 minutes) are the **best practice ground** in DevRel. Stakes are low, audiences are friendly, and feedback is immediate.

Why start here:
- Organisers are always looking for speakers. Offer, and you'll likely get a slot.
- A 5-minute talk forces clarity: one idea, one demo or example, one takeaway.
- You can iterate: give the same talk three times, improving it each time.
- Recordings become portfolio pieces and CFP evidence.

A lightning talk formula: *problem (1 min) → idea (1 min) → show it (2 min) → takeaway (1 min)*. Rehearse with a timer. Running over is the one unforgivable sin in lightning talks.

After each talk, ask two people what they remember. That's your real message, and it may not be the one you intended.
`,
      takeaways: [
        'Meetups are the best low-stakes practice ground',
        'Lightning talks force a single clear idea',
        'Ask attendees what they remember — that’s what your talk said',
      ],
      resources: [R.demystifyingPublicSpeaking, R.vidTreasure],
    },
    {
      title: 'Engaging Your Audience',
      body: `
Attention drops every few minutes. Engagement is how you reset it.

- **Open with a story or question,** not an agenda slide.
- **Use concrete examples:** real code, real numbers, real customers (with permission).
- **Vary the pace:** move between slides, demo, story and a quick poll.
- **Voice:** vary pitch, pace and volume, and use pauses. Julian Treasure's TED talk is a practical guide to vocal delivery.
- **Body language:** open posture, move with purpose and look at people, not your screen.
- **Humour, lightly.** Self-deprecation works; jokes at the audience's expense don't.
- **Interaction:** a show of hands, a question to think about, or a live poll. Only if it serves the point.

For virtual talks, engagement is harder: turn the camera on, look at the lens, use the chat and speak with a bit more energy than feels natural.
`,
      takeaways: [
        'Open with a story; use concrete examples',
        'Vary pace, voice and mode every few minutes',
        'Virtual talks need extra energy and use of chat',
      ],
      resources: [R.vidTreasure, R.vidDuarte, R.talkLikeTed],
    },
    {
      title: 'Handling Q&A',
      body: `
Q&A is where credibility is won or lost. Prepare for it like part of the talk.

- **Anticipate:** list the 10 hardest questions you could get and prepare short answers.
- **Repeat the question** so the whole room (and the recording) hears it.
- **Answer briefly,** then check: "Does that answer it?"
- **"I don't know"** is fine: "Great question, I don't know. Let's talk after, or I'll follow up online." Then actually follow up.
- **Statements disguised as questions:** thank them, find the kernel of a question, answer it, move on.
- **Hostile or off-topic questions:** stay calm and generous, bridge back to your message, and offer to continue offline.
- **Product criticism:** acknowledge it honestly and don't get defensive. Route it to the product team, and say you will.

Leave time for Q&A, and have one question you can pose yourself if the room is quiet ("A question I often get is…").
`,
      takeaways: [
        'Prepare for the 10 hardest questions',
        'Repeat, answer briefly, check — and "I don’t know" is allowed',
        'Stay generous with hostile questions; take them offline',
      ],
      resources: [R.demystifyingPublicSpeaking, R.crucialConversations],
    },
    {
      title: 'Workshop Facilitation',
      body: `
Workshops teach by doing. They're more work than talks, and more impactful for real learning.

**Design:**
- Start from **learning objectives**: by the end, participants can ___.
- Break into modules of 20–30 minutes: short explanation → hands-on exercise → debrief.
- Provide a repo with **starting and completed states** for each module so no one gets stuck forever.
- Plan for mixed skill levels: "stretch goals" for the fast, checkpoints for the slow.

**Setup is the biggest risk.** Send setup instructions days in advance, provide a cloud-based environment (Codespaces or similar) as a fallback, and budget 15 minutes for setup anyway.

**Facilitation:** have helpers walk the room (1 per 15–20 people), use sticky notes or a "stuck" emoji in virtual sessions, and keep time ruthlessly. End with a recap and where to go next.
`,
      takeaways: [
        'Design from learning objectives in 20–30 minute modules',
        'Provide checkpoints and a cloud environment fallback',
        'Setup is the #1 risk — send instructions early',
      ],
      resources: [R.githubSkills, R.docsForDevelopers],
    },
    {
      title: 'Event Management',
      body: `
Running your own events, from meetups to hackathons to conferences, is a project-management discipline.

A planning timeline for a mid-size event:

- **8–12 weeks out:** goals and audience, budget, date, venue/platform, sponsors and speakers.
- **4–8 weeks:** agenda, registration page, promotion plan, accessibility and CoC, and swag.
- **1–4 weeks:** reminders, run-of-show document, volunteer briefing and AV tests.
- **Day of:** check-in, timekeeping, photos, social posts and incident handling.
- **After:** thank-you email, recordings, survey, metrics report and retro.

Define **success before the event:** is it attendance, qualified conversations, sign-ups, community joins or content produced? Choose one or two, and track them. Hackathons especially need clear judging criteria, strong mentors and a plan for the projects after the event.
`,
      takeaways: [
        'Work backwards from a timeline with clear owners',
        'Define success metrics before the event',
        'The follow-up is where most event value is captured',
      ],
      resources: [R.getTogether, R.vidMetricsPanel],
    },
    {
      title: 'Media Appearances',
      body: `
Podcasts, webinars, panels and press interviews extend your reach. You're representing yourself **and** your company.

Before:
- Ask about the audience, format, length and whether it's live or edited.
- Prepare 3 key messages and a story for each.
- Check with your company's comms team on anything sensitive (roadmap, customers, numbers).

During:
- Answer the question asked, then bridge to a key message if relevant.
- Be concrete: examples beat abstractions.
- On panels, build on others' points and don't monopolise.
- It's fine to say "that's not something I can share".

After: share it, thank the host, and clip the best moments. Media appearances compound. Hosts recommend good guests to other hosts.
`,
      takeaways: [
        'Prepare 3 key messages, each with a story',
        'Know what you can and can’t share before you go on',
        'Good guests get recommended — be one',
      ],
      resources: [R.communityPulse, R.talkLikeTed],
    },
    {
      title: 'Handouts & Supporting Materials',
      body: `
The talk lasts 30 minutes. Supporting materials extend its life for months.

- **A resource page:** one short URL on your last slide with slides, code, links and your contact. Make it scannable from a photo or QR code.
- **A repo:** demo code with a README that stands on its own.
- **Slides that work alone:** or a companion blog post, since slides designed for speaking rarely make sense without you.
- **Accessible formats:** share slides as PDF with alt text; caption recordings.
- **Cheat sheets:** a one-page summary of commands or concepts for workshops.

Track visits to the resource page. They tell you which talks actually drove interest, which is useful data for your next CFP and your quarterly report.
`,
      takeaways: [
        'One short URL for slides, code and links',
        'A companion post or repo that stands alone',
        'Track resource page visits as a talk impact signal',
      ],
      resources: [R.resonate, R.excalidraw],
    },
  ],
  resources: [R.resonate, R.talkLikeTed, R.demystifyingPublicSpeaking, R.vidDuarte, R.vidTreasure, R.vidHightowerDemo, R.sessionize],
  challenge: {
    title: 'Submit your first CFP',
    prompt: `
Find an open call for proposals, at a meetup, regional conference or virtual event, and **submit a talk proposal**. Acceptance isn't the goal; submitting is. Most speakers' first proposals are rejected, and every submission sharpens the next.
`,
    template: `\`\`\`markdown
Title: <Specific, intriguing, promise-driven>

Abstract (public, ~150 words):
<Problem developers face and why it matters now.>
<What this talk covers.>
In this talk you'll learn:
- <takeaway 1 — a verb they can do>
- <takeaway 2>
- <takeaway 3>
Audience: <level> developers who <context>.

Outline (for reviewers):
00–03  Hook: <story/failure>
03–10  The problem: <example>
10–20  The approach + demo
20–25  Trade-offs & when not to use it
25–30  Takeaways + Q&A

Why me: <experience with the problem, related writing/talks>

Bio (3rd person, 2–3 sentences):
<Name> is a <role> at <org> who <relevant thing>. <Credibility>. <Human detail>.
\`\`\``,
  },
}
