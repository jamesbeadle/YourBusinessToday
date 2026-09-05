import { clientContactActions } from './clientContactActions';
import { clientDetailActions } from './clientDetailActions';
import { clientProjectActions } from './clientProjectActions';
import { clientRegisterActions } from './clientRegisterActions';
import type { McpAction } from '../actionTypes';

export const clientActions: McpAction[] = [
	...clientRegisterActions,
	...clientDetailActions,
	...clientContactActions,
	...clientProjectActions
];
