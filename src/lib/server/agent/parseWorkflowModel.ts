import type { WorkflowModel, WorkflowRole, WorkflowTask } from '$lib/data/workflowModel';

const maxRoles = 12;
const maxTasksPerRole = 16;
const maxTextLength = 300;
const maxListItems = 8;

export function parseWorkflowModel(candidate: unknown): WorkflowModel | null {
	if (!isRecord(candidate) || !Array.isArray(candidate.roles)) return null;
	const roles = candidate.roles.slice(0, maxRoles).flatMap(parseRole);
	return { businessName: asText(candidate.businessName), roles };
}

function parseRole(candidate: unknown): WorkflowRole[] {
	if (!isRecord(candidate) || !Array.isArray(candidate.tasks)) return [];
	const name = asText(candidate.name);
	if (name === '') return [];
	return [{ name, tasks: candidate.tasks.slice(0, maxTasksPerRole).flatMap(parseTask) }];
}

function parseTask(candidate: unknown): WorkflowTask[] {
	if (!isRecord(candidate)) return [];
	const name = asText(candidate.name);
	if (name === '') return [];
	const businessOutput = asText(candidate.businessOutput);
	return [
		{
			name,
			summary: asText(candidate.summary),
			inputs: asTextList(candidate.inputs),
			outputs: asTextList(candidate.outputs),
			handoverRoles: asTextList(candidate.handoverRoles),
			...(businessOutput === '' ? {} : { businessOutput })
		}
	];
}

function asText(candidate: unknown): string {
	if (typeof candidate !== 'string') return '';
	return candidate.trim().slice(0, maxTextLength);
}

function asTextList(candidate: unknown): string[] {
	if (!Array.isArray(candidate)) return [];
	return candidate.map(asText).filter((item) => item !== '').slice(0, maxListItems);
}

function isRecord(candidate: unknown): candidate is Record<string, unknown> {
	return typeof candidate === 'object' && candidate !== null;
}
