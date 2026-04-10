import { getAllNotes } from '$lib/content/index.js';
import { getNoteBySlug } from '$lib/content/index.js';
import { json } from '@sveltejs/kit';

export const prerender = true;

export async function GET() {
	const notes = getAllNotes();

	const index = await Promise.all(
		notes.map(async (note) => {
			const full = await getNoteBySlug(note.slug);
			return {
				slug: note.slug,
				title: note.title,
				folder: note.folder,
				tags: note.tags,
				excerpt: full?.plainText.slice(0, 300) ?? ''
			};
		})
	);

	return json(index);
}
