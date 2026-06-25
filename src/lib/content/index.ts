import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { processMarkdown } from './markdown.js';
import { EXCLUDE_PATTERNS } from '$lib/config.js';
import type { NoteMetadata, Note, FolderTreeEntry } from '$lib/types.js';

const CONTENT_DIR = process.env.CONTENT_DIR ?? path.resolve('content');

// ── Slug helpers ──────────────────────────────────────────────────────────────

function pathToSlug(relPath: string): string {
	return relPath
		.replace(/\.md$/, '')
		.split(path.sep)
		.join('/');
}

function slugToPath(slug: string): string {
	return slug.split('/').join(path.sep) + '.md';
}

// ── File walker ───────────────────────────────────────────────────────────────

function walkDir(dir: string, baseDir: string): string[] {
	if (!fs.existsSync(dir)) return [];
	const results: string[] = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name);
		const relPath = path.relative(baseDir, fullPath);

		if (EXCLUDE_PATTERNS.some((p) => p.test(relPath) || p.test(entry.name))) continue;

		if (entry.isDirectory()) {
			results.push(...walkDir(fullPath, baseDir));
		} else if (entry.isFile() && entry.name.endsWith('.md')) {
			results.push(fullPath);
		}
	}
	return results;
}

function walkAllDirs(): { filePath: string; baseDir: string }[] {
	return walkDir(CONTENT_DIR, CONTENT_DIR).map((filePath) => ({ filePath, baseDir: CONTENT_DIR }));
}

// ── Date extraction ───────────────────────────────────────────────────────────

function extractDate(frontmatter: Record<string, unknown>, filePath: string): Date {
	const raw = frontmatter.date;
	if (raw) {
		const d = new Date(raw as string);
		if (!isNaN(d.getTime())) return d;
	}
	return fs.statSync(filePath).birthtime;
}

// ── Title extraction ──────────────────────────────────────────────────────────

function extractTitle(frontmatter: Record<string, unknown>, filePath: string): string {
	if (typeof frontmatter.title === 'string' && frontmatter.title.trim()) {
		return frontmatter.title.trim();
	}
	return path.basename(filePath, '.md');
}

// ── Tags extraction ───────────────────────────────────────────────────────────

function extractTags(frontmatter: Record<string, unknown>, relPath: string, content: string): string[] {
	const tags: string[] = [];

	// Tags from frontmatter
	if (Array.isArray(frontmatter.tags)) {
		tags.push(...frontmatter.tags.filter((t): t is string => typeof t === 'string'));
	} else if (typeof frontmatter.tags === 'string') {
		tags.push(frontmatter.tags);
	}

	// Inline #tags from note body (Obsidian style)
	const inlineTagRegex = /(?:^|\s)#([a-zA-Z][\w-/]*)/g;
	let match;
	while ((match = inlineTagRegex.exec(content)) !== null) {
		const tag = match[1];
		if (!tags.includes(tag)) {
			tags.push(tag);
		}
	}

	// Top-level folder as implicit tag (only if file is inside a subfolder)
	const parts = relPath.split(path.sep);
	if (parts.length > 1 && !tags.includes(parts[0])) {
		tags.push(parts[0]);
	}

	return tags;
}

// ── Slug map (for wikilink resolution) ───────────────────────────────────────

let _slugMap: Map<string, string> | null = null;

function getSlugMap(): Map<string, string> {
	if (_slugMap) return _slugMap;
	_slugMap = new Map();
	for (const { filePath, baseDir } of walkAllDirs()) {
		const relPath = path.relative(baseDir, filePath);
		const slug = pathToSlug(relPath);
		const title = path.basename(filePath, '.md').toLowerCase();
		_slugMap.set(title, slug);
		_slugMap.set(slug.toLowerCase(), slug);
		_slugMap.set(title.replace(/ /g, '-'), slug);
	}
	return _slugMap;
}

// ── getAllNotes ───────────────────────────────────────────────────────────────

let _allNotes: NoteMetadata[] | null = null;

export function getAllNotes(): NoteMetadata[] {
	if (_allNotes) return _allNotes;

	const entries = walkAllDirs();
	const notes: NoteMetadata[] = entries.map(({ filePath, baseDir }) => {
		const relPath = path.relative(baseDir, filePath);
		const raw = fs.readFileSync(filePath, 'utf-8');
		const { data, content } = matter(raw);

		return {
			slug: pathToSlug(relPath),
			title: extractTitle(data, filePath),
			date: extractDate(data, filePath),
			tags: extractTags(data, relPath, content),
			folder: relPath.includes(path.sep) ? relPath.split(path.sep)[0] : '/',
			filePath
		};
	});

	// Sort newest first
	notes.sort((a, b) => b.date.getTime() - a.date.getTime());
	_allNotes = notes;
	return notes;
}

// ── getNoteBySlug ─────────────────────────────────────────────────────────────

export async function getNoteBySlug(slug: string): Promise<Note | null> {
	const relPath = slugToPath(slug);

	const candidate = path.join(CONTENT_DIR, relPath);
	const filePath: string | null = fs.existsSync(candidate) ? candidate : null;
	const baseDir = CONTENT_DIR;

	if (!filePath) return null;

	const raw = fs.readFileSync(filePath, 'utf-8');
	const { data, content } = matter(raw);
	const slugMap = getSlugMap();
	const { html, plainText } = await processMarkdown(content, slugMap);

	const noteRelPath = path.relative(baseDir, filePath);

	return {
		slug,
		title: extractTitle(data, filePath),
		date: extractDate(data, filePath),
		tags: extractTags(data, noteRelPath, content),
		folder: noteRelPath.split(path.sep)[0],
		filePath,
		html,
		plainText
	};
}

// ── getFolderTree ─────────────────────────────────────────────────────────────

export function getFolderTree(): FolderTreeEntry[] {
	const notes = getAllNotes();
	const root: FolderTreeEntry[] = [];

	for (const note of notes) {
		const parts = note.slug.split('/').map(decodeURIComponent);
		let current = root;

		for (let i = 0; i < parts.length; i++) {
			const isLast = i === parts.length - 1;
			const name = parts[i];

			if (isLast) {
				current.push({ name: note.title, slug: note.slug, isFolder: false });
			} else {
				let folder = current.find((e) => e.isFolder && e.name === name);
				if (!folder) {
					folder = { name, isFolder: true, children: [] };
					current.push(folder);
				}
				current = folder.children!;
			}
		}
	}

	return sortTree(root);
}

function sortTree(entries: FolderTreeEntry[]): FolderTreeEntry[] {
	return entries
		.map((e) => (e.children ? { ...e, children: sortTree(e.children) } : e))
		.sort((a, b) => {
			if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1;
			return a.name.localeCompare(b.name);
		});
}

// ── getAllSlugs (for entries()) ───────────────────────────────────────────────

export function getAllSlugs(): string[] {
	return getAllNotes().map((n) => n.slug);
}
