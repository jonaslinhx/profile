# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A writing-first personal website for Jonas Lim Hong Xiang, hosted on GitHub Pages. No build step — pure static files (HTML, CSS, vanilla JS). Deployment happens automatically on push to `main` via `.github/workflows/deploy.yml`.

## Working Principles

- Keep implementation static and simple; never add a build step unless explicitly asked.
- Preserve single-page tabbed navigation (`Home`, `About`) unless requested otherwise.
- `Home` is the primary experience: profile header + writing feed + in-page article reading.
- Never remove profile links (email, LinkedIn, GitHub, resume PDF) from the header or footer CTA.
- Keep changes mobile-friendly and accessible.
- Prefer updating structured content sources (`posts/*.md`, `content/site.json`) over hardcoding content in HTML/JS.
- Do not delete user content without an explicit request. If uncertain about factual profile details, ask before changing them.

## Publishing a Post

1. Create `posts/YYYY-MM-DD-short-title.md` with frontmatter:
   ```md
   ---
   title: Post Title
   date: 2026-03-01
   category: project-reflection
   summary: One sentence shown on the post card.
   tags: ml, systems, reflection
   linkedin_url: https://... (optional)
   ---
   ```
2. Add the filename to `content/site.json` under `posts`.
3. Push to `main`.

Posts **only appear if listed in `content/site.json`**. Display order is sorted by `date` (newest first) in `scripts/posts.js`, not by `site.json` order. If `category` is missing it defaults to `general`.

## Post Writing Style

When drafting posts, default to:
- Friendly, conversational tone with light humor — not overly formal.
- Narrative paragraph style; avoid excessive bullet lists unless explicitly requested.
- Section flow: concise intro → personal context/background → core motivation/thesis → short closing with what readers can expect.
- Concise paragraphs, no wall-of-text, practical takeaways over abstract phrasing.
- Preserve the author's voice: reflective, pragmatic, and approachable.

## Single Config File

`content/site.json` controls everything: profile name, tagline, contact links, resume PDF path, and which posts are visible. It is fetched at runtime by `scripts/profile.js` and `scripts/posts.js`.

To switch the downloadable resume PDF: add the new file to `assets/` and update `profile.contacts.resumePdf` in `site.json`.

## Architecture

The site is a single HTML page (`index.html`) with two tabs: **Home** and **About**. Tab switching is handled by `scripts/main.js`.

Home tab runtime flow:
1. `scripts/profile.js` fetches `content/site.json` → renders the profile header and footer CTA (name, tagline, contact chips).
2. `scripts/posts.js` fetches `content/site.json` → fetches each listed post markdown file → parses frontmatter and markdown via `scripts/markdown.js` → renders the post feed.
3. Clicking a post card renders it in-page without a page reload. Desktop shows a two-column feed + article pane; mobile switches to a full-screen article view with a back button (`.home-reader.reading` CSS class toggle).

CSS is split into four layers: `tokens.css` (design tokens) → `base.css` (global typography) → `components.css` (nav, chips, cards) → `sections.css` (home reader layout, article styles).

## Resume (`resume/`)

`resume/index.html` is the general-purpose resume (current working draft). `resume/micron.html` is a role-specific variant. Both are print-first HTML files exported to PDF via headless Chrome.

### Hard Constraints

- **2 A4 pages maximum** — if content exceeds 2 pages, reduce verbosity before reducing legibility (shorten bullets, merge repetitive ones, remove low-signal details).
- No section may split across pages. If a section doesn't fit, move the entire section to the next page.
- Section heading must stay with at least the first content block of its section.
- Dates for role entries must remain visible on the same page as their corresponding role title.

### Pagination Rules

- Use `@page { size: A4; }` with stable margins.
- Apply `break-inside: avoid` (and `page-break-inside: avoid` as fallback) to each section container, each role/entry block, and compact grouped lists.
- Never use blank lines or spacer divs for page control — use CSS page-break rules only.

