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

	const rides = all
		.filter((n) => n.folder.toLowerCase() === 'rides')
		.map((n) => ({
			slug: n.slug,
			title: n.title,
			date: n.date.toISOString()
		}));

	return { notes, rides };
};
