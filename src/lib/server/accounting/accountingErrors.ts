import { fail } from '@sveltejs/kit';

export class AccountingError extends Error {}

export function failFromAccountingError(error: unknown) {
	if (error instanceof AccountingError) return fail(400, { message: error.message });
	throw error;
}
