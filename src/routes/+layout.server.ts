import { getFolderTree } from '$lib/content/index.js';
import type { LayoutServerLoad } from './$types.js';

export const load: LayoutServerLoad = () => {
	return {
		tree: getFolderTree()
	};
};
