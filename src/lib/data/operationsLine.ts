import { labelAbove, station } from './stationBuilder';
import { TubeLineColours } from './tubeLineColours';
import type { RoleLine } from './types';

export const operationsLine: RoleLine = {
	id: 'operations',
	role: 'Operations',
	colour: TubeLineColours.district,
	route: [
		{ x: 760, y: 240 },
		{ x: 620, y: 380 },
		{ x: 300, y: 380 },
		{ x: 160, y: 520 }
	],
	stations: [
		station(
			'project-kick-off',
			'Project Kick-off',
			{ x: 560, y: 380 },
			{
				summary: 'Set up the project, introduce the team, and agree the plan with the client.',
				inputs: ['Handover pack'],
				outputs: ['Project plan', 'Kick-off notes']
			}
		),
		station(
			'delivery-sprint',
			'Delivery Sprint',
			{ x: 440, y: 380 },
			{
				summary: 'Do the work in focused cycles with a visible board the client can follow.',
				inputs: ['Project plan'],
				outputs: ['Completed work items', 'Progress updates']
			}
		),
		station(
			'quality-review',
			'Quality Review',
			{ x: 320, y: 380 },
			{
				summary: 'Check the work against the brief before the client ever sees it.',
				inputs: ['Completed work items', 'Acceptance criteria'],
				outputs: ['Approved deliverables', 'Rework list']
			},
			labelAbove
		),
		station(
			'client-sign-off',
			'Client Sign-off',
			{ x: 230, y: 450 },
			{
				summary: 'Walk the client through the deliverables and capture formal approval.',
				inputs: ['Approved deliverables'],
				outputs: ['Signed acceptance', 'Invoice trigger']
			},
			{ tickAngle: -45, labelOffset: { x: 18, y: 6 }, labelAnchor: 'start' }
		)
	]
};
