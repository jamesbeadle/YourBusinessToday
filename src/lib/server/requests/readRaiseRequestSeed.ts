import type { RaiseRequestSeed } from './raiseFeatureRequest';

export function readRaiseRequestSeed(formData: FormData): RaiseRequestSeed | null {
	const projectId = String(formData.get('projectId') ?? '');
	const title = String(formData.get('title') ?? '').trim();
	const want = String(formData.get('want') ?? '').trim();
	if (projectId === '' || title === '' || want === '') return null;
	return { projectId, title, want, benefit: String(formData.get('benefit') ?? '').trim() };
}
