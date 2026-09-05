import { accountingAdminAction } from './accountingAdminAction';
import { createCostCentre, setCostCentreArchived } from '$lib/server/accounting/manageCostCentres';
import {
	describeArchiveChange,
	isArchivedField,
	readIsArchived,
	sayWhetherToArchive
} from './accountingFields';
import { formDataFromInput } from './formDataFromInput';
import { getCostCentres } from '$lib/server/accounting/getCostCentres';
import { objectSchema, readText, textField } from '../actionTypes';
import { readRequiredText } from '$lib/server/accounting/readFormValues';
import type { CostCentre } from '$lib/server/accounting/getCostCentres';
import type { McpAction } from '../actionTypes';

const noSuchCostCentre = 'No cost centre has that id. Call list_cost_centres to see them.';

export const costCentreActions: McpAction[] = [
	accountingAdminAction({
		name: 'list_cost_centres',
		isWrite: false,
		summary: 'list the cost centres income and costs can be tagged with',
		inputSchema: objectSchema({}),
		run: async (caller) => {
			const costCentres = await getCostCentres(caller.supabase);
			if (costCentres.length === 0) return 'No cost centres yet.';
			return costCentres.map(describeCostCentre).join('\n');
		}
	}),
	accountingAdminAction({
		name: 'create_cost_centre',
		isWrite: true,
		summary: 'add a cost centre',
		inputSchema: objectSchema({ name: textField('What the cost centre is called') }, ['name']),
		run: async (caller, input) => {
			const name = readRequiredText(formDataFromInput(input), 'name', 'Name');
			await createCostCentre(caller.supabase, name);
			return `Cost centre ${name} added.`;
		}
	}),
	accountingAdminAction({
		name: 'set_cost_centre_archived',
		isWrite: true,
		summary: 'archive a cost centre or bring it back',
		inputSchema: objectSchema(
			{ costCentreId: textField('The cost centre id'), isArchived: isArchivedField },
			['costCentreId', 'isArchived']
		),
		run: async (caller, input) => {
			const costCentres = await getCostCentres(caller.supabase);
			const costCentre = costCentres.find((candidate) => candidate.id === readText(input, 'costCentreId'));
			if (costCentre === undefined) return noSuchCostCentre;
			const isArchived = readIsArchived(input);
			if (isArchived === null) return sayWhetherToArchive;
			await setCostCentreArchived(caller.supabase, costCentre.id, isArchived);
			return `Cost centre ${costCentre.name} ${describeArchiveChange(isArchived)}.`;
		}
	})
];

function describeCostCentre(costCentre: CostCentre): string {
	const archived = costCentre.isArchived ? ' — archived' : '';
	return `${costCentre.name}${archived} (id: ${costCentre.id})`;
}
