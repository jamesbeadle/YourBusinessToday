<script lang="ts">
	import { enhance } from '$app/forms';
	import { FormTracker } from '$lib/client/formTracker.svelte';

	let {
		moveAction,
		fieldName,
		id,
		isFirst,
		isLast,
		extraFields = {}
	}: {
		moveAction: string;
		fieldName: string;
		id: string;
		isFirst: boolean;
		isLast: boolean;
		extraFields?: Record<string, string>;
	} = $props();

	const tracker = new FormTracker();
</script>

<div class="flex flex-col" class:animate-pulse={tracker.isSaving}>
	<form method="POST" action={moveAction} use:enhance={tracker.submit()}>
		<input type="hidden" name={fieldName} value={id} />
		<input type="hidden" name="direction" value="up" />
		{#each Object.entries(extraFields) as [extraFieldName, extraFieldValue] (extraFieldName)}
			<input type="hidden" name={extraFieldName} value={extraFieldValue} />
		{/each}
		<button
			type="submit"
			disabled={isFirst || tracker.isSaving}
			aria-label="Raise priority"
			class="px-1 text-chalk/40 transition hover:text-go"
			class:invisible={isFirst}
		>
			▲
		</button>
	</form>
	<form method="POST" action={moveAction} use:enhance={tracker.submit()}>
		<input type="hidden" name={fieldName} value={id} />
		<input type="hidden" name="direction" value="down" />
		{#each Object.entries(extraFields) as [extraFieldName, extraFieldValue] (extraFieldName)}
			<input type="hidden" name={extraFieldName} value={extraFieldValue} />
		{/each}
		<button
			type="submit"
			disabled={isLast || tracker.isSaving}
			aria-label="Lower priority"
			class="px-1 text-chalk/40 transition hover:text-caution"
			class:invisible={isLast}
		>
			▼
		</button>
	</form>
</div>
