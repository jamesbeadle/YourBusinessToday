<script lang="ts">
	import { onMount } from 'svelte';
	import { FaceExperience } from './createFaceExperience';
	import { attachPointerHandlers } from './experiencePointerHandlers';
	import FaceControlBar from './FaceControlBar.svelte';

	let containerElement: HTMLDivElement;
	let canvasElement: HTMLCanvasElement;
	let experience: FaceExperience | undefined;

	onMount(() => {
		experience = new FaceExperience(canvasElement, containerElement);
		const detachPointerHandlers = attachPointerHandlers(canvasElement, experience);
		return () => {
			detachPointerHandlers();
			experience?.destroy();
		};
	});
</script>

<div bind:this={containerElement} class="bg-daylight relative h-full w-full overflow-hidden">
	<canvas bind:this={canvasElement} class="block h-full w-full"></canvas>
	<p class="text-slate/55 absolute top-5 left-6 font-display text-xs tracking-widest uppercase">
		Tesseract · interactive code face
	</p>
	<div class="absolute inset-x-0 bottom-6 flex justify-center px-6">
		<FaceControlBar
			onExpression={(name) => experience?.setExpression(name)}
			onSpeak={(sentence) => experience?.speak(sentence)}
		/>
	</div>
</div>
