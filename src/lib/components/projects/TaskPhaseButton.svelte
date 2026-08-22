<script lang="ts">
	let { phaseName, onOpenPicker }: { phaseName: string | null; onOpenPicker: () => void } =
		$props();

	const phaseClasses = $derived(
		phaseName === null
			? 'border-hairline text-chalk/40 hover:border-chalk/50 hover:text-chalk/70'
			: 'border-hairline text-chalk/70 hover:border-chalk/50'
	);
</script>

<button
	type="button"
	onclick={onOpenPicker}
	title="Change phase"
	class={`max-w-36 truncate rounded-full border px-3 py-1.5 font-display text-xs transition ${phaseClasses}`}
>
	{phaseName ?? 'No phase'}
</button>
