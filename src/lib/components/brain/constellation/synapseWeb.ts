import { Group, type Vector3 } from 'three';
import { createSynapseStrand, type SynapseStrand } from './synapseStrand';
import { CROSSLINK, DENDRITE } from './constellationPalette';
import { WHOLE_MODEL_KEY, type MaterialBank } from './materialBank';
import { membraneRadiusOf } from './cellSoma';
import { neuronProportions, nucleusProportions } from './neuronProportions';
import type { ConstellationModel } from './constellationTypes';

const STRAND_OPACITY = 0.3;

export type SampledCurve = { points: Vector3[]; contextKey: string };

export type SynapseWeb = {
	group: Group;
	curves: SampledCurve[];
	strandsTouching: (slug: string) => SynapseStrand[];
	dispose: () => void;
};

export function createSynapseWeb(model: ConstellationModel, bank: MaterialBank): SynapseWeb {
	const nucleusSlugs = new Set(model.nuclei.map((nucleus) => nucleus.slug));
	const membraneRadiusFor = (slug: string) =>
		membraneRadiusOf(nucleusSlugs.has(slug) ? nucleusProportions : neuronProportions);

	const group = new Group();
	const strands = model.synapses.map((synapse) => {
		const contextKey = synapse.contextSlug ?? WHOLE_MODEL_KEY;
		const colour = contextKey === WHOLE_MODEL_KEY ? CROSSLINK : DENDRITE;
		const material = bank.strandFor(colour, contextKey, STRAND_OPACITY);
		const strand = createSynapseStrand(synapse, contextKey, material, membraneRadiusFor);
		group.add(strand.line);
		return strand;
	});

	function strandsTouching(slug: string): SynapseStrand[] {
		return strands.filter((strand) => strand.touches(slug));
	}

	function dispose(): void {
		for (const strand of strands) strand.dispose();
	}

	return {
		group,
		curves: strands.map((strand) => ({ points: strand.points, contextKey: strand.contextKey })),
		strandsTouching,
		dispose
	};
}
