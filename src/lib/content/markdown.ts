import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';
import remarkCallouts from './callouts.js';
import remarkWikilinks from './wikilinks.js';

// Rewrites image src attributes so vault-relative paths serve correctly
function rehypeRewriteImages() {
	return (tree: Root) => {
		visit(tree, 'element', (node: Element) => {
			if (node.tagName !== 'img') return;
			const src = node.properties?.src as string | undefined;
			if (!src) return;
			// Already absolute or a /images path — skip
			if (src.startsWith('/') || src.startsWith('http')) return;
			// Strip any leading path components before Assets/Images/
			const imgFile = src.replace(/^.*Assets\/Images\//, '').replace(/^.*images\//, '');
			node.properties.src = `/images/${imgFile}`;
		});
	};
}

export async function processMarkdown(
	content: string,
	slugMap: Map<string, string>
): Promise<{ html: string; plainText: string }> {
	const file = await unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkCallouts)
		.use(remarkWikilinks, { slugMap, imagesBase: '/images' })
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeHighlight, { detect: true })
		.use(rehypeSlug)
		.use(rehypeRewriteImages)
		.use(rehypeStringify, { allowDangerousHtml: true })
		.process(content);

	const html = String(file);

	// Strip tags for plain text (used in search index)
	const plainText = html
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

	return { html, plainText };
}
