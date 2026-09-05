const LONGEST_FRAME_SECONDS = 0.05;

type Frame = (deltaSeconds: number, timeSeconds: number) => void;

export function startAnimationLoop(frame: Frame): () => void {
	let previousTimestamp = 0;
	let handle = 0;
	function tick(timestamp: number): void {
		const elapsed = (timestamp - previousTimestamp) / 1000 || 0;
		previousTimestamp = timestamp;
		frame(Math.min(LONGEST_FRAME_SECONDS, elapsed), timestamp / 1000);
		handle = requestAnimationFrame(tick);
	}
	handle = requestAnimationFrame(tick);
	return () => cancelAnimationFrame(handle);
}

export type SceneLoop = {
	pause: () => void;
	resume: () => void;
	isRunning: () => boolean;
};

/** A frame loop that can rest and run again; pausing is how a scene is stopped for good. */
export function createSceneLoop(frame: Frame): SceneLoop {
	let stop: (() => void) | null = startAnimationLoop(frame);

	function pause(): void {
		stop?.();
		stop = null;
	}

	function resume(): void {
		if (stop !== null) return;
		stop = startAnimationLoop(frame);
	}

	return { pause, resume, isRunning: () => stop !== null };
}
