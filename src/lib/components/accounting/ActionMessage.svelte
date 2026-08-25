<script lang="ts">
	let { message }: { message: string | undefined } = $props();
</script>

{#if message}
	<p class="rounded-2xl border border-go/50 bg-go/10 px-5 py-4 text-go print:hidden">{message}</p>
{/if}
