import { safeStorageFilename } from '$lib/server/storage/safeStorageFilename';

export const attachmentsBucket = 'task-attachments';

export function attachmentStoragePath(
	taskId: string,
	attachmentId: string,
	filename: string
): string {
	return `${taskId}/${attachmentId}/${safeStorageFilename(filename)}`;
}
