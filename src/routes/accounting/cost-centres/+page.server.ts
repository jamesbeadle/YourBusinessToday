import { getCostCentres } from '$lib/server/accounting/getCostCentres';
import { createCostCentre, setCostCentreArchived } from '$lib/server/accounting/manageCostCentres';
import { readIsChecked, readRequiredText } from '$lib/server/accounting/readFormValues';
import { runAccountingCommand } from '$lib/server/accounting/runAccountingCommand';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	return { costCentres: await getCostCentres(locals.supabase) };
};

export const actions: Actions = {
	createCostCentre: async ({ locals, request }) => {
		const formData = await request.formData();
		return runAccountingCommand(
			locals,
			() => createCostCentre(locals.supabase, readRequiredText(formData, 'name', 'Name')),
			'Cost centre added.'
		);
	},
	setArchived: async ({ locals, request }) => {
		const formData = await request.formData();
		return runAccountingCommand(
			locals,
			() =>
				setCostCentreArchived(
					locals.supabase,
					readRequiredText(formData, 'costCentreId', 'Cost centre'),
					readIsChecked(formData, 'isArchived')
				),
			'Cost centre updated.'
		);
	}
};
