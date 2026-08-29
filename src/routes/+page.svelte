<script lang="ts">
	import CreditsSection from '$lib/components/home/CreditsSection.svelte';
	import DemosSection from '$lib/components/home/DemosSection.svelte';
	import HeroSection from '$lib/components/home/HeroSection.svelte';
	import KnowledgeKindsSection from '$lib/components/home/KnowledgeKindsSection.svelte';
	import ServicesSection from '$lib/components/home/ServicesSection.svelte';
	import SharedProfileSection from '$lib/components/home/SharedProfileSection.svelte';
	import WorkflowSpotlightSection from '$lib/components/home/WorkflowSpotlightSection.svelte';
</script>

<svelte:head>
	<title>Your Business Today — a brain for your business</title>
	<meta
		name="description"
		content="YBT builds your business a brain — your expertise, experience, and process in one living profile. The Hive Mind shares what you know, the Workforce runs what you hand over, and the Prospector finds who you serve next."
	/>
</svelte:head>

<HeroSection />
<KnowledgeKindsSection />
<DemosSection />
<WorkflowSpotlightSection />
<SharedProfileSection />
<ServicesSection />
<CreditsSection />
