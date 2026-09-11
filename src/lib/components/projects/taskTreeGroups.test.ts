import { describe, expect, it } from 'vitest';
import { groupTasksByGoal } from './taskTreeGroups';
import type { Goal } from '$lib/server/goals/goalRecord';
import type { TaskTreeNode } from '$lib/server/projects/buildTaskTree';

const launch = { id: 'goal-launch', title: 'Launch' } as Goal;
const polish = { id: 'goal-polish', title: 'Polish' } as Goal;

function task(id: string, goalId: string | null): TaskTreeNode {
	return { id, goalId, subtasks: [] } as unknown as TaskTreeNode;
}

describe('groupTasksByGoal', () => {
	it('keeps goal order, keeps task order within a goal, and puts the rest last', () => {
		const groups = groupTasksByGoal(
			[task('a', null), task('b', 'goal-polish'), task('c', 'goal-launch'), task('d', 'goal-polish')],
			[launch, polish]
		);
		expect(groups.map((group) => group.goal?.title ?? 'other')).toEqual(['Launch', 'Polish', 'other']);
		expect(groups[1].tasks.map((candidate) => candidate.id)).toEqual(['b', 'd']);
		expect(groups[2].tasks.map((candidate) => candidate.id)).toEqual(['a']);
	});

	it('leaves out goals with nothing under them and the rest when there is none', () => {
		const groups = groupTasksByGoal([task('a', 'goal-launch')], [launch, polish]);
		expect(groups.map((group) => group.goal?.title)).toEqual(['Launch']);
	});

	it('treats a task whose goal is gone as outside any goal', () => {
		const groups = groupTasksByGoal([task('a', 'goal-deleted')], [launch]);
		expect(groups[0].goal).toBeNull();
	});
});
