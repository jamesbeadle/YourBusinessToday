export type ClientStage = 'lead' | 'prospect' | 'client' | 'dormant' | 'lost';

export const clientStageOrder: ClientStage[] = ['lead', 'prospect', 'client', 'dormant', 'lost'];

export const clientStageLabels: Record<ClientStage, string> = {
	lead: 'Lead',
	prospect: 'Prospect',
	client: 'Client',
	dormant: 'Dormant',
	lost: 'Lost'
};

export function parseClientStage(value: unknown): ClientStage {
	const stage = clientStageOrder.find((candidate) => candidate === value);
	if (stage === undefined) return 'lead';
	return stage;
}
