import type { StaffMember } from '$lib/server/projects/getStaffDirectory';

export function resolveViewedStaffMember(
	requestedUserId: string | null,
	staffMembers: StaffMember[],
	currentUserId: string
): StaffMember {
	const requestedMember = staffMembers.find((member) => member.id === requestedUserId);
	if (requestedMember !== undefined) return requestedMember;
	const currentMember = staffMembers.find((member) => member.id === currentUserId);
	if (currentMember !== undefined) return currentMember;
	return { id: currentUserId, name: 'You' };
}
