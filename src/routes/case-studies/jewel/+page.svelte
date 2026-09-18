<script lang="ts">
	import EnquirySection from '$lib/components/home/EnquirySection.svelte';
	import JewelCalendarSection from '$lib/components/case-study/JewelCalendarSection.svelte';
	import JewelIdeaSection from '$lib/components/case-study/JewelIdeaSection.svelte';
	import JewelIntroSection from '$lib/components/case-study/JewelIntroSection.svelte';
	import JewelOutcomeSection from '$lib/components/case-study/JewelOutcomeSection.svelte';
	import { companyDetails } from '$lib/data/companyDetails';

	const pageTitle = 'Jewel Bespoke Build — a case study — Your Business Today';
	const pageDescription =
		'How a family-run Surrey construction company moved from messages and photographs to a portal its own assistant can read: two weeks of discovery and proof, sixteen weeks of building, one idea.';
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={`${companyDetails.websiteUrl}/case-studies/jewel`} />
</svelte:head>

<JewelIntroSection />
<JewelIdeaSection />
<JewelCalendarSection />
<JewelOutcomeSection />
<EnquirySection />
