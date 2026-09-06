import type { ClientStage } from '$lib/data/clientLifecycle';

export type PinStanding = ClientStage | 'unlisted';

export type PinTone = { colourToken: string; fillOpacity: number; label: string };

export const pinToneOrder: PinStanding[] = ['unlisted', 'lead', 'prospect', 'client', 'dormant', 'lost'];

export const pinTones: Record<PinStanding, PinTone> = {
	unlisted: { colourToken: '--color-etch', fillOpacity: 0.35, label: 'Not on the register' },
	lead: { colourToken: '--color-chalk', fillOpacity: 0.9, label: 'Lead' },
	prospect: { colourToken: '--color-caution', fillOpacity: 0.9, label: 'Prospect' },
	client: { colourToken: '--color-go', fillOpacity: 0.9, label: 'Client' },
	dormant: { colourToken: '--color-slate', fillOpacity: 0.9, label: 'Dormant' },
	lost: { colourToken: '--color-signal', fillOpacity: 0.6, label: 'Lost' }
};

export function standingOf(stage: ClientStage | null): PinStanding {
	if (stage === null) return 'unlisted';
	return stage;
}

export function resolveColourToken(token: string): string {
	return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
}
