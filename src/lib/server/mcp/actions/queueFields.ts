import { textField } from '../actionTypes';

export const queuedTaskIdField = textField('The task id, as read_task_queue gives it');
export const onlyTopLevelTasksQueue =
	'Only top level tasks sit in the queue. A subtask takes its order from its parent.';
