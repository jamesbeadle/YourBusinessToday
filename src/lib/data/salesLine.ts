import { station } from './stationBuilder';
import { TubeLineColours } from './tubeLineColours';
import type { RoleLine } from './types';

export const salesLine: RoleLine = {
	id: 'sales',
	role: 'Sales',
	colour: TubeLineColours.central,
	route: [
		{ x: 160, y: 240 },
		{ x: 760, y: 240 }
	],
	stations: [
		station(
			'lead-capture',
			'Lead Capture',
			{ x: 160, y: 240 },
			{
				summary: 'Log every enquiry the moment it arrives, whatever the channel.',
				inputs: ['Warm enquiries', 'Website form submissions', 'Referrals'],
				outputs: ['New lead record']
			},
			{ isInterchange: true, connectingRoles: ['Marketing'], labelOffset: { x: 0, y: 34 } }
		),
		station(
			'qualification',
			'Qualification',
			{ x: 280, y: 240 },
			{
				summary: 'Check the lead fits — budget, need, timing — before anyone books a call.',
				inputs: ['New lead record', 'Qualification checklist'],
				outputs: ['Qualified lead', 'Polite decline']
			}
		),
		station(
			'discovery-call',
			'Discovery Call',
			{ x: 400, y: 240 },
			{
				summary: 'A structured conversation to understand the problem behind the enquiry.',
				inputs: ['Qualified lead', 'Call agenda'],
				outputs: ['Call notes', 'Requirements summary']
			}
		),
		station(
			'proposal',
			'Proposal',
			{ x: 520, y: 240 },
			{
				summary: 'Price the work and write the offer the client will actually read.',
				inputs: ['Requirements summary', 'Rate card'],
				outputs: ['Sent proposal']
			}
		),
		station(
			'contract-signed',
			'Contract Signed',
			{ x: 640, y: 240 },
			{
				summary: 'Agree terms, sign, and raise the deposit invoice.',
				inputs: ['Sent proposal', 'Standard terms'],
				outputs: ['Signed contract', 'Deposit invoice request']
			}
		),
		station(
			'client-handover',
			'Client Handover',
			{ x: 760, y: 240 },
			{
				summary: "Pass everything sales learned to the delivery team — nothing lives in one person's head.",
				inputs: ['Signed contract', 'Call notes', 'Requirements summary'],
				outputs: ['Handover pack']
			},
			{ isInterchange: true, connectingRoles: ['Operations'], labelOffset: { x: 0, y: -20 } }
		)
	]
};
