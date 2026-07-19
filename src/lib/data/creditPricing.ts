export const welcomeCreditCount = 300;
export const creditsPerReply = 10;
export const creditsPerBrainIngest = 50;
export const creditsPerBrainQuestion = 10;

export function formatPenceAsPounds(pence: number): string {
	return `£${(pence / 100).toFixed(2)}`;
}
