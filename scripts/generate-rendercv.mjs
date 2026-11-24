import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const root = path.resolve(import.meta.dirname, '..');
const cv = yaml.load(fs.readFileSync(path.join(root, 'data/cv.yaml'), 'utf8'));

const experienceEntries = cv.experience.map((e) => {
  const company = typeof e.company === 'string' ? e.company : e.company.en;
  const highlights = [...e.bullets.en, `**Tech:** ${e.tech.join(', ')}`];
  return {
    company,
    position: e.role.en,
    location: e.location.en,
    date: e.period.en,
    highlights,
  };
});

const skillEntries = cv.skills.map((s) => ({
  label: s.category.en,
  details: s.items.join(', '),
}));

const independent = cv.case_studies.find((c) => c.id === 'agentic-sre-homelab');

const educationEntries = cv.education.map((ed) => ({
  name: `**${ed.degree.en}** — ${ed.institution.en}`,
  date: String(ed.year),
}));

const rendercvDoc = {
  cv: {
    name: cv.profile.name.en,
    headline: cv.profile.title.en,
    location: cv.profile.location.en,
    email: cv.profile.email,
    website: cv.meta.site_url,
    social_networks: [
      { network: 'LinkedIn', username: 'stetsyuk' },
      { network: 'GitHub', username: cv.meta.github_username },
    ],
    sections: {
      professional_summary: [cv.profile.summary.en],
      core_skills: skillEntries,
      professional_experience: experienceEntries,
      ...(independent
        ? {
            independent_engineering_2026: [
              {
                name: independent.title.en,
                date: '2026',
                highlights: [
                  independent.summary.en,
                  independent.delivery.en,
                ],
              },
            ],
          }
        : {}),
      education: educationEntries,
      additional: [
        { label: 'Languages', details: cv.additional.languages.en },
        { label: 'Technical courses & OSS', details: cv.additional.courses_summary.en },
        { label: 'Professional writing', details: cv.additional.writing.en },
      ],
    },
  },
  design: {
    theme: 'classic',
    page: {
      size: 'a4',
      top_margin: '1.05cm',
      bottom_margin: '1.05cm',
      left_margin: '1.3cm',
      right_margin: '1.3cm',
      show_footer: false,
      show_top_note: false,
    },
    colors: {
      name: 'rgb(15, 23, 42)',
      section_titles: 'rgb(15, 118, 110)',
      links: 'rgb(15, 118, 110)',
      body: 'rgb(20, 23, 26)',
    },
    typography: {
      font_size: {
        body: '8.8pt',
        name: '18pt',
        headline: '10pt',
        section_titles: '10pt',
      },
      line_spacing: '0.43em',
    },
    section_titles: {
      space_above: '0.28cm',
      space_below: '0.14cm',
    },
    entries: {
      allow_page_break: false,
    },
  },
};

fs.mkdirSync(path.join(root, 'pdf'), { recursive: true });
fs.mkdirSync(path.join(root, 'public'), { recursive: true });
const outPath = path.join(root, 'pdf/rendercv_en.yaml');
fs.writeFileSync(outPath, yaml.dump(rendercvDoc, { lineWidth: 110, noRefs: true }), 'utf8');
console.log('Generated RenderCV config:', outPath);
