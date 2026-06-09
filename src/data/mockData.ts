export interface ScheduleEntry {
  id: string;
  days: string[];
  startTime: string;
  endTime: string;
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  role: string;
  superpower: string;
  skills: string[];
  certifications: string[];
  email: string;
  linkedin: string;
  calendly: string;
  currentProject: string;
  isAvailable: boolean;
  avatarUrl: string;
  password?: string;
  theme?: string;
  layout?: string;
  views?: number;
  viewsHistory?: { date: string; count: number }[];
  officeHours?: string;
  officeDay?: string;
  officeStartTime?: string;
  officeEndTime?: string;
  schedule?: ScheduleEntry[];
  customColor1?: string;
  customColor2?: string;
}

export const mockUsers: UserProfile[] = [
  {
    id: "1",
    username: "elina-mikelsone",
    name: "Elīna Miķelsone",
    role: "Head of RTU Design Factory",
    superpower: "Coopetition visionary and creator of 'Idea Circus' and 'Idea Poker'.",
    skills: ["Idea Management", "Innovation Generation", "Mentorship", "Strategy"],
    certifications: ["Master Innovator", "WOIC Best Practice Winner 2025"],
    email: "elina.mikelsone@rtu.lv",
    linkedin: "https://linkedin.com/in/elina-mikelsone",
    calendly: "https://calendly.com/elina-mikelsone",
    currentProject: "Preparing for International Design Factory Week (IDFW '26)",
    isAvailable: true,
    avatarUrl: "/avatars/elina.png",
    password: "designfactory2026",
    theme: "default",
    layout: "vertical",
    views: 0
  },
  {
    id: "2",
    username: "liene-briede",
    name: "Liene Briede",
    role: "Vice-Rector for Innovations at RTU",
    superpower: "Fostering deep tech talent and building Baltic innovation ecosystems.",
    skills: ["Ecosystem Building", "Deep Tech", "Strategic Partnerships", "Leadership"],
    certifications: ["EIC Ambassador"],
    email: "liene.briede@rtu.lv",
    linkedin: "https://linkedin.com/in/lienebriede",
    calendly: "https://calendly.com/liene-briede",
    currentProject: "Strengthening university-industry cooperation across Europe",
    isAvailable: false,
    avatarUrl: "/avatars/liene.png",
    password: "designfactory2026",
    theme: "default",
    layout: "vertical",
    views: 0
  },
  {
    id: "3",
    username: "katrina-keke",
    name: "Katrīna Ķeķe",
    role: "Communications & Project Management",
    superpower: "Mastermind of cultural initiatives and communication strategies.",
    skills: ["Public Relations", "Event Organization", "Cultural Management", "Networking"],
    certifications: ["LaKA Board Member"],
    email: "katrina.keke@rtu.lv",
    linkedin: "https://linkedin.com/in/katrinakeke",
    calendly: "https://calendly.com/katrina-keke",
    currentProject: "Coordinating 'radi! akadēmiju' initiatives",
    isAvailable: true,
    avatarUrl: "/avatars/katrina.png",
    password: "designfactory2026",
    theme: "default",
    layout: "vertical",
    views: 0
  },
  {
    id: "4",
    username: "kristine-kramena",
    name: "Kristīne Kramēna",
    role: "EIT Food Representative at RTU",
    superpower: "Connecting Latvian food innovators with the European Institute of Innovation.",
    skills: ["Project Coordination", "European Grants", "Food Innovation", "Community Building"],
    certifications: ["EIT Food Expert"],
    email: "kristine.kramena@rtu.lv",
    linkedin: "https://linkedin.com/in/kristinekramena",
    calendly: "https://calendly.com/kristine-kramena",
    currentProject: "Expanding the EIT Food community in Latvia (2026-2028)",
    isAvailable: true,
    avatarUrl: "/avatars/kristine.png",
    password: "designfactory2026",
    theme: "default",
    layout: "vertical",
    views: 0
  },
  {
    id: "5",
    username: "daniela-hrapane",
    name: "Daniela Hrapāne",
    role: "Media & Photography Specialist",
    superpower: "Capturing the essence of innovation through a camera lens.",
    skills: ["Photography", "Media Production", "Visual Storytelling", "Event Coverage"],
    certifications: ["Pro Photographer"],
    email: "daniela.hrapane@rtu.lv",
    linkedin: "https://linkedin.com/in/danielahrapane",
    calendly: "https://calendly.com/daniela-hrapane",
    currentProject: "Documenting 'BioPhoT Radars' and RTU Science Centre events",
    isAvailable: true,
    avatarUrl: "/avatars/daniela.png",
    password: "designfactory2026",
    theme: "default",
    layout: "vertical",
    views: 0
  }
];
