<script lang="ts">
	import FaceExperience from '$lib/components/face/FaceExperience.svelte';
</script>

<svelte:head>
	<title>Tesseract — the YBT code face</title>
	<meta
		name="description"
		content="Meet the Tesseract: an interactive 3D code face you can talk to, built from thousands of cubes."
	/>
</svelte:head>

<section class="h-[calc(100vh-3.5rem)] min-h-[560px]">
	<FaceExperience />
</section>
