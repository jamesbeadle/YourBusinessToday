import { error } from '@sveltejs/kit';
import { experienceBrainActions } from './experienceBrainActions';
import { findOpenBrain } from '$lib/data/knowledge/findOpenBrain';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
	const { brains, processMaps } = await parent();
	const openBrain = findOpenBrain(params.brainId, brains, processMaps);
	if (openBrain === null) error(404, 'That brain is not in this knowledge base');
	return { openBrain };
};

export const actions = experienceBrainActions;
