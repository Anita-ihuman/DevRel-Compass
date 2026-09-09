// DevRel Strategy Room sessions — one list, past and upcoming together.
//
// Whether a session is past or upcoming is derived from its date, not tracked by
// hand. Keeping two separate lists meant a session stayed under "Upcoming" until
// someone remembered to move it; now the date does that on its own. The pages
// that render these revalidate hourly so the rollover happens without a deploy.
//
// To add a session: append an entry with an ISO date. To publish a recording:
// set `videoId` to the YouTube ID (the part after `v=`).

export type Session = {
  /** Display number, e.g. '03'. Shown on past-session cards. */
  num: string
  title: string
  speaker?: string
  description: string
  /**
   * ISO date, YYYY-MM-DD. Drives past/upcoming. Omit for early sessions whose
   * date wasn't recorded — those are always treated as past.
   */
  date?: string
  season: number
  tags?: string[]
  /** YouTube video ID, once the recording is published. */
  videoId?: string | null
  /** Registration link, while the session is still upcoming. */
  link?: string
}

export const sessions: Session[] = [
  // ── Season 1 ──────────────────────────────────────────────────────────────
  {
    num: '01',
    season: 1,
    title: 'DevRel Strategy Room — Session 1',
    description:
      'An in-depth conversation on how AI is influencing the way companies connect with developers and how DevRel, developer education, and marketing teams can adapt.',
    videoId: 'thTnBiZToKE',
    tags: ['AI', 'DevRel', 'Marketing'],
  },
  {
    num: '02',
    season: 1,
    title: 'DevRel Strategy Room — Session 2',
    description:
      'A deep dive into how AI is transforming the way developers and platform teams build, deploy, and operate production-grade cloud systems, from infrastructure provisioning to debugging and optimization.',
    videoId: 'OvyBAJYrzw0',
    tags: ['AI', 'DevRel', 'Cloud'],
  },

  // ── Season 2 ──────────────────────────────────────────────────────────────
  {
    num: '03',
    season: 2,
    date: '2026-07-17',
    title: 'Turning Developer Education into Business Outcomes',
    speaker: 'Linda Ikechukwu',
    description:
      "Developer education does not end with documentation, tutorials, or a few YouTube videos; it's a strategic driver of product adoption, developer success, and long-term business growth. Linda joins us for a fireside chat on building impactful education programs that deliver measurable outcomes, followed by a live audience Q&A.",
    tags: ['Developer Education', 'DevRel', 'Business Impact'],
    // "How Developer Education Drives Business Growth"
    videoId: '5ydNCKqeAPg',
  },
  {
    num: '04',
    season: 2,
    date: '2026-07-25',
    title: 'Beyond the Resume: Building a Personal Brand That Opens Doors',
    speaker: 'Adora Nwodo',
    description:
      'The people who consistently attract speaking invitations, leadership opportunities, startup advisory roles, and global career opportunities have intentionally invested in becoming known for something beyond the code they write. Renowned engineering leader, author, and community builder Adora Nwodo shares practical lessons from building a globally recognized personal brand while maintaining technical credibility.',
    tags: ['Personal Brand', 'Career', 'DevRel'],
    // "Visibility Doesn't Mean Hundreds of Thousands of Followers."
    videoId: 'p38jc3u7mL4',
  },
  {
    num: '05',
    season: 2,
    date: '2026-07-28',
    title: 'Beyond Evangelism: Applying Systems Thinking to Modern DevRel',
    speaker: 'Rohit Ghumare',
    description:
      'This session explores how systems thinking can help DevRel teams move beyond reactive execution and build scalable, resilient programs that influence developer adoption and business growth.',
    tags: ['Systems Thinking', 'Strategy', 'DevRel'],
    // "How to Apply Systems Thinking to Modern DevRel"
    videoId: '6tizB3MZnMI',
  },
  {
    num: '06',
    season: 2,
    date: '2026-08-05',
    title: 'Why Great Products Still Fail to Win Developers',
    speaker: 'Adewale "Ace" Abati, Staff Developer Advocate, Block',
    description:
      'Every year, technically exceptional products struggle to gain traction while others with comparable capabilities become the tools developers recommend, contribute to, and build their careers around. Adewale "Ace" Abati explores the strategic role Developer Relations plays in turning technical excellence into developer adoption.',
    tags: ['Developer Adoption', 'Product', 'DevRel'],
    // "The Best form of Developer Marketing is Word of Mouth"
    videoId: 'e3W75gxqTAw',
  },
]

// Compared date-only, so a session stays "upcoming" for the whole day it runs
// rather than flipping to past at midnight UTC while people are still joining.
function isPast(s: Session): boolean {
  if (!s.date) return true
  return s.date < new Date().toISOString().slice(0, 10)
}

/**
 * Completed sessions, most recent first — the newest recording is the one worth
 * showing at the top.
 *
 * Ordered by date rather than session number so the ordering survives a session
 * being numbered out of sequence. Early sessions have no recorded date; they're
 * the oldest, so they sort to the bottom, with the session number breaking ties
 * between them.
 */
export function getPastSessions(): Session[] {
  return sessions.filter(isPast).sort((a, b) => {
    if (a.date && b.date) return b.date.localeCompare(a.date)
    if (a.date) return -1
    if (b.date) return 1
    return b.num.localeCompare(a.num)
  })
}

/** Scheduled sessions, soonest first. */
export function getUpcomingSessions(): Session[] {
  return sessions
    .filter((s) => !isPast(s))
    .sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''))
}

/** 'Friday, 17 July 2026' — matches how dates were written on the site before. */
export function formatSessionDate(iso: string): string {
  // Parsed as UTC noon so the weekday can't shift under a negative timezone.
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** The season the series is currently on — the highest one that has a session. */
export function currentSeasonNumber(): number {
  return sessions.reduce((max, s) => Math.max(max, s.season), 1)
}

export function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`
}
