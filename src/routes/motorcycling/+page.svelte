<script lang="ts">
	import { slugToHref } from '$lib/utils.js';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Motorcycling — Rohan Alleti</title>
</svelte:head>

<div class="page-header">
	<h1>Motorcycling</h1>
	<p class="sub">Rides, routes, and notes from the road.</p>
</div>

{#if data.rides.length === 0}
	<div class="empty">
		<svg width="48" height="48" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.2">
			<circle cx="16" cy="46" r="10"/>
			<circle cx="48" cy="46" r="10"/>
			<path d="M16 46 L26 22 L38 28 L48 46"/>
			<path d="M26 22 L40 22"/>
			<path d="M38 28 L44 18"/>
			<circle cx="44" cy="16" r="2"/>
		</svg>
		<p>No rides yet — check back soon.</p>
	</div>
{:else}
	<ul class="ride-list">
		{#each data.rides as ride}
			<li>
				<a href={slugToHref(ride.slug)} class="ride-row">
					<span class="ride-date">
						{new Date(ride.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
					</span>
					<span class="ride-title">{ride.title}</span>
					{#if ride.tags.length > 0}
						<span class="ride-tags">
							{#each ride.tags as tag}
								<span class="tag-pill">#{tag}</span>
							{/each}
						</span>
					{/if}
				</a>
			</li>
		{/each}
	</ul>
{/if}

<style>
	.page-header {
		margin-bottom: 32px;
		padding-bottom: 20px;
		border-bottom: 1px solid var(--border);
	}

	h1 {
		font-family: var(--font-display);
		font-size: 2rem;
		font-weight: 500;
		color: var(--heading);
		margin: 0 0 6px;
		letter-spacing: -0.3px;
	}

	.sub {
		font-size: 14px;
		color: var(--text-muted);
		margin: 0;
	}

	.empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		padding: 80px 0;
		color: var(--text-muted);
		font-size: 14px;
	}

	.ride-list { list-style: none; }

	.ride-row {
		display: flex;
		align-items: baseline;
		gap: 14px;
		padding: 8px 0;
		border-bottom: 1px solid var(--border);
		transition: color 0.12s;
	}

	li:last-child .ride-row { border-bottom: none; }

	.ride-date {
		font-size: 11px;
		color: var(--text-muted);
		flex-shrink: 0;
		width: 90px;
	}

	.ride-title {
		font-size: 14px;
		color: var(--heading);
		flex: 1;
		transition: color 0.12s;
	}

	.ride-row:hover .ride-title { color: var(--accent); }

	.ride-tags {
		display: flex;
		gap: 4px;
		flex-shrink: 0;
	}

	.tag-pill {
		font-size: 10px;
		color: var(--text-muted);
		padding: 1px 5px;
		border: 1px solid var(--border);
		border-radius: 3px;
	}
</style>
