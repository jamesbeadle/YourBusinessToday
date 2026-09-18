<script lang="ts">
	import AboutStorySection from '$lib/components/about/AboutStorySection.svelte';
	import AboutTeamSection from '$lib/components/about/AboutTeamSection.svelte';
	import EnquirySection from '$lib/components/home/EnquirySection.svelte';
	import { companyDetails } from '$lib/data/companyDetails';

	const pageTitle = 'About — Your Business Today';
	const pageDescription =
		'Your Business Today is a consultancy that learns how a business really runs, maps and fixes the process, and builds and manages the software that takes the repeat work off its people.';
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={`${companyDetails.websiteUrl}/about`} />
</svelte:head>

<AboutStorySection />
<AboutTeamSection />
<EnquirySection />
