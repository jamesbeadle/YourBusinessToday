<script lang="ts">
	import { buildStatusLabels, type BuildStatus } from '$lib/data/buildStatus';

	let { status }: { status: BuildStatus } = $props();

	const toneClasses: Record<BuildStatus, string> = {
		not_sent: 'border-hairline text-chalk/50',
		queued: 'border-caution/50 text-caution',
		building: 'border-caution/50 text-caution',
		in_review: 'border-signal/50 text-signal',
		live: 'border-go/50 text-go',
		failed: 'border-signal/50 text-signal'
	};
</script>

<span class={`rounded-full border px-3 py-0.5 text-xs whitespace-nowrap ${toneClasses[status]}`}>
	{buildStatusLabels[status]}
</span>
