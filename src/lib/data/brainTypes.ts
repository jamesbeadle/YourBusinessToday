export type BrainSourceStatus = 'uploaded' | 'ingested' | 'failed';

export type BrainSource = {
	id: string;
	filename: string;
	mimeType: string;
	byteCount: number;
	status: BrainSourceStatus;
	summary: string;
	createdAt: string;
};

export type BrainPageSummary = {
	slug: string;
	title: string;
	summary: string;
	category: string;
};

export type BrainPage = BrainPageSummary & {
	body: string;
	updatedAt: string;
};

export type BrainEventKind =
	| 'source_ingested'
	| 'page_created'
	| 'page_updated'
	| 'question_answered';

export type BrainEvent = {
	id: number;
	kind: BrainEventKind;
	detail: Record<string, unknown>;
	pageSlug: string | null;
	createdAt: string;
};

export type BrainAnswer = {
	answerMarkdown: string;
	citedSlugs: string[];
};
