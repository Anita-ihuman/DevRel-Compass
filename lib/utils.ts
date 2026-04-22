export function getScoreColor(score: number): string {
  if (score >= 71) return '#22c55e'
  if (score >= 51) return '#2dd4bf'
  if (score >= 31) return '#f59e0b'
  return '#ef4444'
}

export function getScoreLabel(score: number): string {
  if (score >= 86) return 'Exceptional'
  if (score >= 71) return 'Strong'
  if (score >= 51) return 'Solid'
  if (score >= 31) return 'Developing'
  return 'Early Stage'
}

export function getFitBadge(score: number): { label: string; color: string } {
  if (score >= 75) return { label: 'Strong Match', color: '#22c55e' }
  if (score >= 50) return { label: 'Partial Match', color: '#f59e0b' }
  return { label: 'Gap', color: '#ef4444' }
}

export function getFitLabelColor(label: string): string {
  const map: Record<string, string> = {
    'Strong Fit': '#22c55e',
    'Good Fit': '#2dd4bf',
    'Partial Fit': '#f59e0b',
    'Weak Fit': '#ef4444',
  }
  return map[label] ?? '#9090b0'
}
