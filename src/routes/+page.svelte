<script lang="ts">
	import BenefitsSection from '$lib/components/home/BenefitsSection.svelte';
	import CaseStudySection from '$lib/components/home/CaseStudySection.svelte';
	import ConsultancySection from '$lib/components/home/ConsultancySection.svelte';
	import HeroSection from '$lib/components/home/HeroSection.svelte';
	import ServicesSection from '$lib/components/home/ServicesSection.svelte';
	import { companyDetails } from '$lib/data/companyDetails';

	const pageTitle = 'Your Business Today — consultants who know your business';
	const pageDescription =
		'Your Business Today is a consultancy that automates a business. We learn how yours really runs, automate the work that repeats, and hand you tools built for the way you already work.';
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
<ConsultancySection />
<CaseStudySection />
<ServicesSection />
<BenefitsSection />
