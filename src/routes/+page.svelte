<script lang="ts">
	import BenefitsSection from '$lib/components/home/BenefitsSection.svelte';
	import HeroSection from '$lib/components/home/HeroSection.svelte';
	import KnowledgeKindsSection from '$lib/components/home/KnowledgeKindsSection.svelte';
	import OneConversationSection from '$lib/components/home/OneConversationSection.svelte';
	import ServicesSection from '$lib/components/home/ServicesSection.svelte';
</script>

<svelte:head>
	<title>Your Business Today — a second brain for your business</title>
	<meta
		name="description"
		content="YBT builds your business a second brain — the rules of your trade, the record of every job, and the way your work flows, all from one conversation. Query it, share it, and put it to work through Trade Talk and the Marketplace."
	/>
</svelte:head>

<HeroSection />
<KnowledgeKindsSection />
<OneConversationSection />
<BenefitsSection />
<ServicesSection />
