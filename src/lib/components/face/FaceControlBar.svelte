<script lang="ts">
	import { expressionNames, type ExpressionName } from './expressionLibrary';

	let {
		onExpression,
		onSpeak
	}: {
		onExpression: (name: ExpressionName) => void;
		onSpeak: (sentence: string) => void;
	} = $props();

	let sentence = $state('Hello. I am the Tesseract.');

	function submitSpeech(event: SubmitEvent) {
		event.preventDefault();
		if (sentence.trim().length > 0) onSpeak(sentence);
	}
</script>

<div class="pointer-events-auto flex flex-col items-center gap-3">
	<div class="flex flex-wrap justify-center gap-2">
		{#each expressionNames as expressionName}
			<button
				onclick={() => onExpression(expressionName)}
				class="border-etch bg-platform/75 text-slate hover:border-slate/45 rounded-full border px-4
					py-1.5 font-display text-xs capitalize backdrop-blur transition hover:bg-platform"
			>
				{expressionName}
			</button>
		{/each}
	</div>
	<form onsubmit={submitSpeech} class="flex w-full max-w-md items-center gap-2">
		<input
			bind:value={sentence}
			aria-label="Sentence for the face to speak"
			class="border-etch bg-platform/75 text-slate placeholder:text-slate/45 focus:border-slate/45
				w-full rounded-full border px-4 py-2 text-sm backdrop-blur outline-none"
		/>
		<button
			type="submit"
			class="border-slate/40 text-slate hover:bg-slate/10 rounded-full border px-5 py-2
				font-display text-sm transition"
		>
			Speak
		</button>
	</form>
</div>
