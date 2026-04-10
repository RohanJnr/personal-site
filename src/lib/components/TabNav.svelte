<script lang="ts">
	let {
		folders,
		totalCount,
		activeFolder,
		onSelect
	}: {
		folders: { folder: string; count: number }[];
		totalCount: number;
		activeFolder: string | null;
		onSelect: (folder: string | null) => void;
	} = $props();
</script>

<nav class="tab-nav">
	<button
		class="tab"
		class:active={activeFolder === null}
		onclick={() => onSelect(null)}
	>
		All <span class="count">{totalCount}</span>
	</button>
	{#each folders as { folder, count }}
		<button
			class="tab"
			class:active={activeFolder === folder}
			onclick={() => onSelect(folder)}
		>
			{folder} <span class="count">{count}</span>
		</button>
	{/each}
</nav>

<style>
	.tab-nav {
		display: flex;
		gap: 0;
		border-bottom: 2px solid var(--border);
		margin-bottom: 24px;
		overflow-x: auto;
		scrollbar-width: none;
	}

	.tab-nav::-webkit-scrollbar {
		display: none;
	}

	.tab {
		padding: 9px 16px;
		font-family: inherit;
		font-size: 13px;
		font-weight: 500;
		color: var(--text-muted);
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		margin-bottom: -2px;
		cursor: pointer;
		white-space: nowrap;
		transition: color 0.15s, border-color 0.15s;
	}

	.tab:hover {
		color: var(--text);
	}

	.tab.active {
		color: var(--accent);
		border-bottom-color: var(--accent);
	}

	.count {
		font-size: 11px;
		background: var(--bg-surface);
		padding: 1px 5px;
		border-radius: 8px;
		margin-left: 3px;
	}

	.tab.active .count {
		background: var(--accent-light);
		color: var(--accent);
	}
</style>
