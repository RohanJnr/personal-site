<script lang="ts">
	import { page } from '$app/state';
	import type { FolderTreeEntry } from '$lib/types.js';
	import { slugToHref } from '$lib/utils.js';

	let { node, depth = 0, onNavigate }: { node: FolderTreeEntry; depth?: number; onNavigate?: () => void } = $props();

	function containsActive(entry: FolderTreeEntry, pathname: string): boolean {
		if (!entry.isFolder) return entry.slug ? slugToHref(entry.slug) === pathname : false;
		return entry.children?.some((c) => containsActive(c, pathname)) ?? false;
	}

	let expanded = $state(false);
	let hasAutoExpanded = $state(false);

	$effect(() => {
		if (node.isFolder && containsActive(node, page.url.pathname)) {
			expanded = true;
			hasAutoExpanded = true;
		} else if (hasAutoExpanded && !containsActive(node, page.url.pathname)) {
			expanded = false;
			hasAutoExpanded = false;
		}
	});
</script>

{#if node.isFolder}
	<li>
		<button
			class="folder-name"
			style="padding-left: {10 + depth * 14}px"
			onclick={() => (expanded = !expanded)}
		>
			<span class="folder-arrow" class:expanded>{expanded ? '▾' : '▸'}</span>
			{node.name}
		</button>
		{#if expanded && node.children?.length}
			<ul class="folder-children">
				{#each node.children as child}
					<svelte:self node={child} depth={depth + 1} {onNavigate} />
				{/each}
			</ul>
		{/if}
	</li>
{:else}
	<li>
		<a
			href={slugToHref(node.slug)}
			class="note-link"
			class:active={page.url.pathname === slugToHref(node.slug)}
			style="padding-left: {24 + depth * 14}px"
			onclick={() => onNavigate?.()}
		>
			{node.name}
		</a>
	</li>
{/if}

<style>
	li {
		list-style: none;
		margin: 1px 0;
	}

	.folder-name {
		display: flex;
		align-items: center;
		gap: 6px;
		width: 100%;
		padding-top: 5px;
		padding-right: 12px;
		padding-bottom: 5px;
		background: none;
		border: none;
		cursor: pointer;
		font-family: var(--font-body);
		font-size: 13.5px;
		font-weight: 500;
		color: var(--text);
		border-radius: 5px;
		text-align: left;
		transition: color 0.15s, background 0.15s;
	}

	.folder-name:hover {
		color: var(--text);
		background: rgba(20, 22, 27, 0.04);
	}

	.folder-arrow {
		font-size: 11px;
		width: 12px;
		flex-shrink: 0;
	}

	.note-link {
		display: block;
		padding-top: 4px;
		padding-right: 12px;
		padding-bottom: 4px;
		font-size: 13px;
		color: var(--text);
		border-radius: 5px;
		transition: background 0.12s, color 0.12s;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.note-link:hover {
		background: var(--accent-light);
		color: var(--accent);
	}

	.note-link.active {
		background: var(--accent-light);
		color: var(--accent);
		font-weight: 500;
	}

	.folder-children {
		padding: 0;
		margin: 0;
	}
</style>
