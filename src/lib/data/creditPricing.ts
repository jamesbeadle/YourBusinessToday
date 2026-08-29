export const creditsPerReply = 10;
export const creditsPerBrainIngest = 50;
export const creditsPerBrainUnlearn = 50;
export const creditsPerBrainQuestion = 10;
export const creditsPerBrainPrune = 25;
export const creditsPerHiveMindQuestion = 25;
export const hiveMindEarningsPool = 12;

export function formatPenceAsPounds(pence: number): string {
	return `£${(pence / 100).toFixed(2)}`;
}
