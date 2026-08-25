import { requireAdmin } from '$lib/server/admin/requireAdmin';
import { failFromAccountingError } from './accountingErrors';

export async function runAccountingCommand(
	locals: App.Locals,
	command: () => Promise<void>,
	successMessage: string
) {
	await requireAdmin(locals);
	try {
		await command();
	} catch (error) {
		return failFromAccountingError(error);
	}
	return { message: successMessage };
}
