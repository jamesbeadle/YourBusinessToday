<script lang="ts">
	let { goalTitle, onOpenPicker }: { goalTitle: string | null; onOpenPicker: () => void } =
		$props();

	const goalClasses = $derived(
		goalTitle === null
			? 'border-hairline text-chalk/40 hover:border-chalk/50 hover:text-chalk/70'
			: 'border-hairline text-chalk/70 hover:border-chalk/50'
	);
</script>

<button
	type="button"
	onclick={onOpenPicker}
	title="Change goal"
	class={`max-w-40 truncate rounded-full border px-2.5 py-0.5 font-display text-xs transition ${goalClasses}`}
>
	{goalTitle ?? 'No goal'}
</button>
