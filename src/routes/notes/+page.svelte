<script lang="ts">
	import { slugToHref } from '$lib/utils.js';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();

	type NoteRow = { slug: string; title: string; date: string; tags: string[]; folder: string };

	let query = $state('');
	let activeTag = $state<string | null>(null);

	const filtered = $derived(() => {
		let list = data.notes as NoteRow[];
		if (activeTag) list = list.filter((n) => n.tags.includes(activeTag!));
		const q = query.trim().toLowerCase();
		if (q) list = list.filter((n) =>
			n.title.toLowerCase().includes(q) || n.tags.some((t) => t.toLowerCase().includes(q))
		);
		return list;
	});

	function groupByMonth(notes: NoteRow[]): { label: string; notes: NoteRow[] }[] {
		const groups = new Map<string, NoteRow[]>();
		for (const note of notes) {
			const d = new Date(note.date);
			const key = d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
			if (!groups.has(key)) groups.set(key, []);
			groups.get(key)!.push(note);
		}
		return [...groups.entries()].map(([label, notes]) => ({ label, notes }));
	}

	const grouped = $derived(groupByMonth(filtered()));

	function toggleTag(tag: string) {
		activeTag = activeTag === tag ? null : tag;
	}
</script>

<svelte:head>
	<title>Notes — Rohan Alleti</title>
	<meta name="description" content="All my notes on software engineering, databases, distributed systems, and more." />
</svelte:head>

<div class="page-header">
	<div class="header-top">
		<h1>Notes</h1>
		<span class="note-count">{filtered().length} of {data.notes.length}</span>
	</div>

	<!-- Search -->
	<div class="search-bar">
		<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
			<circle cx="6" cy="6" r="4"/><path d="M10 10l3 3"/>
		</svg>
		<input
			type="search"
			class="search-input"
			placeholder="Search notes…"
			bind:value={query}
		/>
		{#if query}
			<button class="clear-btn" onclick={() => (query = '')} aria-label="Clear">✕</button>
		{/if}
	</div>

	<!-- Tag cloud -->
	<div class="tag-cloud">
		{#each data.tags as { tag, count }}
			<button
				class="tag-btn"
				class:active={activeTag === tag}
				onclick={() => toggleTag(tag)}
			>#{tag} <span class="tag-count">{count}</span></button>
		{/each}
	</div>
</div>

{#if grouped.length === 0}
	<p class="empty">No notes match.</p>
{:else}
	{#each grouped as group}
		<div class="month-group">
			<div class="month-label">{group.label}</div>
			<ul class="note-list">
				{#each group.notes as note}
					<li class="note-item">
						<a href={slugToHref(note.slug)} class="note-row">
							<span class="note-day">
								{new Date(note.date).toLocaleDateString('en-GB', { day: 'numeric' })}
							</span>
							<span class="note-body">
								<span class="note-title">{note.title}</span>
								{#if note.tags.length > 0}
									<span class="note-tags">
										{#each note.tags.slice(0, 5) as tag}
											<a
												href="/tags/{tag}"
												class="tag-pill"
												onclick={(e) => e.stopPropagation()}
											>#{tag}</a>
										{/each}
									</span>
								{/if}
							</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
{/if}

<style>
	.page-header {
		margin-bottom: 40px;
	}

	.header-top {
		display: flex;
		align-items: baseline;
		gap: 12px;
		margin-bottom: 20px;
	}

	h1 {
		font-family: var(--font-display);
		font-size: 2rem;
		font-weight: 500;
		color: var(--heading);
		margin: 0;
		letter-spacing: -0.3px;
	}

	.note-count {
		font-size: 13px;
		color: var(--text-muted);
	}

	/* Search */
	.search-bar {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 14px;
		border: 1px solid var(--border-strong);
		border-radius: 8px;
		margin-bottom: 16px;
	}

	.search-bar svg {
		color: var(--text-muted);
		flex-shrink: 0;
	}

	.search-input {
		flex: 1;
		border: none;
		outline: none;
		background: transparent;
		font-family: var(--font-body);
		font-size: 14px;
		color: var(--text);
	}

	.search-input::placeholder { color: var(--text-muted); }
	.search-input::-webkit-search-cancel-button { display: none; }

	.clear-btn {
		background: none;
		border: none;
		color: var(--text-muted);
		font-size: 11px;
		cursor: pointer;
		padding: 2px 4px;
		transition: color 0.12s;
	}

	.clear-btn:hover { color: var(--text); }

	/* Tag cloud */
	.tag-cloud {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		padding-bottom: 24px;
		border-bottom: 1px solid var(--border);
	}

	.tag-btn {
		font-family: var(--font-body);
		font-size: 12px;
		color: var(--text-muted);
		background: none;
		border: 1px solid var(--border);
		border-radius: 4px;
		padding: 3px 9px;
		cursor: pointer;
		transition: color 0.12s, border-color 0.12s, background 0.12s;
		line-height: 1.6;
	}

	.tag-btn:hover {
		color: var(--accent);
		border-color: var(--accent);
	}

	.tag-btn.active {
		color: var(--accent);
		border-color: var(--accent);
		background: var(--accent-light);
	}

	.tag-count {
		font-size: 10px;
		opacity: 0.6;
		margin-left: 2px;
	}

	/* Notes list */
	.month-group { margin-bottom: 20px; }

	.month-label {
		font-family: var(--font-body);
		font-size: 10px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 1.2px;
		color: var(--text-muted);
		padding: 6px 0;
		border-bottom: 1px solid var(--border);
	}

	.note-list { list-style: none; }

	.note-row {
		display: flex;
		align-items: baseline;
		gap: 12px;
		padding: 7px 0;
		border-bottom: 1px solid var(--border);
	}

	.note-item:last-child .note-row { border-bottom: none; }

	.note-day {
		font-size: 11px;
		color: var(--text-muted);
		flex-shrink: 0;
		width: 20px;
		text-align: right;
	}

	.note-body {
		display: flex;
		align-items: baseline;
		gap: 10px;
		flex: 1;
		min-width: 0;
	}

	.note-title {
		font-size: 14px;
		color: var(--heading);
		line-height: 1.4;
		transition: color 0.12s;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.note-row:hover .note-title { color: var(--accent); }

	.note-tags {
		display: flex;
		flex-wrap: nowrap;
		gap: 4px;
		flex-shrink: 0;
	}

	.tag-pill {
		font-family: var(--font-body);
		font-size: 10px;
		color: var(--text-muted);
		padding: 1px 5px;
		border: 1px solid var(--border);
		border-radius: 3px;
		transition: color 0.12s, border-color 0.12s;
		white-space: nowrap;
	}

	.tag-pill:hover {
		color: var(--accent);
		border-color: var(--accent);
	}

	.empty {
		padding: 48px 0;
		color: var(--text-muted);
		font-size: 14px;
	}

	@media (max-width: 640px) {
		.note-row {
			grid-template-columns: 1fr;
			gap: 4px;
		}
		.note-day { display: none; }
	}
</style>
