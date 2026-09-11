import { describe, expect, it } from 'vitest';
import { resolveInsteadOfClosing, statusChangeRefusal } from './statusChangeRefusal';
import type { ProjectTask } from '$lib/server/projects/taskRecord';

const unresolvedSupportTask = { kind: 'support', resolution: '' } as ProjectTask;
const resolvedSupportTask = { kind: 'support', resolution: 'Done, it is live.' } as ProjectTask;
const workTask = { kind: 'work', resolution: '' } as ProjectTask;

describe('statusChangeRefusal', () => {
	it('will not close a support task that has no resolution for its raiser', () => {
		expect(statusChangeRefusal(unresolvedSupportTask, 'done')).toBe(resolveInsteadOfClosing);
	});

	it('lets a resolved support task, or any work task, move freely', () => {
		expect(statusChangeRefusal(resolvedSupportTask, 'done')).toBeNull();
		expect(statusChangeRefusal(unresolvedSupportTask, 'in_progress')).toBeNull();
		expect(statusChangeRefusal(workTask, 'done')).toBeNull();
	});
});
