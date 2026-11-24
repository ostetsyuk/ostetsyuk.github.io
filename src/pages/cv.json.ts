import type { APIRoute } from 'astro';
import { companyText, loadCV } from '../lib/cv';

export const GET: APIRoute = () => {
  const cv = loadCV();
  const jsonResume = {
    $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    basics: {
      name: cv.profile.name.en,
      label: cv.profile.title.en,
      email: cv.profile.email,
      url: cv.meta.site_url,
      summary: cv.profile.summary.en,
      location: {
        region: cv.profile.location.en,
        countryCode: 'UA',
      },
      profiles: [
        { network: 'LinkedIn', username: 'stetsyuk', url: cv.profile.linkedin },
        { network: 'GitHub', username: cv.meta.github_username, url: cv.profile.github },
        { network: 'YouTube', username: 'inference_lab', url: cv.profile.youtube },
      ],
    },
    work: cv.experience.map((e) => ({
      name: companyText(e.company, 'en'),
      position: e.role.en,
      location: e.location.en,
      startDate: e.period.en.split('—')[0]?.trim() ?? e.period.en,
      endDate: e.period.en.split('—')[1]?.trim() ?? '',
      highlights: e.bullets.en,
      keywords: e.tech,
    })),
    projects: [
      ...cv.case_studies.map((c) => ({
        name: c.title.en,
        description: c.summary.en,
        highlights: [c.metric.en, c.delivery.en],
        keywords: c.tags,
      })),
      ...cv.courses_and_repos.map((cr) => ({
        name: cr.title.en,
        description: cr.description.en,
        url: cr.links[0]?.url,
        highlights: cr.links.map((l) => `${l.label.en}: ${l.url}`),
        keywords: cr.tags,
      })),
    ],
    skills: cv.skills.map((s) => ({
      name: s.category.en,
      keywords: s.items,
    })),
    education: cv.education.map((ed) => ({
      institution: ed.institution.en,
      area: ed.degree.en,
      endDate: ed.year,
    })),
    languages: [
      { language: 'Ukrainian', fluency: 'Native' },
      { language: 'English', fluency: 'Intermediate (B1-B2)' },
    ],
    meta: {
      canonical: `${cv.meta.site_url}/cv.json`,
      lastModified: cv.meta.updated,
      pdfUrl: `${cv.meta.site_url}${cv.meta.pdf_path}`,
      llmsTxtUrl: `${cv.meta.site_url}/llms.txt`,
    },
  };

  return new Response(JSON.stringify(jsonResume, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
