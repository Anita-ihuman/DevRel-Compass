import { SKILLS } from '@/lib/constants'
import ScoreRing from './ScoreRing'
import SkillBar from './SkillBar'
import type { AnalysisResult } from '@/types'

interface Props {
  data: AnalysisResult
}

export default function SkillsTab({ data }: Props) {
  return (
    <div className="tab-pane">
      <div className="skills-hero">
        <ScoreRing score={data.overallScore} size={160} strokeWidth={14} />
        <div className="skills-hero-info">
          <div className="career-badge">{data.careerLevel}</div>
          <p className="skills-hero-desc">
            Overall DevRel profile score, benchmarked against global expectations
            from CNCF, Google, AWS, Stripe, Twilio, and HashiCorp.
          </p>
          <div className="score-legend">
            <span className="leg leg-g">71–100 Strong / Exceptional</span>
            <span className="leg leg-t">51–70 Solid</span>
            <span className="leg leg-a">31–50 Developing</span>
            <span className="leg leg-r">0–30 Early Stage</span>
          </div>
        </div>
      </div>

      <div className="skills-bars">
        {SKILLS.map((skill, i) => (
          <SkillBar
            key={skill.key}
            skill={skill}
            score={data.devrelSkills?.[skill.key] ?? 0}
            delay={i * 75}
          />
        ))}
      </div>
    </div>
  )
}
