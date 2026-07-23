export type UpcomingEvent = {
  title: string
  date: string
  speaker?: string
  description: string
  link?: string
}

// Upcoming DevRel Strategy Room webinars. Add new sessions here — they appear on
// both the Events page and the homepage highlight section.
export const upcomingEvents: UpcomingEvent[] = [
  {
    title: 'Beyond the Resume: Building a Personal Brand That Opens Doors',
    date: 'Friday, 25 July 2026',
    speaker: 'Adora Nwodo',
    description:
      'The people who consistently attract speaking invitations, leadership opportunities, startup advisory roles, and global career opportunities have intentionally invested in becoming known for something beyond the code they write. Join renowned engineering leader, author, and community builder Adora Nwodo as she shares practical lessons from building a globally recognized personal brand while maintaining technical credibility.',
    link: 'https://riverside.com/webinar/registration/eyJldmVudElkIjoiNmE1OTZlYTUxYjZiYzMyYWRkOTcxZmI0Iiwic2x1ZyI6ImFuaXRhLWlodW1hbnMtc3R1ZGlvIn0=',
  },
  {
    title: 'Beyond Evangelism: Applying Systems Thinking to Modern DevRel',
    date: 'Tuesday, 28 July 2026',
    speaker: 'Rohit Ghumare',
    description:
      'This session explores how systems thinking can help DevRel teams move beyond reactive execution and build scalable, resilient programs that influence developer adoption and business growth.',
    link: 'https://riverside.com/webinar/registration/eyJldmVudElkIjoiNmE0ZTMxMjk2ZGE0NGVmN2NkZTQ5NjNlIiwic2x1ZyI6ImFuaXRhLWlodW1hbnMtc3R1ZGlvIn0=',
  },
  {
    title: 'Why Great Products Still Fail to Win Developers',
    date: 'Wednesday, 5 August 2026',
    speaker: 'Adewale "Ace" Abati, Staff Developer Advocate, Block',
    description:
      'Every year, technically exceptional products struggle to gain traction while others with comparable capabilities become the tools developers recommend, contribute to, and build their careers around. Join Adewale "Ace" Abati as he explores the strategic role Developer Relations plays in turning technical excellence into developer adoption.',
    link: 'https://riverside.com/webinar/registration/eyJldmVudElkIjoiNmE1ODkxODgxYjZiYzMyYWRkOTcxYmJiIiwic2x1ZyI6ImFuaXRhLWlodW1hbnMtc3R1ZGlvIn0=',
  },
]
