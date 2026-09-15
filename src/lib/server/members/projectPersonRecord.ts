import { parseAccountRecord, type Account } from '$lib/server/accounts/accountRecord';

export type ProjectPerson = Account & { isOwner: boolean };

export function parseProjectPersonRecord(row: Record<string, unknown>): ProjectPerson {
	return { ...parseAccountRecord(row), isOwner: row.is_owner === true };
}
