export type SiteModelChoice = { modelId: string; label: string };

export const defaultSiteModel = 'claude-haiku-4-5';

export const siteModelChoices: SiteModelChoice[] = [
	{ modelId: 'claude-haiku-4-5', label: 'Claude Haiku 4.5 — fastest, lowest cost' },
	{ modelId: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5' },
	{ modelId: 'claude-sonnet-5', label: 'Claude Sonnet 5 — speed and intelligence balanced' },
	{ modelId: 'claude-opus-5', label: 'Claude Opus 5 — deep agentic work' },
	{ modelId: 'claude-fable-5', label: 'Claude Fable 5 — most capable' }
];

export function isKnownSiteModel(modelId: string): boolean {
	return siteModelChoices.some((choice) => choice.modelId === modelId);
}
