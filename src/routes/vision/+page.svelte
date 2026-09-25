<script lang="ts">
	import VisionArticle from '$lib/components/vision/VisionArticle.svelte';
	import { companyDetails } from '$lib/data/companyDetails';

	const pageTitle = 'What we build — Your Business Today';
	const pageDescription =
		'Generic AI has never met your business. We put your data into a harness it can read, teach it the processes around that harness, and let it act through an MCP server on the same permissions as your screens.';
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={`${companyDetails.websiteUrl}/vision`} />
</svelte:head>

<VisionArticle />
