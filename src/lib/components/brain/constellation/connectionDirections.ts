import { Vector3 } from 'three';
import type { ConstellationModel } from './constellationTypes';

export function connectionDirectionsOf(model: ConstellationModel): Map<string, Vector3[]> {
	const directions = new Map<string, Vector3[]>();
	for (const synapse of model.synapses) {
		record(directions, synapse.fromSlug, synapse.from, synapse.to);
		record(directions, synapse.toSlug, synapse.to, synapse.from);
	}
	return directions;
}

function record(
	directions: Map<string, Vector3[]>,
	slug: string,
	from: Vector3,
	towards: Vector3
): void {
	const heading = towards.clone().sub(from);
	if (heading.lengthSq() === 0) return;
	const known = directions.get(slug) ?? [];
	known.push(heading.normalize());
	directions.set(slug, known);
}
