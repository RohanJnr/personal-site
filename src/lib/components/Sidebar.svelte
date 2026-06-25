<script lang="ts">
	import { browser } from '$app/environment';
	import FolderTreeNode from './FolderTreeNode.svelte';
	import type { FolderTreeEntry } from '$lib/types.js';

	let {
		tree,
		tags = [],
		totalNotes = 0,
		open = false,
		onClose,
		onSearchOpen
	}: {
		tree: FolderTreeEntry[];
		tags?: string[];
		totalNotes?: number;
		open?: boolean;
		onClose?: () => void;
		onSearchOpen?: () => void;
	} = $props();

	const themes = [
		{ id: 'paper',   label: 'Paper',   swatch: ['#ffffff', '#f5f5f3', '#2d4a8a'] },
		{ id: 'obsidian', label: 'Obsidian', swatch: ['#1a1b1e', '#222327', '#c9a96e'] },
		{ id: 'forest',  label: 'Forest',  swatch: ['#f4f1eb', '#e8e3d8', '#4a7c59'] },
		{ id: 'slate',   label: 'Slate',   swatch: ['#0d1117', '#161b22', '#58a6ff'] },
		{ id: 'rose',    label: 'Rose',    swatch: ['#fdf6f0', '#f4e6da', '#b5401f'] },
	];

	let activeTheme = $state(
		(browser && localStorage.getItem('theme')) || 'paper'
	);

	function applyTheme(id: string) {
		activeTheme = id;
		document.documentElement.setAttribute('data-theme', id);
		if (browser) localStorage.setItem('theme', id);
	}

	if (browser) {
		document.documentElement.setAttribute('data-theme', activeTheme);
	}
</script>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="sidebar-backdrop" onclick={onClose} role="presentation"></div>
{/if}

