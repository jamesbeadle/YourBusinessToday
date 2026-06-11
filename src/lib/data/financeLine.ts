import { station } from './stationBuilder';
import { TubeLineColours } from './tubeLineColours';
import type { RoleLine } from './types';

export const financeLine: RoleLine = {
	id: 'finance',
	role: 'Finance',
	colour: TubeLineColours.piccadilly,
	route: [
		{ x: 160, y: 520 },
		{ x: 760, y: 520 }
	],
	stations: [
		station(
			'invoice-raised',
			'Invoice Raised',
			{ x: 160, y: 520 },
			{
				summary: 'Turn the signed acceptance into an invoice the same day.',
				inputs: ['Invoice trigger', 'Contract payment terms'],
				outputs: ['Issued invoice']
			},
			{ isInterchange: true, connectingRoles: ['Operations'], labelOffset: { x: 0, y: 34 } }
		),
		station(
			'payment-chase',
			'Payment Chase',
			{ x: 300, y: 520 },
			{
				summary: 'Follow up unpaid invoices on a fixed rhythm — day 7, day 14, day 21.',
				inputs: ['Issued invoice', 'Aged debtors report'],
				outputs: ['Payments received', 'Escalation list']
			}
		),
		station(
			'reconciliation',
			'Reconciliation',
			{ x: 440, y: 520 },
			{
				summary: 'Match every bank transaction to an invoice or a bill, weekly.',
				inputs: ['Bank feed', 'Payments received'],
				outputs: ['Reconciled ledger']
			}
		),
		station(
			'monthly-reporting',
			'Monthly Reporting',
			{ x: 580, y: 520 },
			{
				summary: 'Close the month and publish the numbers the directors actually use.',
				inputs: ['Reconciled ledger'],
				outputs: ['Monthly management report']
			}
		),
		station(
			'cash-forecasting',
			'Cash Forecasting',
			{ x: 720, y: 520 },
			{
				summary: "Project the next quarter's cash so decisions are made early, not late.",
				inputs: ['Monthly management report', 'Sales pipeline'],
				outputs: ['Rolling cash forecast']
			}
		)
	]
};
