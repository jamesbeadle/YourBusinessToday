import { parseHeadcountBand } from '$lib/data/headcountBands';
import type { CompanyProfile } from './companyProfile';

export type ResearchedPerson = { name: string; role: string; evidenceUrl: string };

export type ResearchedProfile = {
	name: string;
	website: string;
	profile: CompanyProfile;
	people: ResearchedPerson[];
};

const openingAngleSeparator = '\n';

export function parseResearchedProfile(
	toolInput: Record<string, unknown>,
	website: string,
	sourceUrl: string
): ResearchedProfile {
	return {
		name: String(toolInput.company_name ?? '').trim(),
		website,
		profile: {
			industry: String(toolInput.industry ?? '').trim(),
			location: String(toolInput.location ?? '').trim(),
			headcountBand: parseHeadcountBand(toolInput.headcount_band),
			companyNumber: '',
			summary: String(toolInput.summary ?? '').trim(),
			openingAngles: parseOpeningAngles(toolInput.opening_angles),
			sourceUrl
		},
		people: parsePeople(toolInput.people, sourceUrl)
	};
}

function parseOpeningAngles(value: unknown): string {
	if (!Array.isArray(value)) return '';
	return value
		.map((angle) => String(angle).trim())
		.filter((angle) => angle !== '')
		.map((angle) => `- ${angle}`)
		.join(openingAngleSeparator);
}

function parsePeople(value: unknown, fallbackUrl: string): ResearchedPerson[] {
	if (!Array.isArray(value)) return [];
	return value
		.map((person) => ({
			name: String(person?.name ?? '').trim(),
			role: String(person?.role ?? '').trim(),
			evidenceUrl: String(person?.evidence_url ?? '').trim() || fallbackUrl
		}))
		.filter((person) => person.name !== '');
}
