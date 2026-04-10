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

	<div class="sidebar-footer">
		<!-- Subtle motorcycle doodle -->
		<svg width="64" height="40" viewBox="0 0 64 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
			<g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="12" cy="30" r="8" />
				<circle cx="12" cy="30" r="3" stroke-width="0.8" />
				<circle cx="50" cy="30" r="8" />
				<circle cx="50" cy="30" r="3" stroke-width="0.8" />
				<path d="M20 30 L27 14 L44 10 L50 22" />
				<ellipse cx="34" cy="12" rx="7" ry="4" stroke-width="1.4" />
				<path d="M25 14 L21 18" />
				<path d="M44 10 L48 3 L52 3" />
				<circle cx="52" cy="7" r="2.2" />
				<path d="M17 26 L9 24" stroke-width="1.8" />
			</g>
		</svg>
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

	.sidebar-footer {
		padding: 16px 20px;
		border-top: 1px solid var(--border);
		display: flex;
		justify-content: center;
		color: var(--text-muted);
		opacity: 0.2;
		flex-shrink: 0;
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
