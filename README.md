# Oleksiy Stetsyuk — CV-as-Code

Live Web CV: **https://ostetsyuk.github.io/**
Direct ATS PDF: **https://ostetsyuk.github.io/Oleksiy_Stetsyuk_CV.pdf**
AI / LLM Summary: **https://ostetsyuk.github.io/llms.txt**
JSON Resume: **https://ostetsyuk.github.io/cv.json**

## Architecture

Single source of truth (`data/cv.yaml`) compiled automatically on every push to `main` via GitHub Actions:

```text
data/cv.yaml
  ├── scripts/validate-cv.mjs          → Schema & privacy checks (blocks accidental PII leaks)
  ├── RenderCV + Typst (uvx)           → public/Oleksiy_Stetsyuk_CV.pdf (2-page ATS PDF)
  └── Astro + Tailwind CSS             → Static Web CV (EN/UA, Dark/Light, Skill Filter, ⌘K CLI)
        ├── /llms.txt                  → Structured plain-Markdown for AI recruiters & agents
        └── /cv.json                   → JSON Resume v1 schema
```

## Local Development

```bash
pnpm install
pnpm check       # Validate data/cv.yaml + TypeScript/Astro check
pnpm pdf:build   # Render public/Oleksiy_Stetsyuk_CV.pdf via RenderCV/Typst
pnpm dev         # Local dev server
pnpm build       # Production static build -> dist/
```
