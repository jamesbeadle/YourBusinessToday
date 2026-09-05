export type BuilderTier = 'easy' | 'medium' | 'hard';

export const builderTierLabels: Record<BuilderTier, string> = {
	easy: 'Easy',
	medium: 'Medium',
	hard: 'Hard'
};

const largestEasyStoryPoints = 3;
const largestMediumStoryPoints = 8;

export function builderTierFor(storyPoints: number): BuilderTier {
	if (storyPoints <= largestEasyStoryPoints) return 'easy';
	if (storyPoints <= largestMediumStoryPoints) return 'medium';
	return 'hard';
}
