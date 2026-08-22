export type BodyProportions = {
	somaRadius: number;
	glowScale: number;
	hitRadius: number;
	dendriteReach: number;
	branchCountFloor: number;
	connectionCap: number;
};

export const neuronProportions: BodyProportions = {
	somaRadius: 0.055,
	glowScale: 0.24,
	hitRadius: 0.32,
	dendriteReach: 0.42,
	branchCountFloor: 5,
	connectionCap: 8
};

export const nucleusProportions: BodyProportions = {
	somaRadius: 0.12,
	glowScale: 0.7,
	hitRadius: 0.55,
	dendriteReach: 0.8,
	branchCountFloor: 8,
	connectionCap: 12
};
