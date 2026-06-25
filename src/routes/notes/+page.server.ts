import { getAllNotes } from '$lib/content/index.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = () => {
	const all = getAllNotes();
	const notes = all
		.filter((n) => n.folder.toLowerCase() !== 'rides')
		.map((n) => ({
			slug: n.slug,
			title: n.title,
			date: n.date.toISOString(),
			tags: n.tags,
			folder: n.folder
		}));

	// All unique tags sorted by frequency
	const tagCounts = new Map<string, number>();
	for (const note of notes) {
		for (const tag of note.tags) {
			tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
		}
	}
	const tags = [...tagCounts.entries()]
		.sort((a, b) => b[1] - a[1])
		.map(([tag, count]) => ({ tag, count }));

	return { notes, tags };
};
