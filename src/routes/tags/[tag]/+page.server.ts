import { getAllNotes } from '$lib/content/index.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, EntryGenerator } from './$types.js';

export const entries: EntryGenerator = () => {
	const notes = getAllNotes();
	const tags = new Set(notes.flatMap((n) => n.tags));
	return [...tags].map((tag) => ({ tag }));
};

export const load: PageServerLoad = ({ params }) => {
	const { tag } = params;
	const notes = getAllNotes().filter((n) => n.tags.includes(tag));
	if (!notes.length) error(404, `No notes tagged "${tag}"`);

	return {
		tag,
		notes: notes.map((n) => ({
			slug: n.slug,
			title: n.title,
			date: n.date.toISOString(),
			folder: n.folder,
			tags: n.tags
		}))
	};
};
