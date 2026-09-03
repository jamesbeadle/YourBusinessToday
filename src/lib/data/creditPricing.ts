export const creditsPerReply = 10;
export const creditsPerBrainQuestion = 10;
export const creditsPerChatbotQuestion = creditsPerBrainQuestion;
export const creditsPerBrainPrune = 25;
export const creditsPerBrainUnlearn = 50;
export const creditsPerInterviewReply = 10;
export const creditsPerTradeTalkQuestion = 25;
export const hiveMindEarningsPool = 12;

const ingestBaseCredits = 50;
const ingestBaseBytes = 25_000;
const ingestCreditsPerExtraBlock = 10;
const tradeTalkIncludedPages = 5;
const tradeTalkCreditsPerExtraPage = 2;
const harvestCreditsPerItem = 2;

/**
 * Dynamic pricing: costs scale with the work a job actually causes — bytes
 * read, brains updated, pages consulted — so every job clears its own
 * Claude usage with margin. Rates live here, spending goes through
 * spend_credits_for with the computed amount.
 */
export function ingestCreditsFor(byteCount: number): number {
	const extraBytes = Math.max(0, byteCount - ingestBaseBytes);
	return ingestBaseCredits + ingestCreditsPerExtraBlock * Math.ceil(extraBytes / ingestBaseBytes);
}

export function harvestCreditsFor(itemCount: number): number {
	return harvestCreditsPerItem * itemCount;
}

export function tradeTalkDepthCreditsFor(pagesRead: number): number {
	const extraPages = Math.max(0, pagesRead - tradeTalkIncludedPages);
	return tradeTalkCreditsPerExtraPage * extraPages;
}

export function formatPenceAsPounds(pence: number): string {
	return `£${(pence / 100).toFixed(2)}`;
}