### Resume Design System

**Typography** — use one sans-serif system stack for consistent PDF rendering:
- Name: 24–30px | Section headers: 11–13px uppercase | Body/bullets: 11–12.5px | Meta/date: 10.5–12px
- Line height 1.3–1.45 for body. No decorative, icon, or script fonts.

**Layout** — single-column only. Tight but breathable spacing: section gap 8–14px, entry gap 6–12px, bullet gap 2–4px.

**Color** — neutral professional palette: primary text near-black, muted gray for metadata, one restrained accent for section labels/links. High contrast for print and grayscale.

**Content** — reverse-chronological order. Bullets: action + scope + outcome. Consistent punctuation and tense within each section. Prefer ASCII punctuation for PDF portability.

**Links** — email, LinkedIn, GitHub must be visible in the header and readable as plain text when printed.

### Quality Gate Before Exporting

- Final HTML prints to 1–2 A4 pages only.
- No section splits across pages; no headings orphaned at page bottom.
- All dates, titles, and company names align correctly in print preview.
- Contact links are present and correct.

### Resume Versioning

`resume/index.html` is the working draft. `resume/versions/` holds snapshots tailored to specific roles. `resume/versions/index.json` is the master tracker.

**Workflow for a new tailored version:**
1. Edit `resume/index.html` for the target role.
2. Copy it: `cp resume/index.html resume/versions/YYYY-MM-DD-[target].html`
3. Add an entry to `resume/versions/index.json`:
   ```json
   {
     "id": "2026-05-20-govtech-ml",
     "file": "2026-05-20-govtech-ml.html",
     "label": "GovTech ML Engineer",
     "target": "GovTech",
     "date": "2026-05-20",
     "status": "active",
     "notes": "",
     "applications": []
   }
   ```
4. Export to PDF (see below).

**Tracking applications** — add entries to the version's `applications` array:
```json
{ "company": "GovTech", "role": "Senior ML Engineer", "date": "2026-05-20", "outcome": "applied" }
```
Valid `outcome` values: `applied`, `screening`, `interviewed`, `offered`, `rejected`, `declined`.
Valid `status` values: `draft`, `active`, `archived`.

### Export to PDF

```bash
base="/Users/jonaslim/repo/profile/assets/IMDA-SG-Digital-Scholar-Resume-Jonas-Lim-Hong-Xiang"
out="${base}.pdf"
i=1
while [ -e "$out" ]; do
  out="${base}(${i}).pdf"
  i=$((i+1))
done

'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' \
  --headless=new \
  --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf="$out" \
  'file:///Users/jonaslim/repo/profile/resume/index.html'
```

Verify after export:
```bash
pdfinfo "$out" | rg 'Pages|Page size|Title'
```

### Extract Text From PDF

```bash
pdftotext -layout /Users/jonaslim/repo/profile/assets/IMDA-SG-Digital-Scholar-Resume-Jonas-Lim-Hong-Xiang.pdf - | sed -n '1,220p'
```

`-layout` preserves spacing/alignment for resume parsing. Output to stdout (`-`) avoids intermediate files.

## Site Design System

Neutral, editorial palette (Medium-inspired):
- Background `#FAFAF8`, Surface `#FFFFFF`, Primary text `#1F2328`, Secondary `#5F6670`, Border `#E6E8EB`, Accent `#2B6CB0`
- Heading font: `Space Grotesk`; UI/body: `IBM Plex Sans`; Article content: `Source Serif 4`

## Pre-Push Checklist

- New posts are in `posts/` and listed in `content/site.json`.
- Frontmatter has `title`, `date` (YYYY-MM-DD), `category`, and `summary`.
- If resume PDF changed: new file is in `assets/` and `profile.contacts.resumePdf` in `site.json` points to it.
- No references to removed legacy files (`content/resume.json`, `content/profile.json`, `posts/index.json`).
- `git status` shows only intended changes before committing.
