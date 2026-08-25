<script lang="ts">
	import { enhance } from '$app/forms';
	import { quietButtonClasses } from './accountingFormStyles';

	let {
		idFieldName,
		itemId,
		label,
		detail = '',
		isArchived,
		canArchive = true
	}: {
		idFieldName: string;
		itemId: string;
		label: string;
		detail?: string;
		isArchived: boolean;
		canArchive?: boolean;
	} = $props();
</script>

<li class="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
	<div>
		<p class={`font-display ${isArchived ? 'text-chalk/40 line-through' : ''}`}>{label}</p>
		{#if detail}<p class="text-xs text-chalk/50">{detail}</p>{/if}
	</div>
	{#if canArchive}
		<form method="POST" action="?/setArchived" use:enhance>
			<input type="hidden" name={idFieldName} value={itemId} />
			<input type="hidden" name="isArchived" value={String(!isArchived)} />
			<button type="submit" class={quietButtonClasses}>{isArchived ? 'Restore' : 'Archive'}</button>
		</form>
	{/if}
</li>
