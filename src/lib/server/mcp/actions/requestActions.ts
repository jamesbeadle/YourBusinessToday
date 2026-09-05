import { contactRequestActions } from './contactRequestActions';
import { staffRequestActions } from './staffRequestActions';
import type { McpAction } from '../actionTypes';

export const requestActions: McpAction[] = [...staffRequestActions, ...contactRequestActions];
