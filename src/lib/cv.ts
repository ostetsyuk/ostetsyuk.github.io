import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

export interface BiText {
  en: string;
  ua: string;
}

export interface CVData {
  meta: {
    site_url: string;
    pdf_path: string;
    repo_url: string;
    github_username: string;
    updated: string;
  };
  profile: {
    name: BiText;
    title: BiText;
    subtitle: BiText;
    location: BiText;
    availability: BiText;
    email: string;
    linkedin: string;
    linkedin_label: string;
    github: string;
    github_label: string;
    summary: BiText;
  };
  impact: Array<{
    value: string;
    unit: BiText;
    label: BiText;
    detail: BiText;
  }>;
  skills: Array<{
    id: string;
    category: BiText;
    items: string[];
    tags: string[];
  }>;
  case_studies: Array<{
    id: string;
    number: string;
    context: BiText;
    title: BiText;
    metric: BiText;
    summary: BiText;
    architecture: string[];
    delivery: BiText;
    tags: string[];
  }>;
  experience: Array<{
    id: string;
    role: BiText;
    company: string | BiText;
    location: BiText;
    period: BiText;
    bullets: { en: string[]; ua: string[] };
    tech: string[];
    tags: string[];
  }>;
  education: Array<{
    degree: BiText;
    institution: BiText;
    year: string;
  }>;
  additional: {
    languages: BiText;
    writing: BiText;
  };
}

let cached: CVData | null = null;

export function loadCV(): CVData {
  if (cached) return cached;
  const raw = fs.readFileSync(path.join(process.cwd(), 'data/cv.yaml'), 'utf8');
  cached = yaml.load(raw) as CVData;
  return cached;
}

export function companyText(company: string | BiText, lang: 'en' | 'ua'): string {
  return typeof company === 'string' ? company : company[lang];
}
