import { goalEditActions } from './goalEditActions';
import { goalOrderActions } from './goalOrderActions';
import { goalReadActions } from './goalReadActions';
import { goalWriteActions } from './goalWriteActions';
import type { McpAction } from '../actionTypes';

export const goalActions: McpAction[] = [
	...goalReadActions,
	...goalWriteActions,
	...goalEditActions,
	...goalOrderActions
];
