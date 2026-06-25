import { getAllNotes } from '$lib/content/index.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = () => {
	const rides = getAllNotes()
		.filter((n) => n.folder.toLowerCase() === 'rides')
		.map((n) => ({
			slug: n.slug,
			title: n.title,
			date: n.date.toISOString(),
			tags: n.tags
		}))
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return { rides };
};
