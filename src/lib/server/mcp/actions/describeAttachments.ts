import { describeByteCount } from '$lib/data/taskAttachmentRules';
import { formatBritishDate } from '$lib/data/britishDate';
import { withUploaderNames } from '$lib/server/projects/staffNames';
import type { StaffMember } from '$lib/server/projects/getStaffDirectory';
import type { TaskAttachment } from '$lib/server/projects/attachmentRecord';

export const noSuchAttachment =
	'No attachment has that id on that task. Call read_task to see what is attached.';

export function attachmentLines(
	attachments: TaskAttachment[],
	staffMembers: StaffMember[]
): string[] {
	if (attachments.length === 0) return ['Attachments: none yet.'];
	const lines = withUploaderNames(attachments, staffMembers).map(
		(attachment) =>
			`- ${attachment.filename} (${describeByteCount(attachment.byteCount)}, ` +
			`${attachment.mimeType}, added by ${attachment.uploaderName} on ` +
			`${formatBritishDate(attachment.createdAt)}; attachment id: ${attachment.id})`
	);
	return ['Attachments — call read_task_attachment to open one:', ...lines];
}
