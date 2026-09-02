import { territoriesFor, type Territory } from './brainTerritories';
import { regionCentresFor } from './regionLayout';
import { sectionHueAt, UNFILED_TINT } from './regionPalette';
import { randomDirection } from '../constellation/branchSeeds';
import { shareStreamFrom } from '../constellation/pseudoRandom';
import { groupByCases, type CaseGroup } from '$lib/components/knowledge/editors/caseGrouping';
import { dataFrom } from '$lib/components/knowledge/editors/editorFields';
import type { KbBrainItem } from '$lib/data/knowledge/knowledgeTypes';
import type { BrainRegion, RegionModel, RegionNeuron } from './regionTypes';

const UNFILED_REGION_ID = 'unfiled';
const SMALLEST_RADIUS = 0.5;
const CROWDED_EPISODE_SPREAD = 0.35;

type RegionSeed = {
	id: string;
	name: string;
	caption: string;
	isUnfiled: boolean;
	episodes: KbBrainItem[];
};

export function buildRegionModel(items: KbBrainItem[], seedText: string): RegionModel {
	const grouped = groupByCases(items);
	const seeds = grouped.caseGroups
		.toSorted((first, second) => first.caseFile.createdAt.localeCompare(second.caseFile.createdAt))
		.map(seedFromCase);
	if (grouped.caselessEpisodes.length > 0) seeds.push(unfiledSeed(grouped.caselessEpisodes));
	const anchors = regionCentresFor(seeds.length, seedText);
	const territories = territoriesFor(
		seeds.map((seed, index) => ({
			episodeCount: seed.episodes.length,
			isUnfiled: seed.isUnfiled,
			anchor: anchors[index]
		})),
		seedText
	);
	return {
		regions: seeds.map((seed, index) => {
			const colour = seed.isUnfiled ? UNFILED_TINT : sectionHueAt(index);
			return regionFrom(seed, territories[index], colour);
		})
	};
}

function seedFromCase(group: CaseGroup): RegionSeed {
	const status = dataFrom(group.caseFile, 'status');
	const count = episodeCountLabel(group.episodes.length);
	return {
		id: group.caseFile.id,
		name: group.caseFile.title,
		caption: status === '' ? count : `${count} · ${status}`,
		isUnfiled: false,
		episodes: group.episodes
	};
}

function unfiledSeed(episodes: KbBrainItem[]): RegionSeed {
	return {
		id: UNFILED_REGION_ID,
		name: 'Unfiled',
		caption: `${episodeCountLabel(episodes.length)} not yet in a case`,
		isUnfiled: true,
		episodes
	};
}

function episodeCountLabel(count: number): string {
	return `${count} ${count === 1 ? 'episode' : 'episodes'}`;
}

function regionFrom(seed: RegionSeed, territory: Territory, colour: number): BrainRegion {
	const nextShare = shareStreamFrom(`${seed.id}:crowding`);
	const radius = Math.max(SMALLEST_RADIUS, territory.radius);
	const neurons: RegionNeuron[] = territory.samples.map((position, index) => {
		const episode = seed.episodes[index];
		if (episode === undefined) {
			return { id: `${seed.id}:tissue:${index}`, title: '', isEpisode: false, position };
		}
		return { id: episode.id, title: episode.title, isEpisode: true, position };
	});
	for (const episode of seed.episodes.slice(territory.samples.length)) {
		const offset = randomDirection(nextShare).multiplyScalar(CROWDED_EPISODE_SPREAD * radius * nextShare());
		const position = territory.centre.clone().add(offset);
		neurons.push({ id: episode.id, title: episode.title, isEpisode: true, position });
	}
	return {
		id: seed.id,
		name: seed.name,
		caption: seed.caption,
		isUnfiled: seed.isUnfiled,
		colour,
		centre: territory.centre,
		radius,
		neurons
	};
}
