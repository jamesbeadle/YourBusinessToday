<script lang="ts">
	import { fibonacciStoryPoints } from '$lib/data/storyPoints';
	import type { Phase } from '$lib/server/projects/phaseRecord';
	import type { ProjectTask } from '$lib/server/projects/taskRecord';

	let { task, phases }: { task: ProjectTask; phases: Phase[] } = $props();

	const fieldClasses =
		'rounded-xl border border-hairline bg-night px-4 py-2.5 text-chalk outline-none focus:border-go';
</script>

<div class="grid gap-4 sm:grid-cols-3">
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
