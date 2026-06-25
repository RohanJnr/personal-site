<script lang="ts">
	import { slugToHref } from '$lib/utils.js';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();

	let lightboxOpen = $state(false);

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') lightboxOpen = false;
	}

	const TALKS = [
		{ title: 'What Lies Beneath PostgreSQL: The Mechanics of Writes and Vacuum', event: 'Rootconf', location: 'Bengaluru', date: '2025', kind: 'Talk', href: 'https://hasgeek.com/rootconf/2025/sub/what-lies-beneath-postgresql-the-mechanics-of-writ-6AbqZBcAmAo5G8avq6ErJB' },
		{ title: 'Hands-On Guide to Building a RAG Chatbot', event: 'Javafest', location: 'Online', date: '2024', kind: 'Talk', href: 'https://javafest.org/sessions/building-rag-chatbot/' },
		{ title: 'Python Sockets at Scale: I/O Multiplexing and Asyncio', event: 'PyCon India', location: 'Bengaluru', date: '2025', kind: 'Talk', href: 'https://youtu.be/qDGI5G-C6AQ?si=KqaH94Pipo-9Q6Ls' },
	];

	const RECENT_NOTES = data.notes.slice(0, 5);
	const RECENT_RIDES = data.rides.slice(0, 3);
</script>

<svelte:window onkeydown={onKeydown} />

<svelte:head>
	<title>Rohan Alleti</title>
	<meta name="description" content="Software engineer working on backend, cloud, and applied Gen-AI systems(RAG, Agentic, etc). Writing notes on things I wish I'd known earlier." />
	<meta property="og:title" content="Rohan Alleti" />
	<meta property="og:description" content="Software engineer working on backend, cloud, and RAG systems." />
	<meta property="og:type" content="website" />
</svelte:head>

<!-- Hero -->
<section class="hero">
	<div class="hero-text">
		<p class="greeting">Hey, I'm Rohan —</p>
		<h1>
			software engineer, note-taker,<br>
			and <em>motorcycle rider.</em>
		</h1>
		<p class="bio">
			I work at <a href="https://sahaj.ai" target="_blank" rel="noopener">Sahaj Software</a> on backend systems,
			cloud infrastructure, and applied Gen-AI systems(RAG, Agentic, etc). I write notes when I learn something I wish I'd known earlier.
			Off the keyboard: long rides, badminton, and the occasional Sea of Thieves raid.
		</p>
		<a href="https://linkedin.com/in/rohan-alleti" target="_blank" rel="noopener" class="linkedin-link">
			LinkedIn
			<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
				<path d="M2 10L10 2M10 2H4M10 2v6"/>
			</svg>
		</a>
	</div>
	<div class="hero-img-slot">
		<button class="img-btn" onclick={() => (lightboxOpen = true)} aria-label="View full size">
			<img src="/bike.jpg" alt="My motorcycle" />
		</button>
	</div>

