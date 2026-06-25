<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';

	const themes = [
		{ id: 'paper',   label: 'Paper',   swatch: ['#ffffff', '#f7f7f7', '#ff6600'] },
		{ id: 'obsidian', label: 'Obsidian', swatch: ['#1a1b1e', '#222327', '#c9a96e'] },
		{ id: 'forest',  label: 'Forest',  swatch: ['#f4f1eb', '#e8e3d8', '#4a7c59'] },
		{ id: 'slate',   label: 'Slate',   swatch: ['#0d1117', '#161b22', '#ff6600'] },
		{ id: 'rose',    label: 'Rose',    swatch: ['#fdf6f0', '#f4e6da', '#b5401f'] },
	];

	let activeTheme = $state(
		(browser && localStorage.getItem('theme')) || 'slate'
	);

	let themeOpen = $state(false);

	function applyTheme(id: string) {
		activeTheme = id;
		document.documentElement.setAttribute('data-theme', id);
		if (browser) localStorage.setItem('theme', id);
		themeOpen = false;
	}

	if (browser) {
		document.documentElement.setAttribute('data-theme', activeTheme);
	}

	const navLinks = [
		{ href: '/',             label: 'Home' },
		{ href: '/notes',        label: 'Notes' },
		{ href: '/motorcycling', label: 'Motorcycling' },
	];

	function isActive(href: string, pathname: string) {
		if (href === '/') return pathname === '/';
		return pathname.startsWith(href);
	}
</script>

<header class="navbar">
	<div class="navbar-inner">
		<a href="/" class="wordmark">Rohan Alleti</a>

		<nav class="nav-links">
			{#each navLinks as link}
				<a
					href={link.href}
					class="nav-link"
					class:active={isActive(link.href, page.url.pathname)}
				>{link.label}</a>
			{/each}
		</nav>

		<div class="navbar-right">
			<div class="theme-picker">
				<button
					class="theme-trigger"
					onclick={() => (themeOpen = !themeOpen)}
					aria-label="Change theme"
					title="Change theme"
				>
					<span
						class="active-swatch"
						style="background:{themes.find(t => t.id === activeTheme)?.swatch[0]};border-color:{themes.find(t => t.id === activeTheme)?.swatch[2]}40"
					>
						<span class="active-swatch-accent" style="background:{themes.find(t => t.id === activeTheme)?.swatch[2]}"></span>
					</span>
				</button>

				{#if themeOpen}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<div class="theme-backdrop" onclick={() => (themeOpen = false)} role="presentation"></div>
					<div class="theme-dropdown">
						{#each themes as t}
							<button
								class="theme-option"
								class:active={activeTheme === t.id}
								onclick={() => applyTheme(t.id)}
							>
								<span class="swatch" style="background:{t.swatch[0]};border-color:{t.swatch[2]}40">
									<span class="swatch-sidebar" style="background:{t.swatch[1]}"></span>
									<span class="swatch-accent" style="background:{t.swatch[2]}"></span>
								</span>
								<span class="theme-label">{t.label}</span>
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</header>

<style>
	.navbar {
		position: static;
	}

	.navbar-inner {
		max-width: 860px;
		margin: 0 auto;
		padding: 0 32px;
		height: 54px;
		display: flex;
		align-items: center;
		gap: 32px;
	}

	.wordmark {
		font-family: var(--font-body);
		font-size: 17px;
		font-weight: 500;
		color: var(--heading);
		letter-spacing: -0.2px;
		white-space: nowrap;
		transition: color 0.15s;
	}

	.wordmark:hover {
		color: var(--accent);
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 2px;
		flex: 1;
	}

	.nav-link {
		font-family: var(--font-body);
		font-size: 14px;
		color: var(--text-muted);
		padding: 5px 10px;
		border-radius: 5px;
		transition: color 0.12s, background 0.12s;
	}

	.nav-link:hover {
		color: var(--text);
	}

	.nav-link.active {
		color: var(--accent);
	}

	.navbar-right {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	/* Theme picker */
	.theme-picker {
		position: relative;
	}

	.theme-trigger {
		background: none;
		border: none;
		cursor: pointer;
		padding: 4px;
		display: flex;
		align-items: center;
	}

	.active-swatch {
		display: flex;
		width: 22px;
		height: 16px;
		border-radius: 3px;
		border: 1.5px solid;
		overflow: hidden;
	}

	.active-swatch-accent {
		width: 6px;
		height: 100%;
		margin-left: auto;
	}

	.theme-backdrop {
		position: fixed;
		inset: 0;
		z-index: 10;
	}

	.theme-dropdown {
		position: absolute;
		right: 0;
		top: calc(100% + 8px);
		background: var(--bg);
		border: 1px solid var(--border-strong);
		border-radius: 8px;
		padding: 6px;
		display: flex;
		flex-direction: column;
		gap: 2px;
		box-shadow: 0 4px 16px rgba(0,0,0,0.08);
		z-index: 20;
		min-width: 130px;
	}

	.theme-option {
		display: flex;
		align-items: center;
		gap: 10px;
		background: none;
		border: none;
		border-radius: 5px;
		padding: 7px 10px;
		cursor: pointer;
		width: 100%;
		text-align: left;
		transition: background 0.1s;
	}

	.theme-option:hover {
		background: var(--bg-surface);
	}

	.theme-option.active {
		background: var(--accent-light);
	}

	.swatch {
		width: 22px;
		height: 16px;
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
		width: 6px;
		height: 100%;
		margin-left: auto;
	}

	.theme-label {
		font-family: var(--font-body);
		font-size: 12px;
		color: var(--text-muted);
	}

	.theme-option.active .theme-label {
		color: var(--accent);
	}

	@media (max-width: 640px) {
		.navbar-inner {
			padding: 0 16px;
			gap: 16px;
		}

		.wordmark {
			font-size: 15px;
		}

		.nav-link {
			font-size: 13px;
			padding: 5px 7px;
		}
	}
</style>
