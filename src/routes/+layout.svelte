<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';

	let { children }: { children: import('svelte').Snippet } = $props();
</script>

<Navbar />
<main class="page-content">
	{@render children()}
</main>

<style>
	.page-content {
		max-width: 860px;
		margin: 0 auto;
		padding: 52px 32px 80px;
		width: 100%;
	}

	@media (max-width: 640px) {
		.page-content {
			padding: 32px 16px 60px;
		}
	}
</style>
