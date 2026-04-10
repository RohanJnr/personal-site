import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Text, Link, Image, InlineCode } from 'mdast';

// Resolves [[note name]] and [[note name|display]] wikilinks
// and ![[image.png]] image embeds
const remarkWikilinks: Plugin<[{ slugMap: Map<string, string>; imagesBase: string }], Root> = (
	options
) => {
	const { slugMap, imagesBase } = options;

	return (tree: Root) => {
		visit(tree, 'text', (node: Text, index, parent) => {
			if (!parent || index === undefined) return;

			const value = node.value;
			// Match ![[image]] or [[link]] or [[link|text]]
			const regex = /(!?)\[\[([^\]]+)\]\]/g;
			let match: RegExpExecArray | null;
			let lastIndex = 0;
			const newNodes: (Text | Link | Image)[] = [];
			let hasMatch = false;

			while ((match = regex.exec(value)) !== null) {
				hasMatch = true;
				const [full, bang, inner] = match;
				const start = match.index;

				if (start > lastIndex) {
					newNodes.push({ type: 'text', value: value.slice(lastIndex, start) });
				}

				if (bang === '!') {
					// Image embed: ![[filename.ext]]
					const imgName = inner.split('|')[0].trim();
					newNodes.push({
						type: 'image',
						url: `${imagesBase}/${encodeURIComponent(imgName)}`,
						alt: imgName,
						title: null
					} as Image);
				} else {
					// Wikilink: [[note]] or [[note|display]]
					const [target, displayText] = inner.split('|');
					const targetTrimmed = target.trim();
					const display = displayText?.trim() ?? targetTrimmed;

					// Try to resolve to a known slug (case-insensitive)
					const resolved =
						slugMap.get(targetTrimmed.toLowerCase()) ??
						slugMap.get(targetTrimmed.toLowerCase().replace(/ /g, '-'));

					if (resolved) {
						newNodes.push({
							type: 'link',
							url: `/notes/${resolved}`,
							title: null,
							children: [{ type: 'text', value: display }]
						} as Link);
					} else {
						// Unresolved — render as plain text
						newNodes.push({ type: 'text', value: display });
					}
				}

				lastIndex = start + full.length;
			}

			if (!hasMatch) return;

			if (lastIndex < value.length) {
				newNodes.push({ type: 'text', value: value.slice(lastIndex) });
			}

			parent.children.splice(index, 1, ...(newNodes as any[]));
		});
	};
};

export default remarkWikilinks;
