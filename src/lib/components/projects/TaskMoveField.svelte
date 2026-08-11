<script lang="ts">
	import type { ProjectTask } from '$lib/server/projects/taskRecord';

	let {
		parentTask,
		siblingTasks
	}: {
		parentTask: ProjectTask | null;
		siblingTasks: ProjectTask[];
	} = $props();

	const currentPositionLabel = $derived(
		parentTask === null
			? 'Where it is now (top level)'
			: `Where it is now (under “${parentTask.title}”)`
	);
	const fieldClasses =
		'rounded-xl border border-hairline bg-night px-4 py-2.5 text-chalk outline-none focus:border-go';
</script>

<label class="flex flex-col gap-1">
	<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">Move to</span>
	<select name="moveTo" value="keep" class={fieldClasses}>
		<option value="keep">{currentPositionLabel}</option>
		{#if parentTask !== null}
			<option value="up">Up one level — beside “{parentTask.title}”</option>
		{/if}
		{#each siblingTasks as siblingTask (siblingTask.id)}
			<option value={siblingTask.id}>Subtask of “{siblingTask.title}”</option>
		{/each}
	</select>
</label>
