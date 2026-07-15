<script lang="ts">
	import CreditsSection from '$lib/components/home/CreditsSection.svelte';
	import EcosystemSection from '$lib/components/home/EcosystemSection.svelte';
	import HeroSection from '$lib/components/home/HeroSection.svelte';
	import SharedProfileSection from '$lib/components/home/SharedProfileSection.svelte';
	import WorkflowSpotlightSection from '$lib/components/home/WorkflowSpotlightSection.svelte';
</script>

<svelte:head>
	<title>Your Business Today — AI tools that know your business</title>
	<meta
		name="description"
		content="One living profile of your business, and the route to running it on AI — map how you work today, plan the handover with the Autopilot, put the Workforce on shift, and let the Prospector fill your pipeline."
	/>
</svelte:head>

<HeroSection />
<EcosystemSection />
<SharedProfileSection />
<WorkflowSpotlightSection />
<CreditsSection />
