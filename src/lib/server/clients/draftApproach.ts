import type { SupabaseClient } from '@supabase/supabase-js';
import { approachSystemPrompt, approachTool } from './approachPrompt';
import { describeCompanyForApproach, describePersonForApproach } from './approachContext';
import { recordClientEvent } from './recordClientEvent';
import { requestAnthropic } from '$lib/server/anthropic/requestAnthropic';
import { toolUseFrom } from '$lib/server/anthropic/anthropicTypes';
import type { Client } from './clientRecord';
import type { Person } from './getPeopleForClient';

export type ApproachDraft = {
	contactId: string;
	contactName: string;
	openingMessage: string;
	callPlan: string;
};

const longestDraftTokens = 1500;

export async function draftApproach(
	supabase: SupabaseClient,
	client: Client,
	person: Person,
	actorAccountId: string
): Promise<ApproachDraft> {
	const response = await requestAnthropic({
		system: approachSystemPrompt,
		messages: [{ role: 'user', content: briefFor(client, person) }],
		tools: [approachTool],
		forcedToolName: approachTool.name,
		maxTokens: longestDraftTokens
	});
	const draft = toolUseFrom(response, approachTool.name) as Record<string, unknown> | undefined;
	if (draft === undefined) throw new Error('Claude did not return an approach');
	await recordClientEvent(supabase, client.id, 'approach_drafted', { person: person.name }, actorAccountId);
	return {
		contactId: person.id,
		contactName: person.name,
		openingMessage: String(draft.opening_message ?? '').trim(),
		callPlan: String(draft.call_plan ?? '').trim()
	};
}

function briefFor(client: Client, person: Person): string {
	return [
		'Draft the first approach to this person.',
		'',
		describeCompanyForApproach(client),
		'',
		describePersonForApproach(person)
	].join('\n');
}

export function composeApproachNote(openingMessage: string, callPlan: string): string {
	return `Opening message\n${openingMessage}\n\nCall plan\n${callPlan}`;
}
