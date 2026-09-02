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
	somaRadius: 0.075,
	glowScale: 0.3,
	hitRadius: 0.32,
	dendriteReach: 0.45,
	dendriteRootRadiusShare: 0.26,
	branchCountFloor: 5,
	branchCountCeiling: 8
};

export const nucleusProportions: BodyProportions = {
	somaRadius: 0.17,
	glowScale: 0.85,
	hitRadius: 0.55,
	dendriteReach: 0.75,
	dendriteRootRadiusShare: 0.16,
	branchCountFloor: 6,
	branchCountCeiling: 9
};
