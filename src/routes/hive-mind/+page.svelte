<script lang="ts">
	import HiveAskPanel from '$lib/components/hive/HiveAskPanel.svelte';
	import HiveHeroSection from '$lib/components/hive/HiveHeroSection.svelte';
	import HiveJoinSection from '$lib/components/hive/HiveJoinSection.svelte';
	import HiveRecentQuestions from '$lib/components/hive/HiveRecentQuestions.svelte';
	import HiveRosterSection from '$lib/components/hive/HiveRosterSection.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>The Hive Mind — Your Business Today</title>
	<meta
		name="description"
		content="Ask one question and consult every approved specialist Domain Brain at once — direct answers on things only specialists know, with the specialists paid for articulating their domain."
	/>
</svelte:head>

<HiveHeroSection memberCount={data.members.length} />
<HiveAskPanel isSignedIn={data.isSignedIn} hasSpecialists={data.members.length > 0} />
{#if data.recentQuestions.length > 0}
	<HiveRecentQuestions questions={data.recentQuestions} />
{/if}
<HiveRosterSection members={data.members} />
<HiveJoinSection />
