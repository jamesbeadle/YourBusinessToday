<script lang="ts">
	import { expressionNames, type ExpressionName } from './expressionLibrary';

	let {
		onExpression,
		onSpeak,
		onDive
	}: {
		onExpression: (name: ExpressionName) => void;
		onSpeak: (sentence: string) => void;
		onDive: () => void;
	} = $props();

	let sentence = $state('Hello. I am the Tesseract. Dive inside my mind.');

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
				class="rounded-full border border-hairline bg-carriage/80 px-4 py-1.5 font-display
					text-xs text-chalk/80 capitalize backdrop-blur transition hover:border-chalk/40
					hover:text-chalk"
			>
				{expressionName}
			</button>
		{/each}
	</div>
	<form onsubmit={submitSpeech} class="flex w-full max-w-md items-center gap-2">
		<input
			bind:value={sentence}
			aria-label="Sentence for the face to speak"
			class="w-full rounded-full border border-hairline bg-carriage/80 px-4 py-2 text-sm
				text-chalk backdrop-blur outline-none placeholder:text-chalk/40 focus:border-chalk/40"
		/>
		<button
			type="submit"
			class="rounded-full border border-go/60 px-5 py-2 font-display text-sm text-go
				transition hover:bg-go/10"
		>
			Speak
		</button>
	</form>
	<button
		onclick={onDive}
		class="rounded-full bg-signal px-7 py-2.5 font-display text-sm font-medium text-night
			transition hover:brightness-110"
	>
		Dive inside ↓
	</button>
</div>
