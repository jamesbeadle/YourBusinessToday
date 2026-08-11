<script lang="ts">
	import StaffListSwitcher from './StaffListSwitcher.svelte';
	import type { StaffMember } from '$lib/server/projects/getStaffDirectory';

	let {
		staffMembers,
		viewedStaffMember,
		currentUserId,
		onNewProject
	}: {
		staffMembers: StaffMember[];
		viewedStaffMember: StaffMember;
		currentUserId: string;
		onNewProject: () => void;
	} = $props();

	const isOwnList = $derived(viewedStaffMember.id === currentUserId);
	const taskViewHref = $derived(isOwnList ? '/tasks' : `/tasks?user=${viewedStaffMember.id}`);
	const listDescription = $derived(
		isOwnList
			? 'Ordered by priority — the top row is the next thing to spend Claude on.'
			: `${viewedStaffMember.name}'s projects, ordered by priority.`
	);
</script>

<div class="flex flex-wrap items-end justify-between gap-4">
	<div class="flex flex-col gap-2">
		<h1 class="font-display text-3xl font-medium">Projects</h1>
		<p class="max-w-prose text-chalk/70">{listDescription}</p>
	</div>
	<div class="flex flex-wrap items-center gap-3">
		<StaffListSwitcher
			{staffMembers}
			viewedUserId={viewedStaffMember.id}
			{currentUserId}
			basePath="/projects"
		/>
		<a
			href={taskViewHref}
			class="rounded-full border border-hairline px-6 py-2.5 font-display text-sm text-chalk/80
				transition hover:border-go hover:text-go"
		>
			Task view
		</a>
		<button
			type="button"
			onclick={onNewProject}
			class="rounded-full bg-go px-6 py-2.5 font-display text-sm font-medium text-night
				transition hover:brightness-110"
		>
			New project
		</button>
	</div>
</div>
