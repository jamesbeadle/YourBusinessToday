import { Vector3 } from 'three';
import { sampleInsideBrain } from '../../brain/constellation/brainShape';
import { shareStreamFrom } from '../../brain/constellation/pseudoRandom';

const BRAIN_SCALE = 1.15;
const BASE_NEURONS = 70;
const NEURONS_PER_ITEM = 6;
const NEURON_CAP = 320;

export function sampleItemBrainPoints(seedText: string, itemCount: number): Vector3[] {
	const nextShare = shareStreamFrom(seedText);
	const neuronCount = Math.min(NEURON_CAP, BASE_NEURONS + itemCount * NEURONS_PER_ITEM);
	const samples: Vector3[] = [];
	for (let index = 0; index < neuronCount; index += 1) {
		samples.push(sampleInsideBrain(nextShare).multiplyScalar(BRAIN_SCALE));
	}
	return samples;
}
