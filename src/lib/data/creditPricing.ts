export const welcomeCreditCount = 3;
export const repliesPerCredit = 10;

export function formatPenceAsPounds(pence: number): string {
	return `£${(pence / 100).toFixed(2)}`;
}
