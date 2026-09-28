import { ROADMAP_PHASES } from '@/lib/roadmap-data'
import type { RoadmapGroup, RoadmapPhase } from '@/lib/roadmap-data'
import type { PhaseLesson, SkillModule } from './types'
import { foundation } from './foundation'
import { fourPillars } from './pillars'
import { visibility } from './visibility'
import { openSource } from './open-source'
import { advanced } from './advanced'

export type { PhaseLesson, SkillModule, TopicLesson, Resource } from './types'
export { topicSlug, moduleHref, topicHref, topicKey } from './paths'

const LESSONS: PhaseLesson[] = [foundation, fourPillars, visibility, openSource, advanced]

export function getPhaseLesson(phaseId: string): PhaseLesson | undefined {
  return LESSONS.find((l) => l.phaseId === phaseId)
}

export function getRoadmapPhase(phaseId: string): RoadmapPhase | undefined {
  return ROADMAP_PHASES.find((p) => p.id === phaseId)
}

export type ModuleContext = {
  phase: RoadmapPhase
  lesson: PhaseLesson
  group: RoadmapGroup
  module: SkillModule
  /** Position of this module across the whole roadmap, for prev/next links. */
  prev: { phase: RoadmapPhase; group: RoadmapGroup } | null
  next: { phase: RoadmapPhase; group: RoadmapGroup } | null
}

/** Every (phase, group) pair in roadmap order. */
export function allModuleRefs(): { phase: RoadmapPhase; group: RoadmapGroup }[] {
  return ROADMAP_PHASES.flatMap((phase) => phase.groups.map((group) => ({ phase, group })))
}

export function getModuleContext(phaseId: string, groupId: string): ModuleContext | undefined {
  const phase = getRoadmapPhase(phaseId)
  const lesson = getPhaseLesson(phaseId)
  const group = phase?.groups.find((g) => g.id === groupId)
  const module = lesson?.modules.find((m) => m.groupId === groupId)
  if (!phase || !lesson || !group || !module) return undefined

  const refs = allModuleRefs()
  const i = refs.findIndex((r) => r.phase.id === phaseId && r.group.id === groupId)
  return {
    phase,
    lesson,
    group,
    module,
    prev: i > 0 ? refs[i - 1] : null,
    next: i < refs.length - 1 ? refs[i + 1] : null,
  }
}

/**
 * Throws if the roadmap and the lessons have drifted apart — a roadmap topic
 * without a lesson, or a lesson for a topic the roadmap no longer has. Called
 * from the lesson pages' generateStaticParams, so drift fails the build rather
 * than shipping a roadmap link that goes nowhere.
 */
export function assertLessonsCoverRoadmap(): void {
  const problems: string[] = []
  for (const phase of ROADMAP_PHASES) {
    const lesson = getPhaseLesson(phase.id)
    if (!lesson) {
      problems.push(`phase "${phase.id}" has no lesson`)
      continue
    }
    for (const group of phase.groups) {
      const module = lesson.modules.find((m) => m.groupId === group.id)
      if (!module) {
        problems.push(`group "${phase.id}/${group.id}" has no module`)
        continue
      }
      const lessonTitles = new Set(module.topics.map((t) => t.title))
      const roadmapTitles = new Set(group.topics.map((t) => t.title))
      for (const t of roadmapTitles) {
        if (!lessonTitles.has(t)) problems.push(`topic "${group.id}: ${t}" has no lesson`)
      }
      for (const t of lessonTitles) {
        if (!roadmapTitles.has(t)) problems.push(`lesson "${group.id}: ${t}" is not on the roadmap`)
      }
    }
    for (const m of lesson.modules) {
      if (!phase.groups.some((g) => g.id === m.groupId)) {
        problems.push(`module "${phase.id}/${m.groupId}" is not on the roadmap`)
      }
    }
  }
  if (problems.length) {
    throw new Error(`Lessons are out of sync with lib/roadmap-data.ts:\n  - ${problems.join('\n  - ')}`)
  }
}