<nav class="sidebar" class:open>
	<div class="sidebar-header">
		<div class="site-name-row">
			<a href="/" class="site-name" onclick={() => onClose?.()}>Rohan's Notes</a>
			<span class="site-slash">/ notes</span>
		</div>
		<div class="site-desc">notes on software engineering</div>
	</div>

	<div class="search-row">
		<button class="search-btn" onclick={onSearchOpen} aria-label="Search notes">
			<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.4">
				<circle cx="5" cy="5" r="3.5"/><path d="M8 8l3 3"/>
			</svg>
			<span class="search-text">Search notes</span>
			<kbd>⌘K</kbd>
		</button>
	</div>

	<div class="section-label">Folders</div>

	<ul class="tree">
		{#each tree as node}
			<FolderTreeNode {node} onNavigate={onClose} />
		{/each}
	</ul>

	{#if tags.length > 0}
		<div class="tags-section">
			<div class="section-label">Tags</div>
			<div class="tags-list">
				{#each tags as tag}
					<a href="/tags/{tag}" class="tag-pill" onclick={() => onClose?.()}>#{tag}</a>
				{/each}
			</div>
		</div>
	{/if}

	<div class="theme-switcher">
		{#each themes as t}
			<button
				class="theme-btn"
				class:active={activeTheme === t.id}
				onclick={() => applyTheme(t.id)}
				title={t.label}
				aria-label={t.label}
			>
				<span class="swatch" style="background:{t.swatch[0]};border-color:{t.swatch[2]}20">
					<span class="swatch-sidebar" style="background:{t.swatch[1]}"></span>
					<span class="swatch-accent" style="background:{t.swatch[2]}"></span>
				</span>
				<span class="theme-label">{t.label}</span>
			</button>
		{/each}
	</div>

	<div class="sidebar-footer">
		<span>{totalNotes} notes</span>
		<span class="rss-link">rss</span>
	</div>
</nav>

<style>
	.sidebar {
		background: var(--bg-sidebar);
		border-right: 1px solid var(--border);
		height: 100vh;
		position: sticky;
		top: 0;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.sidebar-header {
		padding: 28px 24px 16px;
		flex-shrink: 0;
	}

	.site-name-row {
		display: flex;
		align-items: baseline;
		gap: 8px;
		margin-bottom: 3px;
	}

	.site-name {
		font-family: var(--font-display);
		font-size: 20px;
		font-weight: 500;
		color: var(--heading);
		letter-spacing: -0.2px;
		transition: color 0.15s;
	}

	.site-name:hover {
		color: var(--accent);
	}

	.site-slash {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--text-muted);
		letter-spacing: 0.5px;
	}

	.site-desc {
		font-family: var(--font-display);
		font-size: 12px;
		font-style: italic;
		color: var(--text-muted);
	}

	.search-row {
		padding: 0 16px 12px;
		flex-shrink: 0;
	}

	.search-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		padding: 8px 12px;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 6px;
		color: var(--text-muted);
		font-family: var(--font-mono);
		font-size: 12px;
		cursor: pointer;
		text-align: left;
		transition: border-color 0.15s;
	}

	.search-btn:hover {
		border-color: rgba(20, 22, 27, 0.2);
	}

	.search-text {
		flex: 1;
	}

	kbd {
		font-family: var(--font-mono);
		font-size: 10px;
		padding: 1px 5px;
		border: 1px solid var(--border);
		border-radius: 3px;
		color: var(--text-muted);
	}

	.section-label {
		padding: 4px 24px 6px;
		font-family: var(--font-mono);
		font-size: 10px;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 1.2px;
		color: var(--text-muted);
		flex-shrink: 0;
	}

	.tree {
		list-style: none;
		padding: 2px 8px 0;
		overflow-y: auto;
		flex: 1;
		min-height: 0;
	}

	.tags-section {
		flex-shrink: 0;
		padding-top: 4px;
	}

	.tags-list {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		padding: 2px 18px 14px;
	}

	.tag-pill {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--text-muted);
		padding: 2px 7px;
		border: 1px solid var(--border);
		border-radius: 3px;
		transition: color 0.12s, border-color 0.12s;
	}

	.tag-pill:hover {
		color: var(--accent);
		border-color: var(--accent);
	}

	.theme-switcher {
		padding: 10px 16px;
		border-top: 1px solid var(--border);
		display: flex;
		gap: 4px;
		flex-shrink: 0;
	}

	.theme-btn {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		background: none;
		border: 1px solid transparent;
		border-radius: 5px;
		padding: 5px 2px;
		cursor: pointer;
		transition: border-color 0.15s, background 0.15s;
	}

	.theme-btn:hover {
		background: var(--bg-surface);
		border-color: var(--border-strong);
	}

	.theme-btn.active {
		border-color: var(--accent);
		background: var(--accent-light);
	}

	.swatch {
		width: 24px;
		height: 18px;
		border-radius: 3px;
		border: 1.5px solid;
		display: flex;
		overflow: hidden;
		flex-shrink: 0;
	}

	.swatch-sidebar {
		width: 40%;
		height: 100%;
	}

	.swatch-accent {
		width: 8px;
		height: 100%;
		margin-left: auto;
	}

	.theme-label {
		font-family: var(--font-mono);
		font-size: 9px;
		color: var(--text-muted);
		letter-spacing: 0.3px;
		white-space: nowrap;
	}

	.theme-btn.active .theme-label {
		color: var(--accent);
	}

	.sidebar-footer {
		padding: 10px 22px;
		border-top: 1px solid var(--border);
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--text-muted);
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-shrink: 0;
	}

	.rss-link {
		color: var(--text-muted);
		transition: color 0.12s;
	}

	.rss-link:hover {
		color: var(--accent);
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
			width: 290px;
			transform: translateX(-100%);
			transition: transform 0.25s ease;
			box-shadow: none;
		}

		.sidebar.open {
			transform: translateX(0);
			box-shadow: 4px 0 20px rgba(0, 0, 0, 0.08);
		}

		.sidebar-backdrop {
			display: block;
			position: fixed;
			inset: 0;
			background: rgba(0, 0, 0, 0.15);
			z-index: 49;
		}
	}
</style>
