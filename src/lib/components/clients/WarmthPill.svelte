<script lang="ts">
	import { warmthLabels, type Warmth } from '$lib/data/contactProfileFields';

	let { warmth }: { warmth: Warmth } = $props();

	const toneClasses: Record<Warmth, string> = {
		cold: 'border-hairline text-chalk/50',
		warm: 'border-caution/50 text-caution',
		hot: 'border-signal/50 text-signal'
	};
</script>

<span class={`rounded-full border px-3 py-0.5 text-xs whitespace-nowrap ${toneClasses[warmth]}`}>
	{warmthLabels[warmth]}
</span>
