// Lesson content model for the interactive roadmap.
//
// The roadmap (lib/roadmap-data.ts) defines phases → groups → topics. Every
// group is taught as a "skill module" that follows the same shape:
//
//   Learn → Resources → Challenge
//
// Each topic in a group gets its own lesson section inside the module, keyed by
// the topic's title so the roadmap and the lessons can't silently drift apart
// (assertLessonsCoverRoadmap in lib/lessons/index.ts fails the build if they do).

export type ResourceKind =
  | 'book'
  | 'article'
  | 'guide'
  | 'video'
  | 'course'
  | 'tool'
  | 'community'
  | 'podcast'
  | 'newsletter'
  | 'webinar'

export interface Resource {
  title: string
  url: string
  kind: ResourceKind
  /** Author, publisher or channel. */
  by?: string
  /** One line on why it's worth your time. */
  note?: string
  /** Free to read/watch. Books default to paid unless marked. */
  free?: boolean
}

export interface TopicLesson {
  /** Must match a topic title in lib/roadmap-data.ts exactly. */
  title: string
  /** Markdown. The core lesson text. */
  body: string
  /** Short checklist of what to take away. */
  takeaways: string[]
  resources: Resource[]
}

export interface CompassChallenge {
  title: string
  /** Markdown: what to make and why. */
  prompt: string
  /** Markdown template to copy — usually a fenced block. */
  template: string
}

export interface SkillModule {
  /** Must match a group id in lib/roadmap-data.ts. */
  groupId: string
  /** Learn: the framing question the module answers. */
  question: string
  /** Markdown: module overview that sets up the topics. */
  overview: string
  topics: TopicLesson[]
  /** Resources: the curated shortlist for the whole skill. */
  resources: Resource[]
  challenge: CompassChallenge
}

export interface PhaseLesson {
  /** Must match a phase id in lib/roadmap-data.ts. */
  phaseId: string
  /** Markdown: the phase-level context lesson. */
  intro: string
  /** What you'll be able to do after the phase. */
  outcomes: string[]
  /** Rough time to work through the phase. */
  duration: string
  modules: SkillModule[]
}
