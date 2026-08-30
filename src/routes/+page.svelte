<script lang="ts">
	import BenefitsSection from '$lib/components/home/BenefitsSection.svelte';
	import HeroSection from '$lib/components/home/HeroSection.svelte';
	import KnowledgeKindsSection from '$lib/components/home/KnowledgeKindsSection.svelte';
	import OneConversationSection from '$lib/components/home/OneConversationSection.svelte';
	import ServicesSection from '$lib/components/home/ServicesSection.svelte';
</script>

<svelte:head>
	<title>Your Business Today — consultants who know your business</title>
	<meta
		name="description"
		content="YBT is a business consultancy that learns how your business really runs and puts that knowledge to work. Along the way we build you a second brain — the rules of your trade, the record of every job, the way your work flows — and it stays yours."
	/>
</svelte:head>

<HeroSection />
<KnowledgeKindsSection />
<OneConversationSection />
<BenefitsSection />
<ServicesSection />
