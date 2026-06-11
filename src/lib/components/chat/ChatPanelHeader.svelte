<script lang="ts">
	import Roundel from '../site/Roundel.svelte';

	let { projectName, onClose }: { projectName: string; onClose: () => void } = $props();
</script>

<header class="flex items-center justify-between gap-3 bg-tfl-blue px-4 py-3 text-white">
	<div class="flex items-center gap-3">
		<Roundel size={26} />
		<div>
			<p class="font-display text-sm tracking-wide">The Agent</p>
			<p class="text-xs text-white/70">{projectName}</p>
		</div>
	</div>
	<button
		type="button"
		aria-label="Close the agent chat"
		class="font-display text-xl leading-none hover:text-tube-circle"
		onclick={onClose}
	>
		×
	</button>
</header>
