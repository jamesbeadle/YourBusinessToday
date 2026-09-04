<script lang="ts">
	import { featureRequestStatusLabels, type FeatureRequestStatus } from '$lib/data/featureRequests';

	let {
		status,
		isDelivered = false
	}: { status: FeatureRequestStatus; isDelivered?: boolean } = $props();

	const toneClasses: Record<FeatureRequestStatus, string> = {
		new: 'border-signal/50 text-signal',
		accepted: 'border-go/50 text-go',
		declined: 'border-hairline text-chalk/50'
	};

	const label = $derived(isDelivered ? 'Delivered' : featureRequestStatusLabels[status]);
	const tone = $derived(isDelivered ? 'border-go/50 text-go' : toneClasses[status]);
</script>

<span class={`rounded-full border px-3 py-0.5 text-xs whitespace-nowrap ${tone}`}>{label}</span>
