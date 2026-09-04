import { accountActions } from './actions/accountActions';
import { accountingActions } from './actions/accountingActions';
import { clientActions } from './actions/clientActions';
import { projectActions } from './actions/projectActions';
import { requestActions } from './actions/requestActions';
import { taskActions } from './actions/taskActions';
import type { ActionArea, McpAction } from './actionTypes';
import type { McpRole } from './resolveAccountStanding';

const everyAction: McpAction[] = [
	...accountActions,
	...clientActions,
	...requestActions,
	...projectActions,
	...taskActions,
	...accountingActions
];

export function actionsFor(role: McpRole, area: ActionArea | null): McpAction[] {
	return everyAction
		.filter((action) => isAudience(action, role))
		.filter((action) => area === null || action.area === area)
		.sort((left, right) => left.name.localeCompare(right.name));
}

export function findAction(name: string, role: McpRole): McpAction | null {
	return actionsFor(role, null).find((action) => action.name === name) ?? null;
}

export function areasFor(role: McpRole): ActionArea[] {
	return [...new Set(actionsFor(role, null).map((action) => action.area))];
}

function isAudience(action: McpAction, role: McpRole): boolean {
	if (action.audience === 'everyone') return true;
	return action.audience === role;
}
