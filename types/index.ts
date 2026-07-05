export type CareerLevel =
  | 'Junior DevRel'
  | 'Mid-Level DevRel'
  | 'Senior DevRel'
  | 'Staff/Principal DevRel'
  | 'DevRel Leader'

export type FitLabel = 'Strong Fit' | 'Good Fit' | 'Partial Fit' | 'Weak Fit' | 'Poor Fit'

export type Priority = 'High' | 'Medium' | 'Low'

export type Timeframe = 'Now (0–3 months)' | 'Soon (3–6 months)' | 'Later (6–12 months)'

export interface DevRelSkills {
  technicalCredibility: number
  contentCreationDepth: number
  communityBuildingScale: number
  publicSpeakingEvangelism: number
  developerExperienceSensibility: number
  openSourceParticipation: number
  productFeedbackStrategy: number
  developerEducationEnablement: number
  dataAndMeasurement: number
  aiFluency: number
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