{#if lightboxOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="lightbox-backdrop" onclick={() => (lightboxOpen = false)} role="dialog" aria-modal="true">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="lightbox-card" onclick={(e) => e.stopPropagation()}>
			<button class="lightbox-close" onclick={() => (lightboxOpen = false)} aria-label="Close">✕</button>
			<img src="/bike.jpg" alt="My motorcycle" />
		</div>
	</div>
{/if}
</section>

<!-- Recent Notes -->
<section class="section">
	<div class="section-header">
		<h2 class="section-title">Recent notes</h2>
		<a href="/notes" class="section-link">all {data.notes.length} →</a>
	</div>
	<ul class="note-list">
		{#each RECENT_NOTES as note}
			<li>
				<a href={slugToHref(note.slug)} class="note-row">
					<span class="note-date">
						{new Date(note.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
					</span>
					<span class="note-body">
						<span class="note-title">{note.title}</span>
						{#if note.tags.length > 0}
							<span class="note-tags">
								{#each note.tags.slice(0, 3) as tag}
									<span class="tag">#{tag}</span>
								{/each}
							</span>
						{/if}
					</span>
				</a>
			</li>
		{/each}
	</ul>
</section>

<!-- Recent Rides -->
{#if RECENT_RIDES.length > 0}
<section class="section">
	<div class="section-header">
		<h2 class="section-title">Recent rides</h2>
		<a href="/motorcycling" class="section-link">all →</a>
	</div>
	<ul class="note-list">
		{#each RECENT_RIDES as ride}
			<li>
				<a href={slugToHref(ride.slug)} class="note-row">
					<span class="note-date">
						{new Date(ride.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
					</span>
					<span class="note-body">
						<span class="note-title">{ride.title}</span>
					</span>
				</a>
			</li>
		{/each}
	</ul>
</section>
{/if}

<!-- Talks -->
<section class="section">
	<div class="section-header">
		<h2 class="section-title">Talks</h2>
	</div>
	<div class="talks-list">
		{#each TALKS as talk}
			<a href={talk.href} target="_blank" rel="noopener" class="talk-item">
				<span class="talk-year">{talk.date}</span>
				<span class="talk-body">
					<span class="talk-title">{talk.title}</span>
					<span class="talk-meta">{talk.event} · {talk.location}</span>
				</span>
			</a>
		{/each}
	</div>
</section>

<style>
	/* Hero */
	.hero {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 40px;
		align-items: start;
		padding-bottom: 56px;
		border-bottom: 1px solid var(--border);
		margin-bottom: 56px;
	}

	.greeting {
		font-family: var(--font-body);
		font-size: 12px;
		color: var(--text-muted);
		letter-spacing: 0.5px;
		margin-bottom: 14px;
	}

	h1 {
		font-family: var(--font-display);
		font-size: 2.2rem;
		font-weight: 500;
		line-height: 1.2;
		color: var(--heading);
		margin: 0 0 20px;
		letter-spacing: -0.4px;
	}

	h1 em {
		font-style: italic;
		color: var(--accent);
	}

	.bio {
		font-size: 15px;
		line-height: 1.7;
		color: var(--text-muted);
		max-width: 520px;
		margin: 0 0 20px;
	}

	.bio a {
		color: var(--text);
		border-bottom: 1px solid var(--border-strong);
		transition: color 0.12s, border-color 0.12s;
	}

	.bio a:hover {
		color: var(--accent);
		border-bottom-color: var(--accent);
	}

	.linkedin-link {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 14px;
		color: var(--text-muted);
		transition: color 0.12s;
	}

	.linkedin-link:hover {
		color: var(--accent);
	}

	.hero-img-slot {
		width: 200px;
		height: 200px;
		border-radius: 10px;
		overflow: hidden;
		flex-shrink: 0;
	}

	.img-btn {
		display: block;
		width: 100%;
		height: 100%;
		padding: 0;
		border: none;
		background: none;
		cursor: zoom-in;
	}

	.hero-img-slot img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		display: block;
		transition: opacity 0.15s;
	}

	.img-btn:hover img {
		opacity: 0.9;
	}

	/* Lightbox */
	.lightbox-backdrop {
		position: fixed;
		inset: 0;
		z-index: 100;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40px;
		animation: fade-in 0.18s ease;
	}

	.lightbox-card {
		position: relative;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
		max-width: 80vw;
		max-height: 80vh;
		animation: pop-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.lightbox-card img {
		display: block;
		max-width: 80vw;
		max-height: 80vh;
		object-fit: contain;
	}

	.lightbox-close {
		position: absolute;
		top: 12px;
		right: 12px;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.55);
		border: none;
		color: #fff;
		font-size: 14px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.15s;
		line-height: 1;
	}

	.lightbox-close:hover {
		background: rgba(0, 0, 0, 0.8);
	}

	@keyframes fade-in {
		from { opacity: 0; }
		to   { opacity: 1; }
	}

	@keyframes pop-in {
		from { opacity: 0; transform: scale(0.88); }
		to   { opacity: 1; transform: scale(1); }
	}

	/* Sections */
	.section {
		margin-bottom: 36px;
	}

	.section-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		padding-bottom: 6px;
		border-bottom: 1px solid var(--border);
		margin-bottom: 0;
	}

	.section-title {
		font-family: var(--font-body);
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--heading);
		margin: 0;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.section-link {
		font-family: var(--font-body);
		font-size: 11px;
		color: var(--text-muted);
		transition: color 0.12s;
	}

	.section-link:hover {
		color: var(--accent);
	}

	/* Note list */
	.note-list {
		list-style: none;
	}

	.note-row {
		display: flex;
		align-items: baseline;
		gap: 12px;
		padding: 7px 0;
		border-bottom: 1px solid var(--border);
	}

	.note-list li:last-child .note-row {
		border-bottom: none;
	}

	.note-date {
		font-size: 11px;
		color: var(--text-muted);
		flex-shrink: 0;
		width: 44px;
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

	.note-row:hover .note-title {
		color: var(--accent);
	}

	.note-tags {
		display: flex;
		gap: 4px;
		flex-shrink: 0;
	}

	.tag {
		font-size: 10px;
		color: var(--text-muted);
	}

	/* Talks */
	.talks-list {
		display: flex;
		flex-direction: column;
	}

	.talk-item {
		display: flex;
		align-items: baseline;
		gap: 12px;
		padding: 7px 0;
		border-bottom: 1px solid var(--border);
	}

	.talks-list .talk-item:last-child {
		border-bottom: none;
	}

	.talk-year {
		font-size: 11px;
		color: var(--text-muted);
		flex-shrink: 0;
		width: 36px;
	}

	.talk-body {
		display: flex;
		align-items: baseline;
		gap: 10px;
		flex: 1;
		min-width: 0;
	}

	.talk-title {
		font-size: 14px;
		color: var(--heading);
		line-height: 1.4;
		transition: color 0.12s;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.talk-item:hover .talk-title {
		color: var(--accent);
	}

	.talk-meta {
		font-size: 12px;
		flex-shrink: 0;
		color: var(--text-muted);
		font-style: italic;
	}

	@media (max-width: 640px) {
		.hero {
			grid-template-columns: 1fr;
			padding-bottom: 40px;
			margin-bottom: 40px;
		}

		.hero-img-slot {
			display: none;
		}

		h1 {
			font-size: 1.7rem;
		}

		.note-row,
		.talk-item {
			grid-template-columns: 1fr;
			gap: 4px;
		}

		.note-date,
		.talk-year {
			display: none;
		}
	}
</style>
