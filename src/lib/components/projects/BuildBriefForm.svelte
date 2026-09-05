<script lang="ts">
	import { inputClasses, quietButtonClasses } from '$lib/components/site/formStyles';
	import type { ProjectTask } from '$lib/server/projects/taskRecord';

	let { task, canSend }: { task: ProjectTask; canSend: boolean } = $props();

	const sendLabel = $derived(task.buildStatus === 'not_sent' ? 'Send to build' : 'Build again');
	const isLocked = $derived(task.buildStatus === 'queued' || task.buildStatus === 'building');
	const sendButtonClasses =
		'rounded-full bg-go px-6 py-2 font-display text-sm font-medium text-night transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60';
</script>

<form method="POST" action="?/saveBrief" class="flex flex-col gap-3">
	<label class="flex flex-col gap-2 text-sm text-chalk/70">
		The brief
		<textarea name="brief" rows="6" disabled={isLocked} class={inputClasses}>{task.buildBrief}</textarea>
	</label>
	<div class="flex flex-wrap justify-end gap-3">
		<button type="submit" disabled={isLocked} class={quietButtonClasses}>Save brief</button>
		{#if canSend}
			<button type="submit" formaction="?/sendToBuild" disabled={isLocked} class={sendButtonClasses}>
				{sendLabel}
			</button>
		{/if}
	</div>
</form>
