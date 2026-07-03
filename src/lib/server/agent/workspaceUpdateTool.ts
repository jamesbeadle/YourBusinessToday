const workflowTaskSchema = {
	type: 'object',
	required: ['name', 'summary', 'inputs', 'outputs', 'handoverRoles'],
	properties: {
		name: { type: 'string' },
		summary: { type: 'string' },
		inputs: { type: 'array', items: { type: 'string' } },
		outputs: { type: 'array', items: { type: 'string' } },
		handoverRoles: { type: 'array', items: { type: 'string' } },
		businessOutput: { type: 'string' }
	}
};

const workflowModelSchema = {
	type: 'object',
	required: ['businessName', 'roles'],
	properties: {
		businessName: { type: 'string' },
		roles: {
			type: 'array',
			items: {
				type: 'object',
				required: ['name', 'tasks'],
				properties: {
					name: { type: 'string' },
					tasks: { type: 'array', items: workflowTaskSchema }
				}
			}
		}
	}
};

export const workspaceUpdateTool = {
	name: 'update_workspace',
	description:
		'Return your conversational reply to the business owner together with the complete ' +
		'updated Workflow Map model reflecting everything learned so far.',
	input_schema: {
		type: 'object',
		required: ['reply', 'map'],
		properties: {
			reply: { type: 'string', description: 'Your next question or remark, under 120 words.' },
			map: workflowModelSchema
		}
	}
};
