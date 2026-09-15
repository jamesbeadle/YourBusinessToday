import { error } from '@sveltejs/kit';
import { requireProjectAccess, type ProjectAccess } from './requireProjectAccess';

export async function requireProjectOwner(
	locals: App.Locals,
	projectId: string
): Promise<ProjectAccess> {
	const access = await requireProjectAccess(locals, projectId);
	if (!access.isOwner) error(403, 'Only the owner of a project can do that');
	return access;
}
