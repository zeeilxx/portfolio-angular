export interface Internship {
  id: string;
  documentation?: string;
  certificate?: string;
  organization: string;
  team: string;
  role: string;
  period: string;
  website: string;
  url: string;
  summary: string;
  responsibilities: string[];
  stacks: { label: string; technologies: string[] }[];
}
