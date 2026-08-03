<script lang="ts">
	import { enhance } from '$app/forms';

	let { displayName }: { displayName: string } = $props();
</script>

<form
	method="POST"
	action="?/saveDisplayName"
	use:enhance
	class="flex flex-wrap items-end gap-3 rounded-2xl border border-hairline bg-carriage p-6"
>
	<label class="flex min-w-64 flex-1 flex-col gap-1">
		<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">Display name</span>
		<input
			name="displayName"
			value={displayName}
			maxlength="60"
			placeholder="How your name appears on tasks and comments"
			class="rounded-full border border-hairline bg-night px-4 py-2.5 text-chalk outline-none
				focus:border-go"
		/>
	</label>
	<button
		type="submit"
		class="rounded-full bg-go px-6 py-2.5 font-display text-sm font-medium text-night transition
			hover:brightness-110"
	>
		Save
	</button>
</form>
