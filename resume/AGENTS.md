# AGENTS

## Purpose
This folder contains a print-first HTML resume that will be exported to PDF for job applications.
All edits in `resume/` must preserve recruiter readability, ATS-friendliness, and reliable pagination.

## Hard Constraints
- Resume output must be **2 pages maximum** in A4 PDF.
- Do not allow a section to split across pages.
- If a full section cannot fit on the current page, move the entire section to the next page.
- Section heading must stay with at least the first content block of that section.
- Dates for role entries must remain visible on the same page as their corresponding role title.

## Pagination Rules
- Use print CSS targeting A4 (`@page { size: A4; }`) with stable margins.
- Apply `break-inside: avoid` (and `page-break-inside: avoid` fallback) to:
  - each section container
  - each role/entry block
  - compact grouped lists where splitting harms readability
- Avoid manual blank lines or spacer divs for page control; use CSS page-break rules instead.
- If content exceeds 2 pages, reduce verbosity before reducing legibility:
  - shorten bullets
  - merge repetitive bullets
  - remove low-signal details

## Resume Design System

### Typography
- Keep one sans-serif system stack for consistency and reliable PDF rendering.
- Font sizes must stay in an ATS-safe readable range:
  - Name: 24-30px
  - Section headers: 11-13px uppercase
  - Body/bullets: 11-12.5px
  - Meta/date text: 10.5-12px
- Line height: 1.3-1.45 for body text.
- Avoid decorative fonts, icon fonts, or script fonts.

### Layout & Spacing
- Single-column layout only.
- Keep horizontal alignment consistent for role/title/date rows.
- Use tight but breathable spacing:
  - section gap: 8-14px
  - entry gap: 6-12px
  - bullet gap: 2-4px
- Do not use large visual blocks that waste vertical space (oversized banners/hero blocks).

### Color & Visual Style
- Use neutral, professional palette:
  - primary text near-black
  - muted gray for metadata
  - one restrained accent for section labels/links
- Maintain high contrast for print and grayscale photocopying.
- Avoid heavy backgrounds, gradients, or decorative shapes in the resume document.

### Content Formatting
- Use reverse-chronological order for education, experience, and certifications.
- Bullets should be concise and impact-oriented (action + scope + outcome where possible).
- Keep punctuation and tense consistent within each section.
- Prefer standard ASCII punctuation for portability in PDF renderers.

### Link & Contact Rules
- Keep email, LinkedIn, and GitHub visible in the header.
- Links must be readable as plain text even when printed.
- Do not rely on color alone to convey critical information.

## Quality Gate Before Finalizing
- Confirm final HTML prints to **1-2 A4 pages only**.
- Confirm no section is split across pages.
- Confirm headings are not orphaned at the bottom of a page.
- Confirm all dates, titles, and company names align correctly in print preview.
- Confirm contact links are present and correct.

## HTML to PDF Conversion
- Preferred converter is local headless Chrome.
- Output filename convention:
  - Primary filename: `IMDA-SG-Digital-Scholar-Resume-Jonas-Lim-Hong-Xiang.pdf`
  - If that file already exists, create `IMDA-SG-Digital-Scholar-Resume-Jonas-Lim-Hong-Xiang(1).pdf`, then `(2)`, etc.
- Use this command pattern from the repo root:
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
- Requirement: exported PDF must not contain browser-generated headers/footers (date, URL, page title).
- After export, verify page count and size:
```bash
pdfinfo "$out" | rg 'Pages|Page size|Title'
```

## Source Text Extraction From PDF
- Use `pdftotext` as the default extraction method for resume source PDFs.
- Preferred command:
```bash
pdftotext -layout /Users/jonaslim/repo/profile/assets/IMDA-SG-Digital-Scholar-Resume-Jonas-Lim-Hong-Xiang.pdf - | sed -n '1,220p'
```
- Notes:
  - `-layout` preserves spacing/alignment better for resume parsing.
  - Output to stdout (`-`) allows quick review and copy without intermediate files.
