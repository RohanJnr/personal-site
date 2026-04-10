<script lang="ts">
	let {
		breadcrumb = 'Home',
		onSearch,
		onToggleSidebar
	}: {
		breadcrumb?: string;
		onSearch: () => void;
		onToggleSidebar: () => void;
	} = $props();
</script>

<header>
	<div class="left">
		<button class="hamburger" onclick={onToggleSidebar} aria-label="Toggle sidebar">
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
				<line x1="3" y1="5" x2="17" y2="5" />
				<line x1="3" y1="10" x2="17" y2="10" />
				<line x1="3" y1="15" x2="17" y2="15" />
			</svg>
		</button>
		<div class="breadcrumb">{breadcrumb}</div>
	</div>
	<button class="search-bar" onclick={onSearch} aria-label="Search notes">
		<span class="search-icon">⌕</span>
		<span class="search-hint">Search notes...</span>
		<kbd>Ctrl+K</kbd>
	</button>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 36px;
		border-bottom: 1px solid var(--border);
		position: sticky;
		top: 0;
		background: var(--bg);
		z-index: 10;
	}

	.left {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.hamburger {
		display: none;
		background: none;
		border: none;
		color: var(--text-muted);
		cursor: pointer;
		padding: 2px;
		line-height: 1;
		transition: color 0.15s;
	}

	.hamburger:hover {
		color: var(--accent);
	}

	.breadcrumb {
		font-size: 13px;
		color: var(--text-muted);
	}

	.search-bar {
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

	.search-bar:hover {
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

	@media (max-width: 768px) {
		header {
			padding: 10px 16px;
		}

		.hamburger {
			display: block;
		}

		.search-bar {
			min-width: 0;
			padding: 6px 10px;
		}

		.search-hint, kbd {
			display: none;
		}
	}
</style>
