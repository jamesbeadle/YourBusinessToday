import { readText, textField } from '../actionTypes';
import type { DropPlacement } from '$lib/server/projects/dropReorder';
import type { TaskMoveDirection } from '$lib/server/projects/moveTask';

export type BesidePlacement = Exclude<DropPlacement, 'inside'>;

export const directionField = textField('up or down');
export const besidePlacementField = textField('before or after');

export const sayWhichDirection = 'It moves up or down. Say which.';
export const sayWhichPlacement = 'It goes before or after the other. Say which.';

export function readMoveDirection(input: Record<string, unknown>): TaskMoveDirection | null {
	const direction = readText(input, 'direction');
	if (direction === 'up' || direction === 'down') return direction;
	return null;
}

export function readBesidePlacement(input: Record<string, unknown>): BesidePlacement | null {
	const placement = readText(input, 'placement');
	if (placement === 'before' || placement === 'after') return placement;
	return null;
}
