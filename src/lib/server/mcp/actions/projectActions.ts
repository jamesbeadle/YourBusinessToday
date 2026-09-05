import { projectOwnershipActions } from './projectOwnershipActions';
import { projectPhaseActions } from './projectPhaseActions';
import { projectReadActions } from './projectReadActions';
import { projectWriteActions } from './projectWriteActions';
import type { McpAction } from '../actionTypes';

export const projectActions: McpAction[] = [
	...projectReadActions,
	...projectWriteActions,
	...projectPhaseActions,
	...projectOwnershipActions
];
