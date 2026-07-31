const WEAVE_WIDTH = 1.5;
const WEAVE_RATE_X = 0.11;
const RISE_HEIGHT = 0.9;
const RISE_RATE_Y = 0.07;

export function mazePathPoint(depth: number): { x: number; y: number } {
	return {
		x: Math.sin(depth * WEAVE_RATE_X) * WEAVE_WIDTH,
		y: Math.cos(depth * RISE_RATE_Y) * RISE_HEIGHT
	};
}
