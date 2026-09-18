<script lang="ts">
	import CaseStudySection from '$lib/components/home/CaseStudySection.svelte';
	import EnquirySection from '$lib/components/home/EnquirySection.svelte';
	import HeroSection from '$lib/components/home/HeroSection.svelte';
	import HowTheWorkRunsSection from '$lib/components/home/HowTheWorkRunsSection.svelte';
	import TeamSection from '$lib/components/home/TeamSection.svelte';
	import WhatWeDoSection from '$lib/components/home/WhatWeDoSection.svelte';
	import { companyDetails } from '$lib/data/companyDetails';

	const pageTitle = 'Your Business Today — consultants who know your business';
	const pageDescription =
		'A consultancy that learns how your business really runs, then maps the process, builds the software and automates the work that repeats — and manages what it builds. Every client gets a portal and a connection to Claude.';
	const shareImageUrl = `${companyDetails.websiteUrl}/favicon.svg`;
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={companyDetails.websiteUrl} />
	<meta property="og:image" content={shareImageUrl} />
</svelte:head>

<HeroSection />
<WhatWeDoSection />
<HowTheWorkRunsSection />
<CaseStudySection />
<TeamSection />
<EnquirySection />
