import { supportTaskReadActions } from './supportTaskReadActions';
import { supportTaskWriteActions } from './supportTaskWriteActions';
import type { McpAction } from '../actionTypes';

export const supportTaskActions: McpAction[] = [...supportTaskReadActions, ...supportTaskWriteActions];
