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
		content="One living profile of your business — the Workflow Map captures what your business does, the Second Brain captures what it knows, the Workforce runs what you hand over, and the Prospector finds who you serve next."
	/>
</svelte:head>

<HeroSection />
<EcosystemSection />
<SharedProfileSection />
<WorkflowSpotlightSection />
<CreditsSection />
