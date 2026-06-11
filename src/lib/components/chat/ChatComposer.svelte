<script lang="ts">
	let { onSend, isDisabled }: { onSend: (text: string) => void; isDisabled: boolean } = $props();

	let draft = $state('');

	function sendDraft(event: SubmitEvent) {
		event.preventDefault();
		const text = draft.trim();
		if (text === '') return;
		onSend(text);
		draft = '';
	}
</script>

<form onsubmit={sendDraft} class="flex gap-3">
	<input
		bind:value={draft}
		placeholder="Tell the agent about your business…"
		aria-label="Your message to the agent"
		class="flex-1 rounded-full border border-map-ink/20 bg-map-paper px-5 py-3 outline-none
			focus:border-tfl-blue"
	/>
	<button
		type="submit"
		disabled={isDisabled}
		class="rounded-full bg-tfl-blue px-6 py-3 font-display text-sm tracking-wide text-white
			transition hover:bg-tfl-red disabled:opacity-40"
	>
		Send
	</button>
</form>
