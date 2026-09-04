export type ClientContact = {
	id: string;
	clientId: string;
	accountId: string | null;
	name: string;
	email: string;
	phone: string;
	role: string;
	isPrimary: boolean;
	invitedAt: string | null;
	createdAt: string;
};

export function parseClientContactRecord(row: Record<string, unknown>): ClientContact {
	return {
		id: row.id as string,
		clientId: row.client_id as string,
		accountId: (row.account_id ?? null) as string | null,
		name: row.name as string,
		email: row.email as string,
		phone: row.phone as string,
		role: row.role as string,
		isPrimary: row.is_primary as boolean,
		invitedAt: (row.invited_at ?? null) as string | null,
		createdAt: row.created_at as string
	};
}
