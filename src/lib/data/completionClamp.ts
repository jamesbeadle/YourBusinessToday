export function parseCompletionPercent(value: unknown): number {
	const percent = Math.round(Number(value));
	if (Number.isNaN(percent)) return 0;
	return Math.min(100, Math.max(0, percent));
}
