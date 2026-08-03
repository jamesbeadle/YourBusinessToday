<script lang="ts">
	import { enhance } from '$app/forms';
	import { nextTaskStatus, taskStatusLabels, type TaskStatus } from '$lib/data/taskStatus';

	let { taskId, status }: { taskId: string; status: TaskStatus } = $props();

	const statusStyles: Record<TaskStatus, string> = {
		backlog: 'border-hairline text-chalk/70 hover:border-chalk/50',
		in_progress: 'border-caution/60 text-caution hover:border-caution',
		done: 'border-go/60 text-go hover:border-go'
	};
</script>

<form method="POST" action="?/setStatus" use:enhance>
	<input type="hidden" name="taskId" value={taskId} />
	<input type="hidden" name="status" value={nextTaskStatus[status]} />
	<button
		type="submit"
		title={`Mark as ${taskStatusLabels[nextTaskStatus[status]].toLowerCase()}`}
		class={`w-28 rounded-full border px-3 py-1.5 font-display text-xs transition ${statusStyles[status]}`}
	>
		{taskStatusLabels[status]}
	</button>
</form>
