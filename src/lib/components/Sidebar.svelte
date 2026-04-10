<script lang="ts">
	import FolderTreeNode from './FolderTreeNode.svelte';
	import type { FolderTreeEntry } from '$lib/types.js';

	let { tree, open = false, onClose }: { tree: FolderTreeEntry[]; open?: boolean; onClose?: () => void } = $props();
</script>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="sidebar-backdrop" onclick={onClose} role="presentation"></div>
{/if}

<nav class="sidebar" class:open>
	<div class="sidebar-header">
		<a href="/" class="site-name" onclick={() => onClose?.()}>Rohan's Notes</a>
		<div class="site-desc">notes on software engineering</div>
	</div>

	<ul class="tree">
		{#each tree as node}
			<FolderTreeNode {node} onNavigate={onClose} />
		{/each}
	</ul>

	<div class="sidebar-section">
		<div class="section-label">Biking Journal</div>
		<span class="coming-soon">coming soon</span>
	</div>
</nav>

<style>
	.sidebar {
		background: var(--bg-sidebar);
		border-right: 2px solid var(--border);
		height: 100vh;
		position: sticky;
		top: 0;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.sidebar-header {
		padding: 32px 18px 18px;
		border-bottom: 2px solid var(--border);
		flex-shrink: 0;
	}

	.site-name {
		display: block;
		font-family: var(--font-body);
		font-size: 15px;
		font-weight: 600;
		font-weight: 700;
		color: var(--heading);
		margin-bottom: 2px;
		transition: color 0.15s;
	}

	.site-name:hover {
		color: var(--accent);
	}

	.site-desc {
		font-size: 11px;
		color: var(--text-muted);
	}

	.tree {
		list-style: none;
		padding: 10px 8px;
		overflow-y: auto;
		flex: 1;
	}


	.sidebar-section {
		padding: 14px 18px;
		border-top: 2px solid var(--border);
		flex-shrink: 0;
	}

	.section-label {
		font-size: 11px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--accent);
		margin-bottom: 4px;
	}

	.coming-soon {
		font-size: 11px;
		color: var(--text-muted);
		font-style: italic;
	}

	.sidebar-backdrop {
		display: none;
	}

	@media (max-width: 768px) {
		.sidebar {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 50;
			width: 270px;
			transform: translateX(-100%);
			transition: transform 0.25s ease;
			box-shadow: none;
		}

		.sidebar.open {
			transform: translateX(0);
			box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
		}

		.sidebar-backdrop {
			display: block;
			position: fixed;
			inset: 0;
			background: rgba(0, 0, 0, 0.2);
			z-index: 49;
		}
	}
</style>
