export const assignableTaskRoles = ['Developer', 'Designer', 'Tester', 'Product', 'DevOps'];

export function parseTaskRoles(values: string[]): string[] {
	return values.filter((value) => assignableTaskRoles.includes(value));
}
