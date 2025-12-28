 interface Activity {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

 interface Milestone {
  id: string;
  title: string;
  color: 'organization' | 'self' | 'valley' | 'enrichment' | 'service' | 'choice';
  activities: Activity[];
}

export const milestones: Milestone[] = [
  {
    id: 'organization',
    title: 'Organization',
    color: 'organization',
    activities: [
      { id: 'org-1', title: 'Attend Lodge Meeting', description: 'Participate in a regular lodge meeting and observe the proceedings.', completed: false },
      { id: 'org-2', title: 'Learn Lodge Officers', description: 'Memorize the names and roles of all lodge officers.', completed: false },
      { id: 'org-3', title: 'Study Lodge Bylaws', description: 'Read and understand the bylaws of your lodge.', completed: false },
      { id: 'org-4', title: 'Meet District Officers', description: 'Introduce yourself to district leadership.', completed: false },
    ]
  },
  {
    id: 'self',
    title: 'Self',
    color: 'self',
    activities: [
      { id: 'self-1', title: 'Daily Reflection', description: 'Practice daily reflection on your actions and thoughts.', completed: false },
      { id: 'self-2', title: 'Read Masonic Literature', description: 'Complete reading one book on Masonic philosophy.', completed: false },
      { id: 'self-3', title: 'Personal Goal Setting', description: 'Set and document three personal improvement goals.', completed: false },
      { id: 'self-4', title: 'Mentorship Meeting', description: 'Meet with your mentor to discuss your progress.', completed: false },
    ]
  },
  {
    id: 'valley',
    title: 'Valley',
    color: 'valley',
    activities: [
      { id: 'val-1', title: 'Valley Orientation', description: 'Complete the Valley orientation program.', completed: false },
      { id: 'val-2', title: 'Attend Valley Event', description: 'Participate in a Valley-sponsored event.', completed: false },
      { id: 'val-3', title: 'Learn Valley History', description: 'Study the history of your local Valley.', completed: false },
    ]
  },
  {
    id: 'enrichment',
    title: 'Enrichment',
    color: 'enrichment',
    activities: [
      { id: 'enr-1', title: 'Educational Workshop', description: 'Attend an educational workshop or seminar.', completed: false },
      { id: 'enr-2', title: 'Skill Development', description: 'Learn a new skill that benefits the lodge.', completed: false },
      { id: 'enr-3', title: 'Present to Lodge', description: 'Prepare and deliver a presentation to your lodge.', completed: false },
    ]
  },
  {
    id: 'service',
    title: 'Service',
    color: 'service',
    activities: [
      { id: 'srv-1', title: 'Community Service', description: 'Participate in a community service project.', completed: false },
      { id: 'srv-2', title: 'Charity Event', description: 'Help organize or participate in a charity event.', completed: false },
      { id: 'srv-3', title: 'Mentor New Member', description: 'Serve as a guide for a newer member.', completed: false },
    ]
  },
  {
    id: 'choice',
    title: 'Choice',
    color: 'choice',
    activities: [
      { id: 'cho-1', title: 'Personal Project', description: 'Complete a self-directed Masonic project.', completed: false },
      { id: 'cho-2', title: 'Advanced Study', description: 'Complete advanced study in an area of interest.', completed: false },
    ]
  }
];
