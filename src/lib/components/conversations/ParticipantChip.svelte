<script lang="ts">
	import { enhance } from '$app/forms';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import type { ProjectPerson } from '$lib/server/members/projectPersonRecord';

	let { person }: { person: ProjectPerson } = $props();

	const tracker = new FormTracker();
</script>

<li
	class="flex items-center gap-2 rounded-full border border-hairline py-1 pr-2 pl-4 font-display
		text-sm text-chalk/80"
>
	{person.name}
	<form method="POST" action="?/removeParticipant" use:enhance={tracker.submit()}>
		<input type="hidden" name="accountId" value={person.id} />
		<button
			type="submit"
			disabled={tracker.isSaving}
			aria-label={`Take ${person.name} out of the conversation`}
			class="flex h-5 w-5 items-center justify-center rounded-full text-chalk/50 transition
				hover:bg-signal/20 hover:text-signal disabled:opacity-60"
		>
			×
		</button>
	</form>
</li>
