<script lang="ts">
	import type { TeamMember } from '$lib/data/teamMembers';

	let { member }: { member: TeamMember } = $props();
</script>

<div class="flex flex-col gap-2 border-t border-hairline pt-6">
	<span class="font-display text-4xl font-medium text-chalk/25">{member.initials}</span>
	<h3 class="mt-2 font-display text-xl font-medium">{member.name}</h3>
	<p class="font-display text-sm text-signal">{member.role}</p>
	<p class="text-sm text-chalk/70">{member.biography}</p>
</div>
