<script lang="ts">
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import SearchModal from '$lib/components/SearchModal.svelte';
	import type { LayoutData } from './$types.js';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

	let searchOpen = $state(false);
	let sidebarOpen = $state(false);
</script>

<svelte:window
	onkeydown={(e) => {
		if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
			e.preventDefault();
			searchOpen = true;
		}
	}}
/>

<div class="app-layout">
	<Sidebar tree={data.tree} open={sidebarOpen} onClose={() => (sidebarOpen = false)} />
	<div class="main">
		<div class="top-bar">
			<button class="hamburger" onclick={() => (sidebarOpen = !sidebarOpen)} aria-label="Toggle sidebar">
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
					<line x1="3" y1="5" x2="17" y2="5" />
					<line x1="3" y1="10" x2="17" y2="10" />
					<line x1="3" y1="15" x2="17" y2="15" />
				</svg>
			</button>
			<button class="search-btn" onclick={() => (searchOpen = true)} aria-label="Search notes">
				<span class="search-icon">⌕</span>
				<span class="search-hint">Search notes...</span>
				<kbd>Ctrl+K</kbd>
			</button>
		</div>
		<div class="content-area">
			{@render children()}
		</div>
	</div>
</div>

{#if searchOpen}
	<SearchModal onClose={() => (searchOpen = false)} />
{/if}

<style>
	.app-layout {
		display: grid;
		grid-template-columns: var(--sidebar-width) 1fr;
		min-height: 100vh;
	}

	.main {
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.top-bar {
		position: fixed;
		right: 0;
		top: 12px;
		z-index: 10;
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 0 36px;
	}

	.hamburger {
		display: none;
		background: none;
		border: none;
		color: var(--text-muted);
		cursor: pointer;
		padding: 2px;
		line-height: 1;
		margin-right: auto;
		transition: color 0.15s;
	}

	.hamburger:hover {
		color: var(--accent);
	}

	.search-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		background: #fff;
		border: 1.5px solid var(--border);
		border-radius: 8px;
		padding: 6px 14px;
		color: var(--text-muted);
		font-family: inherit;
		font-size: 13px;
		cursor: pointer;
		min-width: 220px;
		transition: border-color 0.15s;
	}

	.search-btn:hover {
		border-color: var(--accent);
	}

	.search-icon {
		font-size: 16px;
		line-height: 1;
	}

	.search-hint {
		flex: 1;
		text-align: left;
	}

	kbd {
		font-family: var(--font-mono);
		font-size: 10px;
		background: var(--bg-surface);
		border: 1px solid var(--border);
		border-radius: 3px;
		padding: 1px 5px;
		margin-left: auto;
	}

	.content-area {
		padding: 32px 40px;
		max-width: 800px;
		width: 100%;
	}

	@media (max-width: 768px) {
		.app-layout {
			grid-template-columns: 1fr;
		}

		.top-bar {
			padding: 0 16px;
			top: 10px;
		}

		.hamburger {
			display: block;
		}

		.search-btn {
			min-width: 0;
			padding: 6px 10px;
		}

		.search-hint, kbd {
			display: none;
		}

		.content-area {
			padding: 20px 16px;
		}
	}
</style>
