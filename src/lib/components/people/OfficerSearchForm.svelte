<script lang="ts">
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { inputClasses, panelClasses } from '$lib/components/site/formStyles';

	let { query }: { query: string } = $props();
</script>

<form method="GET" class={panelClasses}>
	<h2 class="font-display text-lg">Find on Companies House</h2>
	<div class="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
		<input
			name="officer"
			value={query}
			required
			placeholder="A director's name"
			aria-label="Officer name"
			class={inputClasses}
		/>
		<SubmitButton>Search officers</SubmitButton>
	</div>
	<p class="text-xs text-chalk/50">
		Pick the right namesake by their appointment count and birth month, and we bring in every
		company they currently hold.
	</p>
</form>
