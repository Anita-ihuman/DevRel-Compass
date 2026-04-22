export type CareerLevel =
  | 'Junior DevRel'
  | 'Mid-Level DevRel'
  | 'Senior DevRel'
  | 'Staff/Principal DevRel'
  | 'DevRel Leader'

export type FitLabel = 'Strong Fit' | 'Good Fit' | 'Partial Fit' | 'Weak Fit'

export type Priority = 'High' | 'Medium' | 'Low'

export type Timeframe = '0–3 months' | '3–6 months' | '6–12 months'

export interface DevRelSkills {
  technicalCredibility: number
  contentCreation: number
  communityBuilding: number
  publicSpeakingEvangelism: number
  developerExperience: number
  openSourceParticipation: number
  productFeedbackLoop: number
  developerEducationEnablement: number
}

export interface JobFitItem {
  label: string
  score: number
  description: string
}

export interface RoadmapAction {
  priority: Priority
  timeframe: Timeframe
  action: string
  why: string
  resource: string
}

export interface AnalysisResult {
  candidateName: string
  overallScore: number
  careerLevel: CareerLevel
  devrelSkills: DevRelSkills
  topStrength: string
  jobFit: JobFitItem[]
  strengths: string[]
  gaps: string[]
  roadmap: RoadmapAction[]
  verdict: string
  fitScore: number | null
  fitLabel: FitLabel | null
}

export interface SkillMeta {
  key: keyof DevRelSkills
  label: string
  hint: string
}
