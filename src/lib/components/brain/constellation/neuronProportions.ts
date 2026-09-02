export type BodyProportions = {
	somaRadius: number;
	glowScale: number;
	hitRadius: number;
	dendriteReach: number;
	dendriteRootRadiusShare: number;
	branchCountFloor: number;
	branchCountCeiling: number;
};

export const neuronProportions: BodyProportions = {
	somaRadius: 0.068,
	glowScale: 0.3,
	hitRadius: 0.32,
	dendriteReach: 0.5,
	dendriteRootRadiusShare: 0.13,
	branchCountFloor: 5,
	branchCountCeiling: 8
};

export const nucleusProportions: BodyProportions = {
	somaRadius: 0.15,
	glowScale: 0.85,
	hitRadius: 0.55,
	dendriteReach: 0.8,
	dendriteRootRadiusShare: 0.085,
	branchCountFloor: 6,
	branchCountCeiling: 9
};
