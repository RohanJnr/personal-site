<script lang="ts">
	import TabNav from '$lib/components/TabNav.svelte';
	import { slugToHref } from '$lib/utils.js';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();

	let activeFolder = $state<string | null>(null);

	const filtered = $derived(
		activeFolder ? data.notes.filter((n) => n.folder === activeFolder) : data.notes
	);
</script>

<svelte:head>
	<title>Rohan's Notes</title>
	<meta name="description" content="Notes on software engineering, databases, distributed systems, and more." />
	<meta property="og:title" content="Rohan's Notes" />
	<meta property="og:description" content="Notes on software engineering, databases, distributed systems, and more." />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Rohan's Notes" />
</svelte:head>

<!-- About -->
<section class="about">
	<h1>Rohan Reddy Alleti</h1>
	<p>
		Software engineer at <a href="https://sahaj.ai" target="_blank" rel="noopener">Sahaj Software</a>,
		working on backend development, cloud, and RAG systems. I enjoy diving deep into how things work —
		especially the interaction between hardware and software.
	</p>
	<p>
		Off work: long rides on my motorcycle, badminton, and the occasional raid in Sea of Thieves.
		You can find me on <a href="https://www.linkedin.com/in/rohanalleti" target="_blank" rel="noopener">LinkedIn</a>
		or <a href="https://x.com/RohanJnr45" target="_blank" rel="noopener">Twitter</a>.
	</p>
</section>

<!-- Recent Notes -->
<section class="notes-section">
	<h2 class="section-heading">Notes</h2>

	<TabNav
		folders={data.folders}
		totalCount={data.notes.length}
		{activeFolder}
		onSelect={(f) => (activeFolder = f)}
	/>

	<ul class="notes-list">
		{#each filtered.slice(0, 30) as note}
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
</section>

<!-- Conference appearances -->
<section class="conferences">
	<h2 class="section-heading">Talks</h2>
	<ul class="conf-list">
		<li class="conf-item">
			<div class="conf-meta">
				<span class="conf-event">Rootconf 2025</span>
				<span class="conf-year">2025</span>
			</div>
			<a
				class="conf-title"
				href="https://hasgeek.com/rootconf/2025/sub/what-lies-beneath-postgresql-the-mechanics-of-writ-6AbqZBcAmAo5G8avq6ErJB"
				target="_blank"
				rel="noopener"
			>
				What Lies Beneath PostgreSQL: The Mechanics of Writes and Vacuum
			</a>
			<a class="conf-recording" href="https://vimeo.com/1084704677?share=copy#t=13210.89" target="_blank" rel="noopener">
				Watch recording →
			</a>
		</li>
		<li class="conf-item">
			<div class="conf-meta">
				<span class="conf-event">Javafest 2024</span>
				<span class="conf-year">2024</span>
			</div>
			<a
				class="conf-title"
				href="https://javafest.org/sessions/building-rag-chatbot/"
				target="_blank"
				rel="noopener"
			>
				Hands-On Guide to Building a RAG Chatbot
			</a>
			<a class="conf-recording" href="https://youtu.be/yH79W2kI0KE?si=bQAJv7bizS6kNxMn&t=520" target="_blank" rel="noopener">
				Watch recording →
			</a>
		</li>
		<li class="conf-item">
			<div class="conf-meta">
				<span class="conf-event">PyCon India 2025 — Bengaluru</span>
				<span class="conf-year">2025</span>
			</div>
			<a
				class="conf-title"
				href="https://youtu.be/qDGI5G-C6AQ?si=KqaH94Pipo-9Q6Ls"
				target="_blank"
				rel="noopener"
			>
				Python Sockets at Scale: I/O Multiplexing and Asyncio
			</a>
			<a class="conf-recording" href="https://youtu.be/qDGI5G-C6AQ?si=KqaH94Pipo-9Q6Ls" target="_blank" rel="noopener">
				Watch recording →
			</a>
		</li>
	</ul>
</section>

<style>
	/* About */
	.about {
		margin-bottom: 48px;
		padding-bottom: 28px;
		border-bottom: 2px dashed var(--border);
	}

	.about h1 {
		font-family: var(--font-display);
		font-size: 2rem;
		font-weight: 700;
		color: var(--heading);
		margin-bottom: 12px;
	}

	.about p {
		font-size: 14px;
		color: var(--text-muted);
		line-height: 1.8;
		max-width: 560px;
		margin-bottom: 8px;
	}

	.about a {
		color: var(--accent);
		border-bottom: 1px dashed var(--accent);
	}

	.about a:hover {
		border-bottom-style: solid;
	}

	/* Section heading */
	.section-heading {
		font-family: var(--font-display);
		font-size: 1.3rem;
		font-weight: 700;
		color: var(--heading);
		margin-bottom: 16px;
	}

	/* Notes */
	.notes-section {
		margin-bottom: 48px;
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

	.note-row:hover {
		background: #fff;
	}

	.note-row:hover .note-title {
		color: var(--accent);
	}

	.note-title {
		font-size: 14px;
		font-weight: 500;
		color: var(--heading);
		min-width: 0;
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

	/* Conferences */
	.conferences {
		padding-top: 4px;
	}

	.conf-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.conf-item {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.conf-meta {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.conf-event {
		font-size: 11px;
		font-weight: 600;
		color: var(--accent);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.conf-year {
		font-size: 11px;
		color: var(--text-muted);
	}

	.conf-title {
		font-size: 14px;
		font-weight: 500;
		color: var(--heading);
		transition: color 0.12s;
		width: fit-content;
	}

	.conf-title:hover {
		color: var(--accent);
	}

	.conf-recording {
		font-size: 12px;
		color: var(--accent);
		width: fit-content;
	}

	.conf-recording:hover {
		text-decoration: underline;
	}

	@media (max-width: 768px) {
		.about h1 {
			font-size: 1.5rem;
		}

		.note-row {
			flex-direction: column;
			gap: 4px;
			align-items: flex-start;
		}

		.note-right {
			padding-left: 0;
		}
	}
</style>
