import type { BuilderRoutine } from './builderRoutines';

const routineBetaHeader = 'experimental-cc-routine-2026-04-01';
const anthropicVersion = '2023-06-01';

export type FiredRoutine = { sessionUrl: string };

export async function fireBuilderRoutine(
	routine: BuilderRoutine,
	taskId: string
): Promise<FiredRoutine> {
	const response = await fetch(routine.fireUrl, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			authorization: `Bearer ${routine.token}`,
			'anthropic-beta': routineBetaHeader,
			'anthropic-version': anthropicVersion
		},
		body: JSON.stringify({ text: `Build task ${taskId}` })
	});
	if (!response.ok) {
		throw new Error(`The routine refused the fire with status ${response.status}.`);
	}
	const fired = (await response.json()) as { claude_code_session_url?: string };
	return { sessionUrl: fired.claude_code_session_url ?? '' };
}
