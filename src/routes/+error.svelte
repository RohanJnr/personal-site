<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>404 — Rohan's Notes</title>
</svelte:head>

<div class="error-page">
	<!-- Motorcycle sketch -->
	<svg class="bike" width="240" height="150" viewBox="0 0 240 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
			<!-- rear wheel -->
			<circle cx="52" cy="115" r="30" stroke-width="2.5" />
			<circle cx="52" cy="115" r="12" stroke-width="1.2" />
			<circle cx="52" cy="115" r="3" stroke-width="1.5" />
			<!-- spokes rear -->
			<line x1="52" y1="85" x2="52" y2="103" stroke-width="0.8" />
			<line x1="52" y1="127" x2="52" y2="145" stroke-width="0.8" />
			<line x1="22" y1="115" x2="40" y2="115" stroke-width="0.8" />
			<line x1="64" y1="115" x2="82" y2="115" stroke-width="0.8" />
			<line x1="31" y1="94" x2="43" y2="106" stroke-width="0.8" />
			<line x1="61" y1="124" x2="73" y2="136" stroke-width="0.8" />
			<line x1="31" y1="136" x2="43" y2="124" stroke-width="0.8" />
			<line x1="61" y1="106" x2="73" y2="94" stroke-width="0.8" />

			<!-- front wheel -->
			<circle cx="188" cy="115" r="30" stroke-width="2.5" />
			<circle cx="188" cy="115" r="12" stroke-width="1.2" />
			<circle cx="188" cy="115" r="3" stroke-width="1.5" />
			<!-- spokes front -->
			<line x1="188" y1="85" x2="188" y2="103" stroke-width="0.8" />
			<line x1="188" y1="127" x2="188" y2="145" stroke-width="0.8" />
			<line x1="158" y1="115" x2="176" y2="115" stroke-width="0.8" />
			<line x1="200" y1="115" x2="218" y2="115" stroke-width="0.8" />
			<line x1="167" y1="94" x2="179" y2="106" stroke-width="0.8" />
			<line x1="197" y1="124" x2="209" y2="136" stroke-width="0.8" />
			<line x1="167" y1="136" x2="179" y2="124" stroke-width="0.8" />
			<line x1="197" y1="106" x2="209" y2="94" stroke-width="0.8" />

			<!-- frame -->
			<path d="M52 115 L85 65 L140 55 L188 115" stroke-width="2.2" />
			<path d="M85 65 L52 115" stroke-width="2" />
			<path d="M85 65 L110 90 L140 55" stroke-width="1.8" />
			<path d="M110 90 L115 115" stroke-width="1.8" />

			<!-- engine block -->
			<rect x="82" y="78" width="36" height="24" rx="3" stroke-width="1.8" />
			<line x1="88" y1="84" x2="88" y2="96" stroke-width="1" />
			<line x1="94" y1="84" x2="94" y2="96" stroke-width="1" />
			<line x1="100" y1="84" x2="100" y2="96" stroke-width="1" />
			<line x1="106" y1="84" x2="106" y2="96" stroke-width="1" />
			<line x1="112" y1="84" x2="112" y2="96" stroke-width="1" />

			<!-- tank -->
			<ellipse cx="118" cy="58" rx="22" ry="10" stroke-width="2" />
			<path d="M108 52 Q118 46 128 52" stroke-width="1" />

			<!-- seat -->
			<path d="M96 55 Q82 50 74 56 Q70 60 76 62 L96 58" stroke-width="1.8" />

			<!-- exhaust -->
			<path d="M82 98 L60 108 Q48 112 42 108" stroke-width="2.2" />
			<ellipse cx="40" cy="108" rx="4" ry="3" stroke-width="1.2" />

			<!-- front fork -->
			<path d="M140 55 L175 38" stroke-width="2" />
			<path d="M170 42 L188 115" stroke-width="2" />
			<path d="M174 36 L192 110" stroke-width="1.2" />

			<!-- handlebars -->
			<path d="M172 34 L160 24 L154 26" stroke-width="2.2" />
			<path d="M172 34 L182 28 L188 30" stroke-width="2.2" />
			<!-- mirror -->
			<circle cx="152" cy="22" r="4" stroke-width="1.2" />

			<!-- headlight -->
			<ellipse cx="192" cy="80" rx="5" ry="7" stroke-width="1.5" />
			<!-- headlight rays -->
			<line x1="198" y1="76" x2="206" y2="73" stroke-width="0.8" />
			<line x1="198" y1="80" x2="208" y2="80" stroke-width="0.8" />
			<line x1="198" y1="84" x2="206" y2="87" stroke-width="0.8" />

			<!-- chain -->
			<path d="M52 115 Q80 125 115 115" stroke-width="1" stroke-dasharray="3 2" />

			<!-- kickstand -->
			<line x1="100" y1="105" x2="90" y2="145" stroke-width="1.5" />
		</g>
	</svg>

	<h1 class="error-code">404</h1>
	<p class="error-message">{page.error?.message ?? 'This road leads nowhere.'}</p>
	<a href="/" class="back-home">Ride back home</a>
</div>

<style>
	.error-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 60px 20px;
		min-height: 60vh;
	}

	.bike {
		color: var(--border-strong);
		margin-bottom: 24px;
		opacity: 0.7;
	}

	.error-code {
		font-family: var(--font-display);
		font-size: 7rem;
		font-weight: 900;
		color: var(--heading);
		line-height: 1;
		margin-bottom: 8px;
		letter-spacing: -2px;
	}

	.error-message {
		font-size: 16px;
		color: var(--text-muted);
		margin-bottom: 28px;
	}

	.back-home {
		font-size: 14px;
		color: var(--accent);
		border: 1.5px solid var(--accent);
		padding: 8px 20px;
		border-radius: 6px;
		transition: background 0.15s, color 0.15s;
	}

	.back-home:hover {
		background: var(--accent);
		color: #fff;
	}

	@media (max-width: 768px) {
		.error-code {
			font-size: 5rem;
		}

		.bike {
			width: 180px;
			height: auto;
		}
	}
</style>
