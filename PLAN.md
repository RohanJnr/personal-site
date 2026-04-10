# Personal Notes Site — Implementation Plan

## Decisions
- **Layout**: Layout A — Daily Journal Feed
- **Theme**: Hand-drawn sketch (Caveat + Inter + JetBrains Mono)
- **Framework**: SvelteKit + adapter-static (SSG)
- **Content**: Point build at a directory of markdown files + Assets folder

---

## Content Assumptions

The build receives a directory containing:
- Markdown files (possibly nested in folders like `APIs/`, `Databases/`, `Cloud/`, etc.)
- `Assets/Images/` for image files
- Frontmatter: `date`, `tags`, `modified`, `title` (all optional)
- Obsidian features: `[[wikilinks]]`, `> [!INFO]` callouts, `![[image]]` embeds, code blocks

Tab filters on the home page are derived from whatever tags/folders exist in the notes — not hardcoded.

---

## Project Structure

```
personal_notes_site/
├── svelte.config.js
├── vite.config.ts
├── package.json
├── .env                             # CONTENT_DIR=/path/to/notes
├── designs/                         # Layout mockups (keep)
├── static/img/                      # Motorcycle SVG for sidebar
├── src/
│   ├── app.html
│   ├── app.css                      # Hand-drawn theme
│   ├── lib/
│   │   ├── config.ts                # Site metadata
│   │   ├── types.ts                 # NoteMetadata, FolderTreeEntry
│   │   ├── content/
│   │   │   ├── index.ts             # getAllNotes(), getNoteBySlug(), getFolderTree()
│   │   │   ├── markdown.ts          # unified pipeline
│   │   │   ├── wikilinks.ts         # [[wikilinks]] → links
│   │   │   └── callouts.ts          # > [!TYPE] → styled HTML
│   │   ├── search/
│   │   │   └── index.ts             # FlexSearch client-side
│   │   └── components/
│   │       ├── Sidebar.svelte
│   │       ├── FolderTreeNode.svelte
│   │       ├── Header.svelte
│   │       ├── SearchModal.svelte
│   │       ├── NoteStream.svelte    # Daily-grouped note feed
│   │       └── TabNav.svelte        # Dynamic filter tabs from tags/folders
│   ├── routes/
│   │   ├── +layout.svelte
│   │   ├── +layout.server.ts
│   │   ├── +page.svelte             # Home: intro + tabs + feed
│   │   ├── +page.server.ts
│   │   ├── notes/[...slug]/
│   │   │   ├── +page.svelte
│   │   │   └── +page.server.ts
│   │   └── api/search-index.json/
│   │       └── +server.ts
```

---

## Phases

### Phase 1: Scaffolding
1. Init SvelteKit (skeleton, TypeScript)
2. Install deps: adapter-static, unified, remark-parse, remark-gfm, remark-rehype, rehype-stringify, rehype-highlight, rehype-slug, gray-matter, flexsearch
3. Configure adapter-static, `.env`, vite fs.allow
4. `app.html` with fonts, `app.css` with Layout A theme

### Phase 2: Content Pipeline
5. `types.ts` — NoteMetadata, FolderTreeEntry
6. `content/index.ts` — walk CONTENT_DIR, parse frontmatter, build folder tree
   - Date: `modified` → `date` → file mtime
   - Title: frontmatter `title` → filename (sans .md)
   - Slug: relative path, URL-encoded
   - Tags: from frontmatter, also infer parent folder as a tag
   - Skip non-.md files, skip `.excalidraw.md`
7. `markdown.ts` — unified pipeline with GFM, syntax highlighting, heading slugs
8. `wikilinks.ts` — resolve [[links]] against known slugs, ![[images]] → img tags
9. `callouts.ts` — transform > [!TYPE] blockquotes
10. Image path rewriting: `Assets/Images/x.jpeg` → `/vault-images/x.jpeg`

### Phase 3: Routes & Layout
11. Layout: sidebar (250px) + main, folder tree, mobile hamburger
12. `notes/[...slug]` — render note, `entries()` for prerender
13. Home page: intro + dynamic tabs + daily-grouped feed

### Phase 4: Search
14. Prerendered JSON index, FlexSearch client-side, Ctrl+K modal

### Phase 5: Polish
15. Images (copy Assets/ to static at build), OG meta, 404, mobile

---

## Tab Filters

Tabs are **auto-generated** at build time from the content:
- "All" (always present)
- Top-level folders become tabs (e.g., Databases, APIs, Cloud, DevOps)
- Or top tags by frequency if notes are flat

The home page feed filters client-side by the selected tab.
