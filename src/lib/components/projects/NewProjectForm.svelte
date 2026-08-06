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

	const fieldClasses =
		'rounded-xl border border-hairline bg-night px-4 py-2.5 text-chalk outline-none focus:border-go';
</script>

<form method="POST" action="?/createProject" use:enhance={closeWhenCreated} class="flex flex-col gap-4">
	<label class="flex flex-col gap-1">
		<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">Name</span>
		<input name="name" required placeholder="Project name" class={fieldClasses} />
	</label>
	<label class="flex flex-col gap-1">
		<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">Description</span>
		<textarea
			name="description"
			rows="3"
			placeholder="What this project is for (optional)"
			class={fieldClasses}
		></textarea>
	</label>
	<button
		type="submit"
		class="self-end rounded-full bg-go px-6 py-2.5 font-display text-sm font-medium text-night
			transition hover:brightness-110"
	>
		Create project
	</button>
</form>
