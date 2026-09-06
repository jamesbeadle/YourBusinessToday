import type { ClientStage } from '$lib/data/clientLifecycle';

export const stageToneClasses: Record<ClientStage, string> = {
	lead: 'border-hairline text-chalk/60',
	prospect: 'border-caution/50 text-caution',
	client: 'border-go/60 text-go',
	dormant: 'border-chalk/20 text-chalk/40',
	lost: 'border-signal/50 text-signal/70'
};

export const stageDotClasses: Record<ClientStage, string> = {
	lead: 'bg-chalk/40',
	prospect: 'bg-caution',
	client: 'bg-go',
	dormant: 'bg-chalk/20',
	lost: 'bg-signal/60'
};
