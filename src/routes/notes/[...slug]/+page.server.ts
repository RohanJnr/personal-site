import { getNoteBySlug, getAllSlugs } from '$lib/content/index.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, EntryGenerator } from './$types.js';

export const entries: EntryGenerator = () => {
	return getAllSlugs().map((slug) => ({ slug }));
};

export const load: PageServerLoad = async ({ params }) => {
	const note = await getNoteBySlug(params.slug);
	if (!note) error(404, 'Note not found');
	return { note };
};
