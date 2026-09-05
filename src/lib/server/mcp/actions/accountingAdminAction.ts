import { AccountingError } from '$lib/server/accounting/accountingErrors';
import type { McpAction } from '../actionTypes';
import type { McpCaller } from '../resolveMcpCaller';

export type AccountingActionDefinition = Omit<McpAction, 'area' | 'audience'>;

export const accountingIsForAdministratorsOnly = 'Accounting is for administrators only.';

export function accountingAdminAction(definition: AccountingActionDefinition): McpAction {
	return {
		...definition,
		area: 'accounting',
		audience: 'admin',
		run: (caller, input) => runForAccountingAdmin(caller, () => definition.run(caller, input))
	};
}

export async function runForAccountingAdmin(
	caller: McpCaller,
	command: () => Promise<string>
): Promise<string> {
	if (!caller.isAdmin) return accountingIsForAdministratorsOnly;
	try {
		return await command();
	} catch (error) {
		return sentenceFromAccountingError(error);
	}
}

function sentenceFromAccountingError(error: unknown): string {
	if (error instanceof AccountingError) return error.message;
	throw error;
}
