import { labelAbove, station } from './stationBuilder';
import { TubeLineColours } from './tubeLineColours';
import type { RoleLine } from './types';

export const marketingLine: RoleLine = {
	id: 'marketing',
	role: 'Marketing',
	colour: TubeLineColours.bakerloo,
	route: [
		{ x: 660, y: 100 },
		{ x: 300, y: 100 },
		{ x: 160, y: 240 }
	],
	stations: [
		station(
			'campaign-planning',
			'Campaign Planning',
			{ x: 660, y: 100 },
			{
				summary: 'Decide which audience to reach this quarter and which message will land.',
				inputs: ['Quarterly revenue target', 'Ideal client profile', 'Past campaign results'],
				outputs: ['Campaign brief', 'Channel budget']
			},
			labelAbove
		),
		station(
			'content-production',
			'Content Production',
			{ x: 540, y: 100 },
			{
				summary: 'Turn the campaign brief into articles, posts and assets ready to publish.',
				inputs: ['Campaign brief', 'Brand guidelines'],
				outputs: ['Approved content pieces']
			},
			labelAbove
		),
		station(
			'publishing',
			'Publishing',
			{ x: 420, y: 100 },
			{
				summary: 'Schedule and release content across the chosen channels.',
				inputs: ['Approved content pieces', 'Channel calendar'],
				outputs: ['Live posts', 'Engagement data']
			},
			labelAbove
		),
		station(
			'community-buzz',
			'Community Buzz',
			{ x: 300, y: 100 },
			{
				summary: 'Reply to comments and conversations so interest turns into enquiries.',
				inputs: ['Engagement data', 'Mentions and replies'],
				outputs: ['Warm enquiries']
			},
			labelAbove
		)
	]
};
