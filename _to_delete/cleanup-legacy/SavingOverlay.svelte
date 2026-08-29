<script lang="ts">
	import { pendingSaves } from '$lib/client/pendingSaves.svelte';

	// Only take over the screen for saves that actually feel slow — very fast
	// round-trips finish before the overlay ever appears, so nothing flickers.
	const showDelayMilliseconds = 150;

	let isVisible = $state(false);

	$effect(() => {
		if (!pendingSaves.isActive) {
			isVisible = false;
			return;
		}
		const showTimer = setTimeout(() => (isVisible = true), showDelayMilliseconds);
		return () => clearTimeout(showTimer);
	});
</script>

{#if isVisible}
	<div
		role="status"
		aria-live="polite"
		aria-label="Saving"
		class="fixed inset-0 z-70 flex flex-col items-center justify-center gap-4 bg-night/70
			backdrop-blur-sm"
	>
		<span
			class="h-10 w-10 animate-spin rounded-full border-4 border-go/25 border-t-go"
			aria-hidden="true"
		></span>
		<p class="font-display text-sm font-medium tracking-wide text-chalk/90">Saving…</p>
	</div>
{/if}
