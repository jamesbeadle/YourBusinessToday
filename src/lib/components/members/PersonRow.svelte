<script lang="ts">
	import type { ProjectPerson } from '$lib/server/members/projectPersonRecord';

	let {
		person,
		canRemove,
		onRemove
	}: { person: ProjectPerson; canRemove: boolean; onRemove: (person: ProjectPerson) => void } =
		$props();
</script>

<li class="flex items-center gap-4">
	<span class="min-w-0 flex-1 truncate font-display text-sm">
		{person.name}
		{#if person.isOwner}
			<span class="ml-2 rounded-full bg-go/15 px-2 py-0.5 text-xs text-go">Owner</span>
		{/if}
	</span>
	<span class="hidden truncate text-xs text-chalk/50 sm:inline">{person.email}</span>
	{#if canRemove}
		<button
			type="button"
			onclick={() => onRemove(person)}
			aria-label={`Remove ${person.name}`}
			class="px-1 text-chalk/40 transition hover:text-signal"
		>
			✕
		</button>
	{/if}
</li>
