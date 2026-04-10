/** Converts a plain-text slug to a URL-safe href path */
export function slugToHref(slug: string): string {
	return '/notes/' + slug.split('/').map(encodeURIComponent).join('/');
}
