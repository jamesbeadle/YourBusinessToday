import type { Account } from '$lib/server/accounts/accountRecord';

const formerAccountName = 'Former account';

export function accountNameLookup(accounts: Account[]): (accountId: string) => string {
	const nameById = new Map(accounts.map((account) => [account.id, account.name]));
	return (accountId) => nameById.get(accountId) ?? formerAccountName;
}
