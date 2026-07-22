import type { FaceExperience } from './createFaceExperience';

function toNormalisedPointer(canvas: HTMLCanvasElement, event: MouseEvent): { x: number; y: number } {
	const bounds = canvas.getBoundingClientRect();
	return {
		x: ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
		y: -(((event.clientY - bounds.top) / bounds.height) * 2 - 1)
	};
}

export function attachPointerHandlers(
	canvas: HTMLCanvasElement,
	experience: FaceExperience
): () => void {
	function pointerMoved(event: PointerEvent): void {
		const pointer = toNormalisedPointer(canvas, event);
		experience.handlePointer(pointer.x, pointer.y);
	}
	function clicked(event: MouseEvent): void {
		const pointer = toNormalisedPointer(canvas, event);
		experience.handlePointer(pointer.x, pointer.y);
		const channelUrl = experience.handleClick();
		if (channelUrl) window.open(channelUrl, '_blank', 'noopener');
	}
	canvas.addEventListener('pointermove', pointerMoved);
	canvas.addEventListener('click', clicked);
	return () => {
		canvas.removeEventListener('pointermove', pointerMoved);
		canvas.removeEventListener('click', clicked);
	};
}
