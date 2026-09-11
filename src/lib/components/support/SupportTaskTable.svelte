<script lang="ts">
	import { formatBritishDate } from '$lib/data/britishDate';
	import { taskStatusLabelFor } from '$lib/data/taskKind';
	import type { SupportTaskListing } from '$lib/server/support/getOpenSupportTasks';

	let { tasks }: { tasks: SupportTaskListing[] } = $props();
</script>

<ul class="divide-y divide-hairline rounded-2xl border border-hairline">
	{#each tasks as task (task.id)}
		<li class="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
			<div class="min-w-0 flex-1">
				<a
					href={`/projects/${task.projectId}/tasks/${task.id}`}
					class="font-display transition hover:text-signal"
				>
					{task.title}
				</a>
				<p class="truncate text-xs text-chalk/50">
					{task.projectName} · raised {formatBritishDate(task.createdAt)}
				</p>
			</div>
			<span class="font-display text-xs text-chalk/60">
				{taskStatusLabelFor(task.kind, task.status)}
			</span>
		</li>
	{/each}
</ul>
