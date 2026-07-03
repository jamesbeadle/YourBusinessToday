<script lang="ts">
	let { balance }: { balance: number } = $props();
</script>

<a
	href="/account"
	class="flex items-center gap-2 rounded-full border border-hairline bg-carriage px-4 py-1.5
		font-display text-sm transition hover:border-go/60"
	title="Your credit balance"
>
	<span class="h-2 w-2 rounded-full bg-go"></span>
	{balance}
	{balance === 1 ? 'credit' : 'credits'}
</a>
