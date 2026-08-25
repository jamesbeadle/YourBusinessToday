<script lang="ts">
	import BrandMark from '$lib/components/site/BrandMark.svelte';
	import BrandWordmark from '$lib/components/site/BrandWordmark.svelte';

	let { companyName }: { companyName: string } = $props();
</script>

<div
	class="-mx-12 -mt-12 mb-2 flex items-center justify-between gap-6 rounded-t-2xl bg-night px-12 py-6
		print:mx-0 print:mt-0 print:rounded-none"
	style="print-color-adjust: exact; -webkit-print-color-adjust: exact;"
>
	<div class="flex items-center gap-4">
		<BrandMark size={44} />
		<BrandWordmark fontSize={30} />
	</div>
	<p class="font-display text-sm tracking-widest text-chalk/70 uppercase">{companyName}</p>
</div>
