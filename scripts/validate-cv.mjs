import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const root = path.resolve(import.meta.dirname, '..');
const raw = fs.readFileSync(path.join(root, 'data/cv.yaml'), 'utf8');
const cv = yaml.load(raw);

const errors = [];
const req = (cond, msg) => { if (!cond) errors.push(msg); };

req(cv?.profile?.name?.en && cv?.profile?.name?.ua, 'profile.name.en and ua required');
req(cv?.profile?.email && !raw.includes('+380'), 'email required and phone number must not appear in public cv.yaml');
req(Array.isArray(cv?.impact) && cv.impact.length === 4, 'impact must have 4 entries');
req(Array.isArray(cv?.skills) && cv.skills.length >= 6, 'skills must have >= 6 categories');
req(Array.isArray(cv?.case_studies) && cv.case_studies.length >= 3, 'case_studies must have >= 3 entries');
req(Array.isArray(cv?.experience) && cv.experience.length >= 4, 'experience must have >= 4 entries');
req(Array.isArray(cv?.education) && cv.education.length >= 1, 'education required');

for (const exp of cv.experience ?? []) {
  req(exp.bullets?.en?.length > 0 && exp.bullets?.ua?.length > 0, `experience ${exp.id} must have en & ua bullets`);
}

if (errors.length > 0) {
  console.error('CV validation failed:\n- ' + errors.join('\n- '));
  process.exit(1);
}
console.log(`CV valid: ${cv.profile.name.en} (${cv.experience.length} roles, ${cv.case_studies.length} case studies, ${cv.skills.length} skill groups)`);
