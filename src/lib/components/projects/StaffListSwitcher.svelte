<script lang="ts">
	import { goto } from '$app/navigation';
	import type { StaffMember } from '$lib/server/projects/getStaffDirectory';

	let {
		staffMembers,
		viewedUserId,
		currentUserId,
		basePath,
		extraParameters = {}
	}: {
		staffMembers: StaffMember[];
		viewedUserId: string;
		currentUserId: string;
		basePath: string;
		extraParameters?: Record<string, string>;
	} = $props();

	let isSwitching = $state(false);

	async function switchToList(userId: string): Promise<void> {
		isSwitching = true;
		try {
			await goto(listHref(userId));
		} finally {
			isSwitching = false;
		}
	}

	function listHref(userId: string): string {
		const parameters = new URLSearchParams(extraParameters);
		if (userId !== currentUserId) parameters.set('user', userId);
		const query = parameters.toString();
		if (query === '') return basePath;
		return `${basePath}?${query}`;
	}

	function memberLabel(member: StaffMember): string {
		if (member.id === currentUserId) return `${member.name} (you)`;
		return member.name;
	}
</script>

{#if staffMembers.length > 1}
	<label class="flex items-center gap-2">
		<span class="font-display text-sm tracking-widest text-chalk/50 uppercase">Viewing</span>
		<select
			value={viewedUserId}
			disabled={isSwitching}
			onchange={(event) => switchToList(event.currentTarget.value)}
			class="rounded-full border border-hairline bg-carriage px-4 py-1.5 font-display text-sm
				text-chalk outline-none focus:border-go disabled:opacity-60"
		>
			{#each staffMembers as member (member.id)}
				<option value={member.id}>{memberLabel(member)}</option>
			{/each}
		</select>
		{#if isSwitching}
			<span
				role="status"
				aria-label="Loading list"
				class="h-4 w-4 animate-spin rounded-full border-2 border-go/25 border-t-go"
			></span>
		{/if}
	</label>
{/if}
