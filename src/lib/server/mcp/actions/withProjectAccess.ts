import { canReachProject } from '../projectAccess';
import type { McpCaller } from '../resolveMcpCaller';

type OnAProject = { projectId: string };

export async function withProjectAccess<Subject extends OnAProject>(
	caller: McpCaller,
	subject: Subject | null,
	whenMissing: string,
	describe: (subject: Subject) => Promise<string>
): Promise<string> {
	if (subject === null || !canReachProject(caller, subject.projectId)) return whenMissing;
	return describe(subject);
}
