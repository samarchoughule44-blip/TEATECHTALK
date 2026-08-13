export type LeaderboardEntry = {
  rank: number;
  id: string;
  name: string;
  department: string;
  year: string;
  points: number;
  badges: number;
  activityCount: number;
  avatarInitials: string;
};

export const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, id: "u1", name: "Alex Rivera", department: "Computer Engineering", year: "3rd Year", points: 4820, badges: 7, activityCount: 32, avatarInitials: "AR" },
  { rank: 2, id: "u2", name: "Sarah Khan", department: "Information Technology", year: "4th Year", points: 4310, badges: 6, activityCount: 28, avatarInitials: "SK" },
  { rank: 3, id: "u3", name: "Jamie Chen", department: "Computer Engineering", year: "2nd Year", points: 3990, badges: 5, activityCount: 25, avatarInitials: "JC" },
  { rank: 4, id: "u4", name: "Sam River", department: "AI & Data Science", year: "3rd Year", points: 3540, badges: 5, activityCount: 22, avatarInitials: "SR" },
  { rank: 5, id: "u5", name: "Taylor Kim", department: "Information Technology", year: "2nd Year", points: 3210, badges: 4, activityCount: 19, avatarInitials: "TK" },
  { rank: 6, id: "u6", name: "Casey Jones", department: "Computer Engineering", year: "1st Year", points: 2980, badges: 3, activityCount: 17, avatarInitials: "CJ" },
  { rank: 7, id: "u7", name: "Alex Li", department: "Electronics", year: "3rd Year", points: 2760, badges: 4, activityCount: 15, avatarInitials: "AL" },
  { rank: 8, id: "u8", name: "Priya Nair", department: "AI & Data Science", year: "2nd Year", points: 2540, badges: 3, activityCount: 14, avatarInitials: "PN" },
  { rank: 9, id: "u9", name: "Devon Marsh", department: "Computer Engineering", year: "4th Year", points: 2310, badges: 2, activityCount: 12, avatarInitials: "DM" },
  { rank: 10, id: "u10", name: "Riya Sharma", department: "Information Technology", year: "1st Year", points: 2100, badges: 3, activityCount: 11, avatarInitials: "RS" },
];

export type Activity = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: "Typing" | "Quiz";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  participants: number;
  rewardPoints: string;
  status: "Live Now" | "Upcoming" | "Closed";
};

export const activitiesData: Activity[] = [
  {
    id: "a1",
    slug: "typing-speed-challenge",
    title: "Speed Typing Trial",
    description: "Test your typing speed and accuracy across curated technical passages. Compete for the fastest net WPM on the board.",
    category: "Typing",
    difficulty: "Intermediate",
    duration: "30 / 60 / 120 sec",
    participants: 482,
    rewardPoints: "50 - 200 pts",
    status: "Live Now",
  },
  {
    id: "a2",
    slug: "tech-quiz-challenge",
    title: "Tech Trivia Challenge",
    description: "Ten rapid-fire questions spanning AI, web dev, networking, DBMS and core CS. Answer fast, answer right.",
    category: "Quiz",
    difficulty: "Advanced",
    duration: "10 min",
    participants: 356,
    rewardPoints: "100 pts / quiz",
    status: "Live Now",
  },
];

export const statsData = [
  { label: "Active Members", value: 1240 },
  { label: "Events Hosted", value: 68 },
  { label: "Points Awarded", value: 182000 },
  { label: "Certificates Issued", value: 410 },
];
