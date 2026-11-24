# CLAUDE.md — Maintenance Guide for `ostetsyuk.github.io`

## Project Overview

This repository is the **CV-as-Code** platform for **Oleksiy Stetsyuk**, deployed to **https://ostetsyuk.github.io/** via GitHub Pages (GitHub Organization: `ostetsyuk`).

- **Single Source of Truth:** `data/cv.yaml` (bilingual `en` + `ua`).
- **Outputs generated from `data/cv.yaml`:**
  1. Static Web CV (`src/pages/index.astro`, Astro 5 + Tailwind CSS v4)
  2. 2-page ATS PDF (`public/Oleksiy_Stetsyuk_CV.pdf`, RenderCV + Typst via `uvx`)
  3. AI-readable Markdown profile (`src/pages/llms.txt.ts` → `/llms.txt`)
  4. JSON Resume v1 (`src/pages/cv.json.ts` → `/cv.json`)

## Non-Negotiable Rules

1. **No PII Leaks:** NEVER commit personal phone numbers (`+380...`), home addresses, or private tokens into `data/cv.yaml` or any file in this public repo. `scripts/validate-cv.mjs` enforces this check in CI.
2. **Keep ATS PDF Strictly 2 Pages:** After any content edit in `data/cv.yaml`, run `pnpm pdf:build` and verify the generated `public/Oleksiy_Stetsyuk_CV.pdf` stays **2 pages** with no orphan headers or text overlaps.
3. **Bilingual Parity:** Every user-facing field added to `data/cv.yaml` MUST include both `en` and `ua` text.
4. **Lockfile & Package Manager:** `package.json` pins `"packageManager": "pnpm@12.21.0"`, and `pnpm-workspace.yaml` allows `esbuild` and `sharp` builds. After changing `package.json`, always run `pnpm install` so `pnpm-lock.yaml` stays compatible with `--frozen-lockfile` in CI.
5. **Modern Web Patterns:**
   - Dark mode uses `<meta name="color-scheme" content="light dark">` + `:root:has(> head > meta[name="color-scheme"]...)` + CSS `light-dark()`. Do not replace with `.dark` body classes.
   - The `>_ CLI` modal uses native `<dialog closedby="any">` + Safari bounding-rect fallback + `overscroll-behavior: contain` on `dialog:modal` and `dialog::backdrop` (`overflow: hidden`). Never lock `html`/`body` overflow.

## Verification Checklist Before Pushing

```bash
pnpm check        # Validates data/cv.yaml schema/privacy + Astro TypeScript diagnostics
pnpm pdf:build    # Regenerates public/Oleksiy_Stetsyuk_CV.pdf via RenderCV/Typst
pnpm build        # Builds dist/ (HTML, /llms.txt, /cv.json, PDF)
```

Verify PDF page count = 2 and `0` phone occurrences:
```bash
python3 -c 'import re; print("Pages:", len(re.findall(rb"/Type\s*/Page\b", open("public/Oleksiy_Stetsyuk_CV.pdf","rb").read())))'
pdftotext public/Oleksiy_Stetsyuk_CV.pdf - | grep -c "+380" || true
```

## Companion Assets

- **GitHub Profile README (`stetsyuka/stetsyuka`):** mirrored from `PROFILE_README.md`. Update both when headline achievements, courses, or stack change.
- **Featured YouTube Channel (`InferenceLab`):** `https://www.youtube.com/@inference_lab` (playlists and `stetsyuka/pulse-platform` are managed under `courses_and_repos` in `data/cv.yaml`).
