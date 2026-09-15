import { accountNameLookup } from '$lib/data/accountNames';
import type { Account } from '$lib/server/accounts/accountRecord';
import type { TaskAttachment } from '$lib/server/projects/attachmentRecord';

export function withUploaderNames(attachments: TaskAttachment[], people: Account[]) {
	const nameOf = accountNameLookup(people);
	return attachments.map((attachment) => ({
		...attachment,
		uploaderName: nameOf(attachment.uploadedBy)
	}));
}
