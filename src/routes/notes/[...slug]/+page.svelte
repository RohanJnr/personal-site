<script lang="ts">
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();
	let note = $derived(data.note);
</script>

<svelte:head>
	<title>{note.title} — Rohan's Notes</title>
	<meta name="description" content={note.plainText.slice(0, 160)} />
	<meta property="og:title" content="{note.title} — Rohan's Notes" />
	<meta property="og:description" content={note.plainText.slice(0, 160)} />
	<meta property="og:type" content="article" />
	<meta property="og:site_name" content="Rohan's Notes" />
</svelte:head>

<article>
	<header class="note-header">
		<div class="note-meta">
			<a href="/tags/{encodeURIComponent(note.folder)}" class="note-folder">{note.folder}</a>
			<span class="note-date">
				{note.date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
			</span>
		</div>
		<h1>{note.title}</h1>
		{#if note.tags.filter((t) => t !== note.folder).length}
			<div class="note-tags">
				{#each note.tags.filter((t) => t !== note.folder) as tag}
					<a href="/tags/{encodeURIComponent(tag)}" class="tag">#{tag}</a>
				{/each}
			</div>
		{/if}
	</header>

	<div class="note-content">
		{@html note.html}
	</div>
</article>

<style>
	article {
		width: 100%;
	}

	.note-header {
		margin-bottom: 2em;
		padding-bottom: 1.25em;
		border-bottom: 1px solid var(--border);
	}

	.note-meta {
		display: flex;
		gap: 12px;
		font-family: var(--font-body);
		font-size: 11px;
		color: var(--text-muted);
		margin-bottom: 8px;
	}

	.note-folder {
		color: var(--text-muted);
		transition: color 0.15s;
	}

	.note-folder:hover {
		color: var(--accent);
	}

	h1 {
		font-family: var(--font-display);
		font-size: 2.2rem;
		font-weight: 500;
		color: var(--heading);
		line-height: 1.2;
		letter-spacing: -0.3px;
		margin-bottom: 10px;
	}

	.note-tags {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		margin-top: 8px;
	}

	.tag {
		font-size: 12px;
		color: var(--accent);
		font-weight: 500;
	}

	@media (max-width: 768px) {
		h1 {
			font-size: 1.6rem;
		}
	}
</style>
