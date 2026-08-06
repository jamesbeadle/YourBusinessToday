<script lang="ts">
	import { projectStatusLabels, type ProjectStatus } from '$lib/data/projectStatus';

	let { status }: { status: ProjectStatus } = $props();

	const statusStyles: Record<ProjectStatus, string> = {
		active: 'border-go/60 text-go',
		on_hold: 'border-caution/60 text-caution',
		complete: 'border-hairline text-chalk/50'
	};
</script>

<span
	class={`rounded-full border px-3 py-1 font-display text-xs whitespace-nowrap ${statusStyles[status]}`}
>
	{projectStatusLabels[status]}
</span>
