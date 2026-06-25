<script lang="ts">
	import { goto } from '$app/navigation';
	import { tick } from 'svelte';
	import { loadSearchIndex, search, type SearchResult } from '$lib/search/index.js';
	import { slugToHref } from '$lib/utils.js';

	let { onClose }: { onClose: () => void } = $props();

	let query = $state('');
	let results = $state<SearchResult[]>([]);
	let selected = $state(0);
	let loaded = $state(false);
	let loading = $state(false);

	$effect(() => {
		if (!loaded) {
			loading = true;
			loadSearchIndex().then(() => {
				loaded = true;
				loading = false;
			});
		}
	});

	let inputEl: HTMLInputElement;

	$effect(() => {
		inputEl?.focus();
	});

	let debounceTimer: ReturnType<typeof setTimeout>;
	function onInput(e: Event) {
		const val = (e.target as HTMLInputElement).value;
		query = val;
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			results = search(val);
			selected = 0;
		}, 150);
	}

	let usingKeyboard = $state(false);

	function scrollToSelected() {
		const el = document.querySelector('.result.active');
		el?.scrollIntoView({ block: 'nearest' });
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') { onClose(); return; }
		if (e.key === 'ArrowDown') { e.preventDefault(); usingKeyboard = true; selected = Math.min(selected + 1, results.length - 1); tick().then(scrollToSelected); }
		if (e.key === 'ArrowUp') { e.preventDefault(); usingKeyboard = true; selected = Math.max(selected - 1, 0); tick().then(scrollToSelected); }
		if (e.key === 'Enter' && results[selected]) {
			goto(slugToHref(results[selected].slug));
			onClose();
		}
	}

	function highlight(text: string, q: string): string {
		if (!q.trim()) return text;
		const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
	}
</script>

<svelte:window onkeydown={onKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="backdrop" onclick={onClose} role="presentation">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="modal" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Search notes">
		<div class="search-row">
			<span class="search-icon">⌕</span>
			<input
				bind:this={inputEl}
				class="search-input"
				placeholder="Search notes..."
				value={query}
				oninput={onInput}
				aria-label="Search query"
			/>
			{#if loading}
				<span class="loading-hint">loading…</span>
			{/if}
		</div>

		{#if results.length > 0}
			<ul class="results" role="listbox">
				{#each results as result, i}
					<li
						class="result"
						class:active={i === selected}
						role="option"
						aria-selected={i === selected}
					>
						<a
							href={slugToHref(result.slug)}
							onclick={onClose}
							onmousemove={() => { usingKeyboard = false; selected = i; }}
							onmouseenter={() => { if (!usingKeyboard) selected = i; }}
						>
							<div class="result-title">{@html highlight(result.title, query)}</div>
							<div class="result-meta">
								<span class="result-folder">{result.folder}</span>
								<span class="result-excerpt">{@html highlight(result.excerpt.slice(0, 120), query)}</span>
							</div>
						</a>
					</li>
				{/each}
			</ul>
		{:else if query.trim() && loaded}
			<div class="no-results">No results for "<strong>{query}</strong>"</div>
		{/if}

		<div class="footer-hint">
			<kbd>↑↓</kbd> navigate &nbsp; <kbd>↵</kbd> open &nbsp; <kbd>Esc</kbd> close
		</div>
	</div>
</div>

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.25);
		z-index: 100;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding-top: 12vh;
	}

	.modal {
		background: #fff;
		border: 1px solid var(--border);
		border-radius: 8px;
		width: 560px;
		max-width: 92vw;
		box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08);
		overflow: hidden;
	}

	.search-row {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 14px 18px;
		border-bottom: 1px solid var(--border);
	}

	.search-icon {
		font-size: 18px;
		color: var(--text-muted);
		flex-shrink: 0;
	}

	.search-input {
		flex: 1;
		border: none;
		outline: none;
		font-family: inherit;
		font-size: 15px;
		color: var(--text);
		background: transparent;
	}

	.search-input::placeholder {
		color: var(--text-muted);
	}

	.loading-hint {
		font-size: 12px;
		color: var(--text-muted);
	}

	.results {
		list-style: none;
		max-height: 380px;
		overflow-y: auto;
	}

	.result a {
		display: block;
		padding: 10px 18px;
		transition: background 0.1s;
		text-decoration: none;
	}

	.result.active a,
	.result a:hover {
		background: var(--accent-light);
	}

	.result-title {
		font-size: 14px;
		font-weight: 500;
		color: var(--heading);
		margin-bottom: 3px;
	}

	.result-meta {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 12px;
		color: var(--text-muted);
	}

	.result-folder {
		background: var(--bg-surface);
		padding: 1px 6px;
		border-radius: 3px;
		flex-shrink: 0;
	}

	.result-excerpt {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	:global(.result-title mark),
	:global(.result-excerpt mark) {
		background: #fde68a;
		border-radius: 2px;
		padding: 0 1px;
		font-style: normal;
	}

	.no-results {
		padding: 20px 18px;
		font-size: 14px;
		color: var(--text-muted);
		text-align: center;
	}

	.footer-hint {
		padding: 8px 18px;
		border-top: 1px solid var(--border);
		font-size: 11px;
		color: var(--text-muted);
	}

	kbd {
		font-family: var(--font-mono);
		font-size: 10px;
		background: var(--bg-surface);
		border: 1px solid var(--border);
		border-radius: 3px;
		padding: 1px 4px;
	}
</style>
