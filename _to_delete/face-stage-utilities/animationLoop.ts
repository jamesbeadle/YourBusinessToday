const LONGEST_FRAME_SECONDS = 0.05;

export function startAnimationLoop(
	frame: (deltaSeconds: number, timeSeconds: number) => void
): () => void {
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
