import { getAccountingSettings } from '$lib/server/accounting/getAccountingSettings';
import { readRequiredText, readText, readWholeNumberField } from '$lib/server/accounting/readFormValues';
import { runAccountingCommand } from '$lib/server/accounting/runAccountingCommand';
import { saveAccountingSettings } from '$lib/server/accounting/saveAccountingSettings';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	return { settings: await getAccountingSettings(locals.supabase) };
};

export const actions: Actions = {
	saveSettings: async ({ locals, request }) => {
		const formData = await request.formData();
		return runAccountingCommand(
			locals,
			() =>
				saveAccountingSettings(locals.supabase, {
					companyName: readRequiredText(formData, 'companyName', 'Company name'),
					companyAddress: readText(formData, 'companyAddress'),
					companyEmail: readText(formData, 'companyEmail'),
					paymentInstructions: readText(formData, 'paymentInstructions'),
					paymentTermsDays: readWholeNumberField(formData, 'paymentTermsDays', 'Payment terms'),
					financialYearStartMonth: readWholeNumberField(formData, 'financialYearStartMonth', 'Year start'),
					invoicePrefix: readRequiredText(formData, 'invoicePrefix', 'Invoice prefix')
				}),
			'Settings saved.'
		);
	}
};
