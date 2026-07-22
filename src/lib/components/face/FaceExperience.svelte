<script lang="ts">
	import { onMount } from 'svelte';
	import { FaceExperience } from './createFaceExperience';
	import type { ExperienceMode } from './experienceTypes';
	import { attachPointerHandlers } from './experiencePointerHandlers';
	import FaceControlBar from './FaceControlBar.svelte';

	let containerElement: HTMLDivElement;
	let canvasElement: HTMLCanvasElement;
	let mode = $state<ExperienceMode>('face');
	let fadeOpacity = $state(1);
	let experience: FaceExperience | undefined;

	onMount(() => {
		experience = new FaceExperience(canvasElement, containerElement, {
			onModeChange: (nextMode) => (mode = nextMode),
			onFade: (opacity) => (fadeOpacity = opacity)
		});
		const detachPointerHandlers = attachPointerHandlers(canvasElement, experience);
		return () => {
			detachPointerHandlers();
			experience?.destroy();
		};
	});

	function keyPressed(event: KeyboardEvent) {
		if (event.key === 'Escape') experience?.returnToFace();
	}
</script>

<svelte:window onkeydown={keyPressed} />

<div bind:this={containerElement} class="relative h-full w-full overflow-hidden bg-night">
	<canvas bind:this={canvasElement} class="block h-full w-full cursor-pointer"></canvas>
	<div
		class="pointer-events-none absolute inset-0 bg-night"
		style="opacity: {fadeOpacity}"
	></div>
	{#if mode === 'face'}
		<p class="absolute top-5 left-6 font-display text-xs tracking-widest text-chalk/50 uppercase">
			Tesseract · interactive code face — click the face to dive in
		</p>
		<div class="absolute inset-x-0 bottom-6 flex justify-center px-6">
			<FaceControlBar
				onExpression={(name) => experience?.setExpression(name)}
				onSpeak={(sentence) => experience?.speak(sentence)}
				onDive={() => experience?.dive()}
			/>
		</div>
	{/if}
	{#if mode === 'inside'}
		<div class="absolute inset-x-0 top-5 flex flex-col items-center gap-2 px-6 text-center">
			<p class="font-display text-xs tracking-widest text-go/80 uppercase">
				Inside the Tesseract — steer with your cursor, click a portal to visit a channel
			</p>
			<button
				onclick={() => experience?.returnToFace()}
				class="rounded-full border border-hairline bg-carriage/80 px-5 py-1.5 font-display
					text-xs text-chalk/80 backdrop-blur transition hover:border-chalk/40 hover:text-chalk"
			>
				Return to the surface · Esc
			</button>
		</div>
	{/if}
</div>
