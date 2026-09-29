export interface PortfolioProject {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  images?: { src: string; caption: string }[];
  url?: string;
  tags: string[];
  year: string;
}
