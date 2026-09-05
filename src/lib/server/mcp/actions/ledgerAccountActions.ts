import { accountingAdminAction } from './accountingAdminAction';
import { createLedgerAccount, setLedgerAccountArchived } from '$lib/server/accounting/createLedgerAccount';
import {
	describeArchiveChange,
	isArchivedField,
	readIsArchived,
	sayWhetherToArchive
} from './accountingFields';
import { getLedgerAccounts } from '$lib/server/accounting/getLedgerAccounts';
import { ledgerAccountTypeLabels, ledgerAccountTypeOrder } from '$lib/data/accounting/ledgerAccountTypes';
import { objectSchema, readOptionalText, readText, textField } from '../actionTypes';
import type { LedgerAccount } from '$lib/server/accounting/getLedgerAccounts';
import type { LedgerAccountType } from '$lib/data/accounting/ledgerAccountTypes';
import type { McpAction } from '../actionTypes';

const everyType = ledgerAccountTypeOrder.join(', ');

const wrongType = `An account is one of ${everyType}. Pick one of those.`;

const noSuchAccount = 'No ledger account has that id. Call list_ledger_accounts to see the chart.';

export const ledgerAccountActions: McpAction[] = [
	accountingAdminAction({
		name: 'list_ledger_accounts',
		isWrite: false,
		summary: 'list the chart of accounts with each account type',
		inputSchema: objectSchema({
			accountType: textField(`Only accounts of this type, one of ${everyType}`)
		}),
		run: async (caller, input) => {
			const accountType = readOptionalText(input, 'accountType');
			const accounts = await getLedgerAccounts(caller.supabase);
			const shown = accounts.filter((account) => isOfType(account, accountType));
			if (shown.length === 0) return 'No ledger accounts match.';
			return shown.map(describeAccount).join('\n');
		}
	}),
	accountingAdminAction({
		name: 'create_ledger_account',
		isWrite: true,
		summary: 'add an account to the chart',
		inputSchema: objectSchema(
			{
				code: textField('The account code, unique in the chart'),
				name: textField('What the account is called'),
				accountType: textField(`One of ${everyType}`)
			},
			['code', 'name', 'accountType']
		),
		run: async (caller, input) => {
			const accountType = readText(input, 'accountType');
			if (!isLedgerAccountType(accountType)) return wrongType;
			const code = readText(input, 'code');
			const name = readText(input, 'name');
			if (code === '' || name === '') return 'An account needs both a code and a name.';
			await createLedgerAccount(caller.supabase, { code, name, accountType });
			return `${code} ${name} added to the chart as ${ledgerAccountTypeLabels[accountType]}.`;
		}
	}),
	accountingAdminAction({
		name: 'set_ledger_account_archived',
		isWrite: true,
		summary: 'archive an account or bring it back — system accounts stay',
		inputSchema: objectSchema(
			{ accountId: textField('The ledger account id'), isArchived: isArchivedField },
			['accountId', 'isArchived']
		),
		run: async (caller, input) => {
			const accounts = await getLedgerAccounts(caller.supabase);
			const account = accounts.find((candidate) => candidate.id === readText(input, 'accountId'));
			if (account === undefined) return noSuchAccount;
			if (account.isSystem) return `${account.code} ${account.name} is a system account and stays.`;
			const isArchived = readIsArchived(input);
			if (isArchived === null) return sayWhetherToArchive;
			await setLedgerAccountArchived(caller.supabase, account.id, isArchived);
			return `${account.code} ${account.name} ${describeArchiveChange(isArchived)}.`;
		}
	})
];

function isLedgerAccountType(value: string): value is LedgerAccountType {
	return ledgerAccountTypeOrder.includes(value as LedgerAccountType);
}

function isOfType(account: LedgerAccount, accountType: string | null): boolean {
	if (accountType === null) return true;
	return account.accountType === accountType;
}

function describeAccount(account: LedgerAccount): string {
	const flags = [account.isSystem ? 'system' : null, account.isArchived ? 'archived' : null]
		.filter((flag) => flag !== null)
		.map((flag) => `, ${flag}`)
		.join('');
	return `${account.code} ${account.name} — ${ledgerAccountTypeLabels[account.accountType]}${flags} (id: ${account.id})`;
}
