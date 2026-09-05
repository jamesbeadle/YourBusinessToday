import { acceptanceCriterionActions } from './acceptanceCriterionActions';
import { buildDispatchActions } from './buildDispatchActions';
import { builderActions } from './builderActions';
import { taskReadActions } from './taskReadActions';
import { taskStatusActions } from './taskStatusActions';
import { taskStoryActions } from './taskStoryActions';
import { taskTeamActions } from './taskTeamActions';
import { taskWriteActions } from './taskWriteActions';
import type { McpAction } from '../actionTypes';

export const taskActions: McpAction[] = [
	...taskReadActions,
	...taskWriteActions,
	...taskStatusActions,
	...taskStoryActions,
	...taskTeamActions,
	...acceptanceCriterionActions,
	...buildDispatchActions,
	...builderActions
];
