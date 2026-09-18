<script lang="ts">
	import EnquirySection from '$lib/components/home/EnquirySection.svelte';
	import OfferIntroSection from '$lib/components/offer/OfferIntroSection.svelte';
	import OfferStepsSection from '$lib/components/offer/OfferStepsSection.svelte';
	import OfferTermsSection from '$lib/components/offer/OfferTermsSection.svelte';
	import { companyDetails } from '$lib/data/companyDetails';

	const pageTitle = 'The offer — Your Business Today';
	const pageDescription =
		'How an engagement with Your Business Today works: two weeks of discovery, builds one stage at a time, hand over into your ownership, and a monthly fee to keep it running.';
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={`${companyDetails.websiteUrl}/offer`} />
</svelte:head>

<OfferIntroSection />
<OfferStepsSection />
<OfferTermsSection />
<EnquirySection />
