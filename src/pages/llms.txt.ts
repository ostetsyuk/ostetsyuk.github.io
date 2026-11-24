import type { APIRoute } from 'astro';
import { companyText, loadCV } from '../lib/cv';

export const GET: APIRoute = () => {
  const cv = loadCV();
  const lines: string[] = [
    `# ${cv.profile.name.en} — ${cv.profile.title.en}`,
    '',
    `> ${cv.profile.subtitle.en}`,
    '',
    `- **Location:** ${cv.profile.location.en}`,
    `- **Email:** ${cv.profile.email}`,
    `- **Web CV:** ${cv.meta.site_url}`,
    `- **ATS PDF:** ${cv.meta.site_url}${cv.meta.pdf_path}`,
    `- **JSON Resume:** ${cv.meta.site_url}/cv.json`,
    `- **LinkedIn:** ${cv.profile.linkedin}`,
    `- **GitHub:** ${cv.profile.github}`,
    `- **YouTube (${cv.profile.youtube_label}):** ${cv.profile.youtube}`,
    `- **Last Updated:** ${cv.meta.updated}`,
    '',
    '## Professional Summary',
    cv.profile.summary.en,
    '',
    '## Key Metrics',
    ...cv.impact.map((m) => `- **${m.value} ${m.unit.en}** — ${m.label.en}: ${m.detail.en}`),
    '',
    '## Core Skills',
    ...cv.skills.map((s) => `- **${s.category.en}:** ${s.items.join(', ')}`),
    '',
    '## Featured Architecture Case Studies',
    ...cv.case_studies.flatMap((c) => [
      `### ${c.number}. ${c.title.en} (${c.context.en})`,
      `- **Scope:** ${c.metric.en}`,
      `- **Overview:** ${c.summary.en}`,
      `- **Architecture Flow:** ${c.architecture.join(' -> ')}`,
      `- **Notes:** ${c.delivery.en}`,
      '',
    ]),
    '## Professional Experience',
    ...cv.experience.flatMap((e) => [
      `### ${e.role.en} — ${companyText(e.company, 'en')} (${e.period.en}, ${e.location.en})`,
      ...e.bullets.en.map((b) => `- ${b}`),
      `- **Tech:** ${e.tech.join(', ')}`,
      '',
    ]),
    '## Open Source & Technical Courses',
    ...cv.courses_and_repos.flatMap((item) => [
      `### ${item.title.en} (${item.kind.en})`,
      `- ${item.description.en}`,
      ...item.links.map((l) => `- ${l.label.en}: ${l.url}`),
      '',
    ]),
    '## Education',
    ...cv.education.map((ed) => `- ${ed.degree.en} — ${ed.institution.en} (${ed.year})`),
    '',
    '## Additional',
    `- **Languages:** ${cv.additional.languages.en}`,
    `- **Professional Writing:** ${cv.additional.writing.en}`,
    `- **Technical Courses & OSS:** ${cv.additional.courses_summary.en}`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
