<script lang="ts">
	import { enhance } from '$app/forms';

	const fieldClasses =
		'rounded-full border border-hairline bg-night px-4 py-2.5 text-chalk outline-none focus:border-go';
</script>

<form
	method="POST"
	action="?/createSprint"
	use:enhance
	class="flex flex-wrap items-end gap-3 rounded-2xl border border-hairline bg-carriage p-6"
>
	<label class="flex min-w-48 flex-1 flex-col gap-1">
		<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">New sprint</span>
		<input name="name" required placeholder="Sprint name" class={fieldClasses} />
	</label>
	<label class="flex flex-col gap-1">
		<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">Starts</span>
		<input name="startsOn" type="date" class={fieldClasses} />
	</label>
	<label class="flex flex-col gap-1">
		<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">Ends</span>
		<input name="endsOn" type="date" class={fieldClasses} />
	</label>
	<button
		type="submit"
		class="rounded-full bg-go px-6 py-2.5 font-display text-sm font-medium text-night transition
			hover:brightness-110"
	>
		Create
	</button>
</form>
