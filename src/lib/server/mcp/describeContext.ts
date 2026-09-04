import { actionsFor, areasFor } from './actionRegistry';
import type { McpCaller } from './resolveMcpCaller';

export function describeContext(caller: McpCaller): string {
	return [
		`Signed in as ${caller.email}.`,
		caller.role === 'staff' ? staffLine(caller) : contactLine(caller),
		`Areas you can reach: ${areasFor(caller.role).join(', ')}.`,
		`${actionsFor(caller.role, null).length} actions are available to you — call list_actions to see them.`
	].join('\n');
}

function staffLine(caller: McpCaller): string {
	const standing = caller.isAdmin ? 'an administrator' : 'a member of staff';
	return `You are ${standing} at Your Business Today, so you are working on the business, not as a client.`;
}

function contactLine(caller: McpCaller): string {
	const company = caller.contact === null ? 'your company' : "your company's";
	return `You are a client contact${roleNote(caller)}. You can only reach ${company} projects and requests.`;
}

function roleNote(caller: McpCaller): string {
	const contactRole = caller.contact?.role ?? '';
	if (contactRole === '') return '';
	return ` (${contactRole})`;
}
