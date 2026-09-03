<script lang="ts">
	import RemoveMemberButton from './RemoveMemberButton.svelte';
	import type { ChatbotMember } from '$lib/data/chatbotTypes';

	let { member }: { member: ChatbotMember } = $props();
</script>

<tr>
	<td class="py-2 pr-3">{member.invitedEmail}</td>
	<td class="py-2 pr-3 text-chalk/60">{member.hasJoined ? 'Joined' : 'Invited'}</td>
	<td class="py-2 pr-3 text-right font-mono">{member.allowanceCredits}</td>
	<td class="py-2 pr-3 text-right font-mono">{member.spentCredits}</td>
	<td class="py-2 text-right"><RemoveMemberButton memberId={member.id} /></td>
</tr>
