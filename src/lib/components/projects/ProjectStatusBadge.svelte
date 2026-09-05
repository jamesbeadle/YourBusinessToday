<script lang="ts">
	import { projectStatusLabels, type ProjectStatus } from '$lib/data/projectStatus';

	let { status }: { status: ProjectStatus } = $props();

	const statusStyles: Record<ProjectStatus, string> = {
		scoping: 'border-etch/50 text-etch',
		building: 'border-go/60 text-go',
		testing: 'border-caution/60 text-caution',
		maintenance: 'border-daylight/50 text-daylight',
		complete: 'border-hairline text-chalk/50',
		on_hold: 'border-signal/60 text-signal'
	};
</script>

<span
	class={`rounded-full border px-3 py-1 font-display text-xs whitespace-nowrap ${statusStyles[status]}`}
>
	{projectStatusLabels[status]}
</span>
