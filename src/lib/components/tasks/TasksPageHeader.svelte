<script lang="ts">
	import StaffListSwitcher from '$lib/components/projects/StaffListSwitcher.svelte';
	import type { StaffMember } from '$lib/server/projects/getStaffDirectory';

	let {
		staffMembers,
		viewedStaffMember,
		currentUserId,
		shouldIncludeDone
	}: {
		staffMembers: StaffMember[];
		viewedStaffMember: StaffMember;
		currentUserId: string;
		shouldIncludeDone: boolean;
	} = $props();

	const isOwnList = $derived(viewedStaffMember.id === currentUserId);
	const projectViewHref = $derived(
		isOwnList ? '/projects' : `/projects?user=${viewedStaffMember.id}`
	);
	const listDescription = $derived(
		isOwnList
			? 'Every project’s tasks in one queue, ordered by global priority — the top row is the next thing to work on.'
			: `${viewedStaffMember.name}’s tasks in one queue, ordered by global priority.`
	);
</script>

<div class="flex flex-wrap items-end justify-between gap-4">
	<div class="flex flex-col gap-2">
		<h1 class="font-display text-3xl font-medium">Tasks</h1>
		<p class="max-w-prose text-chalk/70">{listDescription}</p>
	</div>
	<div class="flex flex-wrap items-center gap-3">
		<StaffListSwitcher
			{staffMembers}
			viewedUserId={viewedStaffMember.id}
			{currentUserId}
			basePath="/tasks"
			extraParameters={shouldIncludeDone ? { status: 'all' } : {}}
		/>
		<a
			href={projectViewHref}
			class="rounded-full border border-hairline px-6 py-2.5 font-display text-sm text-chalk/80
				transition hover:border-go hover:text-go"
		>
			Project view
		</a>
	</div>
</div>
