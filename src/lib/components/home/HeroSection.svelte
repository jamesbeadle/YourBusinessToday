<script lang="ts">
	import GoogleSignInButton from './GoogleSignInButton.svelte';
</script>

<section class="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2">
	<div class="flex flex-col gap-6">
		<p class="font-display text-sm tracking-widest text-tfl-red uppercase">This station is YBT</p>
		<h1 class="font-display text-4xl leading-tight md:text-5xl">
			Every role.<br />Every workflow.<br />One map.
		</h1>
		<p class="max-w-prose text-lg text-map-ink/80">
			Talk to our AI agent about your business today. It turns every role into a line and every
			task into a station — an Underground-style Workflow Map of how your company really runs,
			ready for automation.
		</p>
		<div class="flex flex-wrap items-center gap-4">
			<a
				href="/map"
				class="rounded-full bg-tfl-blue px-6 py-3 font-display text-sm tracking-wide text-white
					transition hover:bg-tfl-red"
			>
				Explore the demo map
			</a>
			<a
				href="/chat"
				class="rounded-full border-2 border-tfl-blue px-6 py-3 font-display text-sm tracking-wide
					text-tfl-blue transition hover:border-tfl-red hover:text-tfl-red"
			>
				Start the conversation
			</a>
		</div>
		<GoogleSignInButton />
	</div>
	<svg viewBox="0 0 400 300" aria-hidden="true" class="hidden w-full md:block">
		<polyline
			points="20,80 240,80 320,160"
			fill="none"
			stroke="var(--color-tube-central)"
			stroke-width="12"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<polyline
			points="40,260 180,260 300,140 380,140"
			fill="none"
			stroke="var(--color-tube-district)"
			stroke-width="12"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<polyline
			points="60,20 60,180 140,260"
			fill="none"
			stroke="var(--color-tube-victoria)"
			stroke-width="12"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<circle cx="240" cy="80" r="11" fill="white" stroke="var(--color-map-ink)" stroke-width="4" />
		<circle cx="60" cy="180" r="11" fill="white" stroke="var(--color-map-ink)" stroke-width="4" />
		<circle cx="180" cy="260" r="11" fill="white" stroke="var(--color-map-ink)" stroke-width="4" />
		<circle cx="300" cy="140" r="11" fill="white" stroke="var(--color-map-ink)" stroke-width="4" />
	</svg>
</section>
