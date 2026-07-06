# Contributing to DevRel Compass

First off — thank you! 🧭 DevRel Compass is an open-source career development
platform for Developer Relations practitioners, and it gets better every time
someone shares their expertise. **You don't need to be a developer to
contribute.** Some of the most valuable contributions are words, not code.

- **Repo:** https://github.com/Anita-ihuman/DevRel-Compass
- **License:** MIT — contributions are made under the same license.

---

## Ways to contribute

### ✍️ Writing & content (no coding required)

This is the heart of the project, and the easiest place to start:

- **Career roadmap** — improve the phases, skills, and topics in
  [`lib/roadmap-data.ts`](lib/roadmap-data.ts). Add a missing skill, sharpen a
  description, or fix an outdated recommendation.
- **Skills rubric & benchmarks** — refine how the analyzer scores each DevRel
  skill dimension in [`lib/constants.ts`](lib/constants.ts) (the `SYSTEM_PROMPT`
  and scoring guidance). Real hiring-bar insight from experienced DevRel folks is
  gold here.
- **Events** — add or update community events, webinars, and conferences in
  [`app/events/page.tsx`](app/events/page.tsx).
- **Docs** — improve this file, the README, or in-app copy so it's clearer and
  more welcoming.

If you'd rather not touch the code at all, **open an issue** with your suggestion
(the exact wording, the skill to add, the event details) and a maintainer will
help land it.

### 💻 Code

- Fix a bug, build a feature, or improve accessibility and performance.
- Good first issues are labeled [`good first issue`](https://github.com/Anita-ihuman/DevRel-Compass/issues).
- The stack: **Next.js (App Router) · React · TypeScript**, deployed on Vercel.

### 🎨 Design & UX

- Propose UI/UX improvements, better visualizations, or accessibility fixes.
- Screenshots and Figma links in an issue are very welcome.

### 🐛 Feedback & bug reports

- Found something broken or confusing? [Open an issue](https://github.com/Anita-ihuman/DevRel-Compass/issues/new)
  describing what you expected vs. what happened, with steps to reproduce.
- Sharing the project with your DevRel community counts too. 💚

---

## Getting started (for code or content changes)

You'll need **Node.js 18+** and **npm**.

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/<your-username>/DevRel-Compass.git
cd DevRel-Compass

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
#    then add your ANTHROPIC_API_KEY (only needed to run the Skills Analyzer;
#    editing roadmap/events content does not require it)

# 4. Start the dev server
npm run dev          # → http://localhost:3000
```

Before opening a pull request, please run:

```bash
npm run lint         # linting
npm run type-check   # TypeScript checks
npm run build        # make sure it builds
```

---

## Submitting a pull request

1. **Create a branch** off `main`:
   `git checkout -b feat/short-description` (or `fix/…`, `content/…`, `docs/…`).
2. **Make focused changes** — one topic per PR is easier to review.
3. **Commit** with a clear message describing *what* and *why*.
4. **Push** to your fork and **open a pull request** against
   `Anita-ihuman/DevRel-Compass:main`.
5. In the PR description, explain the change and link any related issue
   (e.g. `Closes #12`). Screenshots help for UI changes.
6. A maintainer will review, suggest any tweaks, and merge. 🎉

**Not sure where to start?** Open an issue describing what you'd like to work on,
and we'll point you in the right direction.

---

## Project structure (quick map)

```
app/            Next.js App Router pages & API routes
  events/       Events page (add events here)
  api/analyze/  Skills Analyzer API
components/      React components (analyzer, roadmap, nav, footer)
lib/
  roadmap-data.ts   Career roadmap content  ← great for writers
  constants.ts      Skills rubric & analyzer prompt  ← great for DevRel experts
```

---

## Code of conduct

Be kind, be constructive, assume good intent. We want DevRel Compass to be a
welcoming space for contributors of every background and experience level.
Harassment or disrespect of any kind isn't tolerated.

Thanks for helping DevRel practitioners chart their careers! 🧭
