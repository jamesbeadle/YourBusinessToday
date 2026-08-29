export type HarvestedEvent = {
	title: string;
	note: string;
	occurredAt: string | null;
};

export type HarvestedKnowledge = {
	expertiseFacts: string[];
	experienceEvents: HarvestedEvent[];
};

export function parseHarvest(payload: {
	expertiseFacts?: unknown;
	experienceEvents?: unknown;
}): HarvestedKnowledge {
	return {
		expertiseFacts: parseFacts(payload.expertiseFacts),
		experienceEvents: parseEvents(payload.experienceEvents)
	};
}

function parseFacts(value: unknown): string[] {
	if (!Array.isArray(value)) return [];
	return value
		.filter((fact): fact is string => typeof fact === 'string')
		.map((fact) => fact.trim())
		.filter((fact) => fact !== '');
}

function parseEvents(value: unknown): HarvestedEvent[] {
	if (!Array.isArray(value)) return [];
	return value.flatMap((event) => {
		if (typeof event !== 'object' || event === null) return [];
		const record = event as Record<string, unknown>;
		if (typeof record.title !== 'string' || record.title.trim() === '') return [];
		return [
			{
				title: record.title.trim(),
				note: typeof record.note === 'string' ? record.note.trim() : '',
				occurredAt: typeof record.occurredAt === 'string' ? record.occurredAt : null
			}
		];
	});
}
