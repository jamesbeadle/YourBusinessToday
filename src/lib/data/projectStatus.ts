export type ProjectStatus = 'active' | 'on_hold' | 'complete';

export const projectStatusLabels: Record<ProjectStatus, string> = {
	active: 'Active',
	on_hold: 'On hold',
	complete: 'Complete'
};

export const projectStatusOrder: ProjectStatus[] = ['active', 'on_hold', 'complete'];

export function parseProjectStatus(value: unknown): ProjectStatus {
	if (value === 'on_hold' || value === 'complete') return value;
	return 'active';
}
