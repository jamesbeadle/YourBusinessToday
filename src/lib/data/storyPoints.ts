export const fibonacciStoryPoints = [1, 2, 3, 5, 8, 13, 21] as const;

export const defaultStoryPoints = 2;

export function parseStoryPoints(value: unknown): number {
	const points = Number(value);
	if (fibonacciStoryPoints.includes(points as (typeof fibonacciStoryPoints)[number])) {
		return points;
	}
	return defaultStoryPoints;
}
