<script lang="ts">
	import { taskStatusLabelFor, type TaskKind } from '$lib/data/taskKind';
	import type { TaskStatus } from '$lib/data/taskStatus';

	let {
		status,
		kind = 'work',
		onOpenPicker
	}: { status: TaskStatus; kind?: TaskKind; onOpenPicker: () => void } = $props();

	const statusStyles: Record<TaskStatus, string> = {
		backlog: 'border-hairline text-chalk/70 hover:border-chalk/50',
		in_progress: 'border-caution/60 text-caution hover:border-caution',
		done: 'border-go/60 text-go hover:border-go'
	};
</script>

<button
	type="button"
	onclick={onOpenPicker}
	title="Change status"
	class={`w-28 rounded-full border px-3 py-1.5 font-display text-xs transition ${statusStyles[status]}`}
>
	{taskStatusLabelFor(kind, status)}
</button>
