<script lang="ts">
	import TaskMetaBadges from './TaskMetaBadges.svelte';
	import TaskStatusButton from './TaskStatusButton.svelte';
	import type { ProjectTask } from '$lib/server/projects/taskRecord';

	let {
		task,
		positionNumber,
		phaseName
	}: { task: ProjectTask; positionNumber: number; phaseName: string | null } = $props();

	const isDone = $derived(task.status === 'done');
</script>

<li class="flex items-center gap-4 px-5 py-4" class:opacity-50={isDone}>
	<span class="w-6 text-right font-display text-sm text-chalk/40">{positionNumber}</span>
	<div class="min-w-0 flex-1">
		<a
			href={`/projects/${task.projectId}/tasks/${task.id}`}
			class="block truncate font-display transition hover:text-go"
		>
			{#if task.isUserStory}<span title="User story" class="text-caution">◆</span>{/if}
			{task.title}
		</a>
		{#if phaseName !== null}
			<p class="truncate text-xs text-chalk/50">{phaseName}</p>
		{/if}
	</div>
	<TaskMetaBadges {task} />
	<TaskStatusButton taskId={task.id} status={task.status} />
</li>
