<script lang="ts">
	import RemoveMemberButton from './RemoveMemberButton.svelte';
	import type { ChatbotMember } from '$lib/data/chatbotTypes';

	let { member }: { member: ChatbotMember } = $props();
</script>

<div class="flex flex-col gap-2 rounded-xl border border-hairline bg-night p-3 text-sm">
	<div class="flex items-center justify-between gap-2">
		<span class="truncate">{member.invitedEmail}</span>
		<span class="shrink-0 text-xs text-chalk/60">{member.hasJoined ? 'Joined' : 'Invited'}</span>
	</div>
	<div class="flex items-center justify-between gap-2 font-mono text-xs text-chalk/70">
		<span>{member.spentCredits} of {member.allowanceCredits} credits spent</span>
		<RemoveMemberButton memberId={member.id} />
	</div>
</div>
