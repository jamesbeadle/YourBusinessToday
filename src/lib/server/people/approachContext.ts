import { formatBritishDate } from '$lib/data/britishDate';
import { headcountBandLabels } from '$lib/data/headcountBands';
import { seniorityLabels, warmthLabels } from '$lib/data/contactProfileFields';
import type { Client } from './clientRecord';
import type { Person } from './getPeopleForClient';

const nothingRecorded = '(nothing recorded)';

export function describeCompanyForApproach(client: Client): string {
	const profile = client.profile;
	return [
		`Company: ${client.name}`,
		`Website: ${client.website || nothingRecorded}`,
		`Industry: ${profile.industry || nothingRecorded}`,
		`Location: ${profile.location || nothingRecorded}`,
		`Size: ${headcountBandLabels[profile.headcountBand]}`,
		`Profile: ${profile.summary || nothingRecorded}`,
		`Opening angles: ${profile.openingAngles || nothingRecorded}`
	].join('\n');
}

export function describePersonForApproach(person: Person): string {
	return [
		`Name: ${person.name}`,
		`Role: ${person.role || nothingRecorded}`,
		`Seniority: ${seniorityLabels[person.seniority]}`,
		`Decision maker: ${person.isDecisionMaker ? 'yes' : 'not known to be'}`,
		`Warmth: ${warmthLabels[person.warmth]}`,
		`Last contacted: ${person.lastContactedOn === null ? 'never' : formatBritishDate(person.lastContactedOn)}`,
		`Next action: ${person.nextAction || nothingRecorded}`,
		`Links: ${describeLinks(person)}`,
		`Notes, newest first:\n${describeNotes(person)}`
	].join('\n');
}

function describeLinks(person: Person): string {
	if (person.links.length === 0) return nothingRecorded;
	return person.links.map((link) => `${link.label} ${link.url}`).join(', ');
}

function describeNotes(person: Person): string {
	if (person.notes.length === 0) return nothingRecorded;
	return person.notes
		.map((note) => `- ${formatBritishDate(note.createdAt)}, ${note.authorName}: ${note.body}`)
		.join('\n');
}
