import { objectSchema } from '../actionTypes';
import type { McpAction } from '../actionTypes';

export const accountActions: McpAction[] = [
	{
		name: 'who_am_i',
		area: 'account',
		audience: 'everyone',
		isWrite: false,
		summary: 'Your email address, your standing here, and what that lets you do',
		inputSchema: objectSchema({}),
		run: async (caller) =>
			[
				`Email: ${caller.email}`,
				`Standing: ${caller.role === 'staff' ? standingOfStaff(caller.isAdmin) : 'client contact'}`,
				caller.contact === null ? null : `Contact record: ${caller.contact.name} (${caller.contact.email})`
			]
				.filter((line) => line !== null)
				.join('\n')
	}
];

function standingOfStaff(isAdmin: boolean): string {
	if (isAdmin) return 'administrator';
	return 'staff';
}
