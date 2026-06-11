import type { ChatMessage } from './chatTypes';
import { agentReplyForTurn, openingQuestion } from './scriptedAgent';

export const projectSeedMessages: ChatMessage[] = [
	{ id: 0, author: 'agent', text: openingQuestion },
	{
		id: 1,
		author: 'user',
		text: "We're Jewel Bespoke Build — super-prime residential construction in Surrey. Everything from tender through to aftercare."
	},
	{ id: 2, author: 'agent', text: agentReplyForTurn(1) },
	{
		id: 3,
		author: 'user',
		text: 'A QS pricing tenders and running valuations, project managers on drawings and variations, site managers on delivery, an H&S officer, a compliance coordinator in the office, and our FD watching cashflow.'
	},
	{
		id: 4,
		author: 'agent',
		text: "That's six lines on your map already — I've drawn them behind this chat. Select any station on the map and we'll go deeper on that task, or just keep talking."
	}
];

export const seedUserTurnCount = 2;

const contextualQuestionTemplates = [
	(stationName: string) => `${stationName} — let's go deeper. What has to be true before it can start?`,
	(stationName: string) => `Who owns ${stationName} day to day, and who relies on its outputs?`,
	(stationName: string) =>
		`When ${stationName} goes wrong, what does that usually look like — and how often?`,
	(stationName: string) =>
		`If ${stationName} ran itself tomorrow, what would the rest of the line notice first?`
];

export function projectAgentReply(userTurnCount: number, stationName: string | null): string {
	if (stationName === null) return agentReplyForTurn(userTurnCount);
	const templateIndex = (userTurnCount - 1) % contextualQuestionTemplates.length;
	return contextualQuestionTemplates[templateIndex](stationName);
}
