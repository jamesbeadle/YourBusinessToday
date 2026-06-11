<script lang="ts">
	import CreditsSection from '$lib/components/home/CreditsSection.svelte';
	import HeroSection from '$lib/components/home/HeroSection.svelte';
	import HowItWorksSection from '$lib/components/home/HowItWorksSection.svelte';
</script>

<svelte:head>
	<title>Your Business Today — every role, every workflow, one map</title>
	<meta
		name="description"
		content="Talk to an AI agent about your business and get back an Underground-style map of every role, workflow and handover."
	/>
</svelte:head>

<HeroSection />
<HowItWorksSection />
<CreditsSection />
