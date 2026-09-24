<script lang="ts">
	import LegalArticle from '$lib/components/site/LegalArticle.svelte';
	import { companyInformation } from '$lib/data/companyInformation';
</script>

<svelte:head>
	<title>{companyInformation.title} — Your Business Today</title>
	<meta name="description" content={companyInformation.metaDescription} />
</svelte:head>

<LegalArticle legalDocument={companyInformation} />
