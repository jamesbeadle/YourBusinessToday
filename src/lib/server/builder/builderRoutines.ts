import { env } from '$env/dynamic/private';
import type { BuilderTier } from '$lib/data/builderTier';

export type BuilderRoutine = { fireUrl: string; token: string };

const environmentNames: Record<BuilderTier, { url: string; token: string }> = {
	easy: { url: 'BUILDER_EASY_ROUTINE_URL', token: 'BUILDER_EASY_ROUTINE_TOKEN' },
	medium: { url: 'BUILDER_MEDIUM_ROUTINE_URL', token: 'BUILDER_MEDIUM_ROUTINE_TOKEN' },
	hard: { url: 'BUILDER_HARD_ROUTINE_URL', token: 'BUILDER_HARD_ROUTINE_TOKEN' }
};

export function builderRoutineFor(tier: BuilderTier): BuilderRoutine | null {
	const names = environmentNames[tier];
	const fireUrl = env[names.url] ?? '';
	const token = env[names.token] ?? '';
	if (fireUrl === '' || token === '') return null;
	return { fireUrl, token };
}
