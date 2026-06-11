<script lang="ts">
	import Roundel from './Roundel.svelte';

	const navigationLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/map', label: 'Workflow Map' },
		{ href: '/chat', label: 'The Agent' }
	];
</script>

<header class="bg-tfl-blue text-white">
	<div class="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3">
		<a href="/" class="flex items-center gap-3">
			<Roundel />
			<span class="font-display text-lg tracking-wide">Your Business Today</span>
		</a>
		<nav class="flex items-center gap-6">
			{#each navigationLinks as navigationLink}
				<a
					href={navigationLink.href}
					class="font-display text-sm tracking-wide hover:underline underline-offset-4"
				>
					{navigationLink.label}
				</a>
			{/each}
		</nav>
	</div>
	<div class="h-1.5 bg-tfl-red"></div>
</header>
