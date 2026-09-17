import { projectStatusLabels, projectStatusOrder, type ProjectStatus } from './projectStatus';

export type ProjectStatusFilter = ProjectStatus | 'open' | 'all';

export const projectStatusFilterOrder: ProjectStatusFilter[] = [
	'open',
	'all',
	...projectStatusOrder
];

export const filterWhenProjectsOpen: ProjectStatusFilter = 'open';

const completeProjectStatus: ProjectStatus = 'complete';

export function projectStatusFilterLabel(filter: ProjectStatusFilter): string {
	if (filter === 'open') return 'Open';
	if (filter === 'all') return 'All';
	return projectStatusLabels[filter];
}

export function matchesProjectStatusFilter(
	status: ProjectStatus,
	filter: ProjectStatusFilter
): boolean {
	if (filter === 'all') return true;
	if (filter === 'open') return status !== completeProjectStatus;
	return status === filter;
}
