import { getAllNotes } from '$lib/content/index.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = () => {
	const notes = getAllNotes();

	// Collect unique top-level folders for tab nav
	const folderCounts = new Map<string, number>();
	for (const note of notes) {
		folderCounts.set(note.folder, (folderCounts.get(note.folder) ?? 0) + 1);
	}

	// Sort folders by count desc
	const folders = [...folderCounts.entries()]
		.sort((a, b) => b[1] - a[1])
		.map(([folder, count]) => ({ folder, count }));

	return {
		notes: notes.map((n) => ({
			slug: n.slug,
			title: n.title,
			date: n.date.toISOString(),
			tags: n.tags,
			folder: n.folder
		})),
		folders
	};
};
