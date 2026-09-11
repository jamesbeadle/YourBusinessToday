import { goalReadActions } from './goalReadActions';
import { goalWriteActions } from './goalWriteActions';
import type { McpAction } from '../actionTypes';

export const goalActions: McpAction[] = [...goalReadActions, ...goalWriteActions];
