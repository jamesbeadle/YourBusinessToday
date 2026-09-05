export type Seniority = '' | 'junior' | 'manager' | 'director' | 'executive' | 'owner';

export const seniorityOrder: Seniority[] = ['', 'junior', 'manager', 'director', 'executive', 'owner'];

export const seniorityLabels: Record<Seniority, string> = {
	'': 'Unknown',
	junior: 'Junior',
	manager: 'Manager',
	director: 'Director',
	executive: 'Executive',
	owner: 'Owner or founder'
};

export type Warmth = 'cold' | 'warm' | 'hot';

export const warmthOrder: Warmth[] = ['cold', 'warm', 'hot'];

export const warmthLabels: Record<Warmth, string> = {
	cold: 'Cold',
	warm: 'Warm',
	hot: 'Hot'
};

export function parseSeniority(value: unknown): Seniority {
	const seniority = seniorityOrder.find((candidate) => candidate === value);
	if (seniority === undefined) return '';
	return seniority;
}

export function parseWarmth(value: unknown): Warmth {
	const warmth = warmthOrder.find((candidate) => candidate === value);
	if (warmth === undefined) return 'cold';
	return warmth;
}
