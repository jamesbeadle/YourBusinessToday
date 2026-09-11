import type { StaffMember } from '$lib/server/projects/getStaffDirectory';
import type { TaskAttachment } from '$lib/server/projects/attachmentRecord';

const formerStaffName = 'Former staff';

export function withUploaderNames(attachments: TaskAttachment[], staffMembers: StaffMember[]) {
	const staffNameOf = staffNameLookup(staffMembers);
	return attachments.map((attachment) => ({
		...attachment,
		uploaderName: staffNameOf(attachment.uploadedBy)
	}));
}

function staffNameLookup(staffMembers: StaffMember[]): (staffId: string) => string {
	const nameById = new Map(staffMembers.map((staffMember) => [staffMember.id, staffMember.name]));
	return (staffId) => nameById.get(staffId) ?? formerStaffName;
}
