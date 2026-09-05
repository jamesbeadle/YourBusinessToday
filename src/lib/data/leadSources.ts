export type LeadSource = 'staff' | 'website' | 'research' | 'companies_house';

export const leadSourceOrder: LeadSource[] = ['staff', 'website', 'research', 'companies_house'];

export const leadSourceLabels: Record<LeadSource, string> = {
	staff: 'Added by staff',
	website: 'Enquired through the website',
	research: 'Researched',
	companies_house: 'Found on Companies House'
};

export function parseLeadSource(value: unknown): LeadSource {
	const source = leadSourceOrder.find((candidate) => candidate === value);
	if (source === undefined) return 'staff';
	return source;
}
