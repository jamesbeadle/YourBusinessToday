import type { Seniority } from './contactProfileFields';

const directorRoleMarker = 'director';
const unknownSeniority: Seniority = '';

// Companies House names a role rather than a rank: a director is the rank we
// can trust, and a secretary or an unnamed role is left for staff to judge.
export function seniorityForOfficerRole(officerRole: string): Seniority {
	if (officerRole.toLowerCase().includes(directorRoleMarker)) return 'director';
	return unknownSeniority;
}
