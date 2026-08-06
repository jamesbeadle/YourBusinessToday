<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	let { onCreated }: { onCreated: () => void } = $props();

	const closeWhenCreated: SubmitFunction = () => {
		return async ({ update, result }) => {
			await update();
			if (result.type === 'success') onCreated();
		};
	};
</script>

<form method="POST" action="?/createPhase" use:enhance={closeWhenCreated} class="flex flex-col gap-4">
	<label class="flex flex-col gap-1">
		<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">Phase name</span>
		<input
			name="name"
			required
			placeholder="e.g. Discovery, Build, Launch"
			class="rounded-xl border border-hairline bg-night px-4 py-2.5 text-chalk outline-none
				focus:border-go"
		/>
	</label>
	<button
		type="submit"
		class="self-end rounded-full bg-go px-6 py-2.5 font-display text-sm font-medium text-night
			transition hover:brightness-110"
	>
		Add phase
	</button>
</form>
