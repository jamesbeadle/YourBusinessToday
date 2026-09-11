import { projectOwnershipActions } from './projectOwnershipActions';
import { projectReadActions } from './projectReadActions';
import { projectWriteActions } from './projectWriteActions';
import type { McpAction } from '../actionTypes';

export const projectActions: McpAction[] = [
	...projectReadActions,
	...projectWriteActions,
	...projectOwnershipActions
];
