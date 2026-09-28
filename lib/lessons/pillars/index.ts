import type { PhaseLesson } from '../types'
import { contentCreation } from './content'
import { communityBuilding } from './community'
import { publicSpeaking } from './speaking'
import { developerExperience } from './dx'

export const fourPillars: PhaseLesson = {
  phaseId: 'four-pillars',
  duration: '8–12 weeks at 5 hours a week',
  outcomes: [
    'Plan, write and publish technical content that solves real problems — and measure it',
    'Launch, run and grow a developer community with healthy norms and metrics',
    'Pitch, build and deliver technical talks and workshops, including live demos',
    'Map a developer journey, measure onboarding friction and turn feedback into product change',
  ],
  intro: `
Phase 1 gave you the *why* and the technical baseline. Phase 2 is the *what*: the four disciplines that make up day-to-day DevRel work.

- **Content Creation** teaches at scale: tutorials, docs, samples, video.
- **Community Building** creates a place where developers help each other and help shape the product.
- **Public Speaking & Events** builds trust fast, one room at a time.
- **Developer Experience** removes the friction that makes developers quit.

They reinforce each other. A talk becomes a blog post, which becomes a docs page, which answers a community question, which reveals a DX problem, which becomes a product fix, which becomes your next talk. **That loop is DevRel.** The better you understand it, the more each piece of work compounds.

You don't need to master all four at once. Most practitioners **go deep in one or two** early in their career. Engineers often lead with content and DX, and community builders with community and events. Aim for working competence in all four before moving to senior roles. Each module ends with a Compass Challenge that produces a real, public portfolio piece. Do them: a portfolio of four challenge outputs is a strong DevRel application on its own.
`,
  modules: [contentCreation, communityBuilding, publicSpeaking, developerExperience],
}
