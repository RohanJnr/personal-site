<script lang="ts">
	import { slugToHref } from '$lib/utils.js';

	let {
		notes
	}: {
		notes: { slug: string; title: string; date: string; tags: string[]; folder: string }[];
	} = $props();

	// Group notes by relative date label
	function groupByDay(notes: typeof $props.notes['notes']) {
		const groups = new Map<string, typeof notes>();
		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

		for (const note of notes) {
			const d = new Date(note.date);
			const noteDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
			const diffDays = Math.round((today.getTime() - noteDay.getTime()) / 86400000);

			let label: string;
			if (diffDays === 0) label = 'Today';
			else if (diffDays === 1) label = 'Yesterday';
			else if (diffDays < 7) label = `${diffDays} days ago`;
			else {
				label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
			}

			if (!groups.has(label)) groups.set(label, []);
			groups.get(label)!.push(note);
		}
		return groups;
	}

	const grouped = $derived(groupByDay(notes));

	// Folder → icon mapping
	function folderIcon(folder: string): string {
		const f = folder.toLowerCase();
		if (f.includes('database') || f.includes('postgres') || f.includes('scylla')) return '🗄';
		if (f.includes('cloud') || f.includes('aws') || f.includes('gcp')) return '☁';
		if (f.includes('devops') || f.includes('kubernetes') || f.includes('k8s')) return '⚙';
		if (f.includes('distributed')) return '🔗';
		if (f.includes('data')) return '📊';
		if (f.includes('api')) return '🔌';
		if (f.includes('programming') || f.includes('go') || f.includes('python')) return '💻';
		if (f.includes('rag') || f.includes('ai') || f.includes('ml')) return '🤖';
		if (f.includes('microservice')) return '🧩';
		return '📝';
	}
</script>

<div class="stream">
	{#each [...grouped.entries()] as [label, dayNotes]}
		<div class="day-group">
			<div class="day-label">{label}</div>
			{#each dayNotes as note}
				<a href={slugToHref(note.slug)} class="note-item">
					<div class="note-icon">{folderIcon(note.folder)}</div>
					<div class="note-info">
						<div class="note-title">{note.title}</div>
						<div class="note-meta">
							<span class="note-folder">{note.folder}</span>
							{#each note.tags.filter((t) => t !== note.folder).slice(0, 3) as tag}
								<span class="tag">#{tag}</span>
							{/each}
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/each}

	{#if notes.length === 0}
		<p class="empty">No notes found.</p>
	{/if}
</div>

<style>
	.stream {
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	.day-group {
		display: flex;
		flex-direction: column;
	}

	.day-label {
		font-size: 11px;
		font-weight: 600;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 1px;
		margin-bottom: 6px;
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.day-label::after {
		content: '';
		flex: 1;
		border-top: 1px solid var(--border);
	}

	.note-item {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 10px 12px;
		margin: 0 -12px;
		border-radius: 8px;
		transition: background 0.12s;
	}

	.note-item:hover {
		background: #fff;
	}

	.note-icon {
		font-size: 16px;
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		margin-top: 1px;
	}

	.note-info {
		min-width: 0;
		flex: 1;
	}

	.note-title {
		font-size: 14px;
		font-weight: 500;
		color: var(--heading);
		margin-bottom: 3px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.note-item:hover .note-title {
		color: var(--accent);
	}

	.note-meta {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		color: var(--text-muted);
		flex-wrap: wrap;
	}

	.note-folder {
		background: var(--bg-surface);
		padding: 1px 6px;
		border-radius: 3px;
		font-size: 11px;
	}

	.tag {
		color: var(--accent);
		font-size: 11px;
		font-weight: 500;
	}

	.empty {
		color: var(--text-muted);
		font-style: italic;
		padding: 16px 0;
	}
</style>
