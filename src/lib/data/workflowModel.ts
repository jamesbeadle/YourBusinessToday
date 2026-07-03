export type WorkflowTask = {
	name: string;
	summary: string;
	inputs: string[];
	outputs: string[];
	handoverRoles: string[];
	businessOutput?: string;
};

export type WorkflowRole = {
	name: string;
	tasks: WorkflowTask[];
};

export type WorkflowModel = {
	businessName: string;
	roles: WorkflowRole[];
};

export const emptyWorkflowModel: WorkflowModel = { businessName: '', roles: [] };

export function hasMapContent(model: WorkflowModel): boolean {
	return model.roles.some((role) => role.tasks.length > 0);
}
