import FlexSearch from 'flexsearch';

export interface SearchEntry {
	slug: string;
	title: string;
	folder: string;
	tags: string[];
	excerpt: string;
}

export interface SearchResult {
	slug: string;
	title: string;
	folder: string;
	excerpt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let index: any | null = null;
let entries: SearchEntry[] = [];

export async function loadSearchIndex(): Promise<void> {
	if (index) return;

	const res = await fetch('/api/search-index.json');
	entries = await res.json();

	index = new FlexSearch.Document({
		document: {
			id: 'slug',
			index: ['title', 'excerpt', 'tags', 'folder'],
			store: ['slug', 'title', 'folder', 'excerpt']
		},
		tokenize: 'forward'
	});

	for (const entry of entries) {
		index.add({ ...entry, tags: entry.tags.join(' ') });
	}
}

export function search(query: string): SearchResult[] {
	if (!index || !query.trim()) return [];

	const results = index.search(query, { enrich: true, limit: 10 });

	// Collect unique slugs from all field results
	const seen = new Set<string>();
	const out: SearchResult[] = [];

	for (const fieldResult of results) {
		for (const item of fieldResult.result) {
			const doc = item.doc as SearchResult;
			if (!seen.has(doc.slug)) {
				seen.add(doc.slug);
				out.push(doc);
			}
		}
	}

	return out;
}
