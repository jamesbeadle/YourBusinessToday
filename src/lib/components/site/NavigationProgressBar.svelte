<script lang="ts">
	import { navigating } from '$app/state';

	const showDelayMilliseconds = 150;

	let isVisible = $state(false);

	$effect(() => {
		if (navigating.to === null) {
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
		aria-label="Loading"
		class="fixed inset-x-0 top-0 z-60 h-0.5 overflow-hidden bg-go/10"
	>
		<div class="progress-runner h-full w-1/3 rounded-full bg-go"></div>
	</div>
{/if}

<style>
	.progress-runner {
		animation: progress-slide 1.1s ease-in-out infinite;
	}

	@keyframes progress-slide {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(400%);
		}
	}
</style>
