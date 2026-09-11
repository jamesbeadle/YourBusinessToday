import { actionsFor, areasFor } from './actionRegistry';
import type { McpCaller } from './resolveMcpCaller';

export function describeContext(caller: McpCaller): string {
	return [
		`Signed in as ${caller.email}.`,
		caller.role === 'staff' ? staffLine(caller) : memberLine(caller),
		`Areas you can reach: ${areasFor(caller).join(', ')}.`,
		`${actionsFor(caller, null).length} actions are available to you — call list_actions to see them.`
	].join('\n');
}

function staffLine(caller: McpCaller): string {
	const standing = caller.isAdmin ? 'an administrator' : 'a member of staff';
	return `You are ${standing} at Your Business Today, so you are working on the business, not as a client.`;
}

function memberLine(caller: McpCaller): string {
	const count = caller.memberProjectIds.length;
	const projects = count === 1 ? 'one project' : `${count} projects`;
	return `You are a member of ${projects} here, and can reach only those: their goals, their tasks and the conversations on them.`;
}
