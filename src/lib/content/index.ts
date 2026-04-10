import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { processMarkdown } from './markdown.js';
import { EXCLUDE_PATTERNS } from '$lib/config.js';
import type { NoteMetadata, Note, FolderTreeEntry } from '$lib/types.js';

const CONTENT_DIR = process.env.CONTENT_DIR ?? path.resolve('content/notes');

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

function walkDir(dir: string): string[] {
	const results: string[] = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name);
		const relPath = path.relative(CONTENT_DIR, fullPath);

		if (EXCLUDE_PATTERNS.some((p) => p.test(relPath) || p.test(entry.name))) continue;

		if (entry.isDirectory()) {
			results.push(...walkDir(fullPath));
		} else if (entry.isFile() && entry.name.endsWith('.md')) {
			results.push(fullPath);
		}
	}
	return results;
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

function extractTags(frontmatter: Record<string, unknown>, relPath: string): string[] {
	const tags: string[] = [];

	// Tags from frontmatter
	if (Array.isArray(frontmatter.tags)) {
		tags.push(...frontmatter.tags.filter((t): t is string => typeof t === 'string'));
	} else if (typeof frontmatter.tags === 'string') {
		tags.push(frontmatter.tags);
	}

	// Top-level folder as implicit tag
	const topFolder = relPath.split(path.sep)[0];
	if (topFolder && !tags.includes(topFolder)) {
		tags.push(topFolder);
	}

	return tags;
}

// ── Slug map (for wikilink resolution) ───────────────────────────────────────

let _slugMap: Map<string, string> | null = null;

function getSlugMap(): Map<string, string> {
	if (_slugMap) return _slugMap;
	_slugMap = new Map();
	for (const filePath of walkDir(CONTENT_DIR)) {
		const relPath = path.relative(CONTENT_DIR, filePath);
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

	const files = walkDir(CONTENT_DIR);
	const notes: NoteMetadata[] = files.map((filePath) => {
		const relPath = path.relative(CONTENT_DIR, filePath);
		const raw = fs.readFileSync(filePath, 'utf-8');
		const { data } = matter(raw);

		return {
			slug: pathToSlug(relPath),
			title: extractTitle(data, filePath),
			date: extractDate(data, filePath),
			tags: extractTags(data, relPath),
			folder: relPath.split(path.sep)[0],
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
	const filePath = path.join(CONTENT_DIR, relPath);

	if (!fs.existsSync(filePath)) return null;

	const raw = fs.readFileSync(filePath, 'utf-8');
	const { data, content } = matter(raw);
	const slugMap = getSlugMap();
	const { html, plainText } = await processMarkdown(content, slugMap);

	const noteRelPath = path.relative(CONTENT_DIR, filePath);

	return {
		slug,
		title: extractTitle(data, filePath),
		date: extractDate(data, filePath),
		tags: extractTags(data, noteRelPath),
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
