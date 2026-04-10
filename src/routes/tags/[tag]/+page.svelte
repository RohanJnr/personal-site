<script lang="ts">
	import { slugToHref } from '$lib/utils.js';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>#{data.tag} — Rohan's Notes</title>
	<meta name="description" content="Notes tagged #{data.tag}" />
	<meta property="og:title" content="#{data.tag} — Rohan's Notes" />
	<meta property="og:description" content="Notes tagged #{data.tag}" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Rohan's Notes" />
</svelte:head>

<div class="tag-header">
	<a href="/" class="back">← Home</a>
	<h1><span class="tag-mark">#</span>{data.tag}</h1>
	<p class="count">{data.notes.length} note{data.notes.length === 1 ? '' : 's'}</p>
</div>

<ul class="notes-list">
	{#each data.notes as note}
		<li>
			<a href={slugToHref(note.slug)} class="note-row">
				<span class="note-title">{note.title}</span>
				<span class="note-right">
					<span class="note-folder">{note.folder}</span>
					<span class="note-date">
						{new Date(note.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
					</span>
				</span>
			</a>
		</li>
	{/each}
</ul>

<style>
	.tag-header {
		margin-bottom: 28px;
		padding-bottom: 20px;
		border-bottom: 2px dashed var(--border);
	}

	.back {
		font-size: 13px;
		color: var(--text-muted);
		display: inline-block;
		margin-bottom: 12px;
		transition: color 0.15s;
	}

	.back:hover { color: var(--accent); }

	h1 {
		font-family: var(--font-display);
		font-size: 1.8rem;
		font-weight: 900;
		color: var(--heading);
		margin-bottom: 4px;
	}

	.tag-mark {
		color: var(--accent);
	}

	.count {
		font-size: 13px;
		color: var(--text-muted);
	}

	.notes-list {
		list-style: none;
		display: flex;
		flex-direction: column;
	}

	.notes-list li + li {
		border-top: 1px solid rgba(0, 0, 0, 0.04);
	}

	.note-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		padding: 9px 10px;
		margin: 0 -10px;
		border-radius: 6px;
		transition: background 0.12s;
	}

	.note-row:hover { background: #fff; }
	.note-row:hover .note-title { color: var(--accent); }

	.note-title {
		font-size: 14px;
		font-weight: 500;
		color: var(--heading);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		transition: color 0.12s;
	}

	.note-right {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-shrink: 0;
	}

	.note-folder {
		font-size: 11px;
		background: var(--bg-surface);
		padding: 1px 6px;
		border-radius: 3px;
		color: var(--text-muted);
	}

	.note-date {
		font-size: 12px;
		color: var(--text-muted);
		white-space: nowrap;
	}
</style>
