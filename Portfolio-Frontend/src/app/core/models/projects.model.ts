export interface IGithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  fork: boolean;
  default_branch: string;
  owner: { login: string };
  created_at: string;
}

export interface IProject {
  id: number;
  name: string;
  description: string;
  image_url: string[];
  technologies_used: string[];
  html_url?: string;
  downloads_url?: string;
  website_url?: string;
  created_at?: string;
}
