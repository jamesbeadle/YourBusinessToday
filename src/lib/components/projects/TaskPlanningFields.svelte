<script lang="ts">
	import { fibonacciStoryPoints } from '$lib/data/storyPoints';
	import type { Phase } from '$lib/server/projects/phaseRecord';
	import type { ProjectTask } from '$lib/server/projects/taskRecord';
	import type { Sprint } from '$lib/server/projects/sprintRecord';

	let {
		task,
		phases,
		sprints
	}: { task: ProjectTask; phases: Phase[]; sprints: Sprint[] } = $props();

	const fieldClasses =
		'rounded-xl border border-hairline bg-night px-4 py-2.5 text-chalk outline-none focus:border-go';
</script>

<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
	<label class="flex flex-col gap-1">
		<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">Phase</span>
		<select name="phaseId" value={task.phaseId ?? ''} class={fieldClasses}>
			<option value="">No phase</option>
			{#each phases as phase (phase.id)}
				<option value={phase.id}>{phase.name}</option>
			{/each}
		</select>
	</label>
	<label class="flex flex-col gap-1">
		<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">Sprint</span>
		<select name="sprintId" value={task.sprintId ?? ''} class={fieldClasses}>
			<option value="">No sprint</option>
			{#each sprints as sprint (sprint.id)}
				<option value={sprint.id}>{sprint.name}</option>
			{/each}
		</select>
	</label>
	<label class="flex flex-col gap-1">
		<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">Story points</span>
		<select name="storyPoints" value={String(task.storyPoints)} class={fieldClasses}>
			{#each fibonacciStoryPoints as storyPointsOption (storyPointsOption)}
				<option value={String(storyPointsOption)}>{storyPointsOption}</option>
			{/each}
		</select>
	</label>
	<label class="flex flex-col gap-1">
		<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">Complete %</span>
		<input
			name="completionPercent"
			type="number"
			min="0"
			max="100"
			step="5"
			value={task.completionPercent}
			class={fieldClasses}
		/>
	</label>
</div>
