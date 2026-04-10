import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Blockquote, Paragraph, Text, Html } from 'mdast';

// Transforms Obsidian-style callouts: > [!TYPE] Title
// into <div class="callout callout-type"><div class="callout-title">...</div>...</div>
const remarkCallouts: Plugin<[], Root> = () => {
	return (tree: Root) => {
		visit(tree, 'blockquote', (node: Blockquote, index, parent) => {
			if (!parent || index === undefined) return;

			const firstChild = node.children[0];
			if (firstChild?.type !== 'paragraph') return;

			const firstText = firstChild.children[0];
			if (firstText?.type !== 'text') return;

			const match = firstText.value.match(/^\[!(\w+)\]\s*(.*)/);
			if (!match) return;

			const type = match[1].toLowerCase();
			const title = match[2] || type;

			// Remove the [!TYPE] line from the first paragraph
			firstText.value = firstText.value.replace(/^\[!\w+\]\s*.*\n?/, '');
			if (firstText.value === '' && firstChild.children.length === 1) {
				node.children.shift();
			}

			// Replace blockquote with raw HTML node
			const innerNodes = node.children;
			// We'll convert via a data attribute trick — mark it for rehype
			(node as any).data = {
				hName: 'div',
				hProperties: { className: [`callout`, `callout-${type}`] }
			};

			// Insert title as first child
			const titleNode: Html = {
				type: 'html',
				value: `<div class="callout-title">${title}</div>`
			};
			node.children.unshift(titleNode as any);
		});
	};
};

export default remarkCallouts;
