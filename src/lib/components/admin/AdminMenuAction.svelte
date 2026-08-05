<script lang="ts">
	import { enhance } from '$app/forms';

	let {
		action,
		fields,
		label,
		isDestructive = false,
		confirmMessage,
		onDone
	}: {
		action: string;
		fields: Record<string, string>;
		label: string;
		isDestructive?: boolean;
		confirmMessage?: string;
		onDone: () => void;
	} = $props();

	const toneClasses = isDestructive
		? 'text-signal/80 hover:bg-signal/10 hover:text-signal'
		: 'text-chalk/80 hover:bg-hairline/40 hover:text-chalk';
</script>

<form
	method="POST"
	{action}
	use:enhance={({ cancel }) => {
		const isConfirmed = confirmMessage === undefined || confirm(confirmMessage);
		if (!isConfirmed) cancel();
		onDone();
	}}
>
	{#each Object.entries(fields) as [name, value] (name)}
		<input type="hidden" {name} {value} />
	{/each}
	<button
		type="submit"
		class={`w-full rounded-xl px-3 py-2 text-left font-display text-sm transition ${toneClasses}`}
	>
		{label}
	</button>
</form>
