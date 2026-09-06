import { getContext, setContext, untrack, type Snippet } from 'svelte';

export type DashboardTool = {
	key: string;
	label: string;
	iconPaths: string[];
	panel: Snippet;
};

type ToolRegistration = { owner: string; tools: DashboardTool[]; rank: number };

/** The knowledge base's tools sit beneath an open brain's whatever order they register in. */
export const knowledgeBaseToolsRank = 0;
export const brainToolsRank = 1;

/**
 * The toolbar's contents and which panel is open. Whoever owns a set of tools
 * registers it with a rank; the highest-ranked registration is the one on show
 * (the latest among equals), so a brain's tools replace the knowledge base's
 * while the brain is open. Registering happens inside the owners' effects, so
 * the registry writes untracked to keep those effects from re-running on their
 * own writes.
 */
export class DashboardTools {
	#registrations = $state<ToolRegistration[]>([]);
	activeKey = $state<string | null>(null);

	get tools(): DashboardTool[] {
		const current = highestRanked(this.#registrations);
		return current === null ? [] : current.tools;
	}

	get activeTool(): DashboardTool | null {
		return this.tools.find((tool) => tool.key === this.activeKey) ?? null;
	}

	register(owner: string, tools: DashboardTool[], rank: number): void {
		untrack(() => {
			this.#registrations = [...this.withoutOwner(owner), { owner, tools, rank }];
			this.closeIfGone();
		});
	}

	release(owner: string): void {
		untrack(() => {
			this.#registrations = this.withoutOwner(owner);
			this.closeIfGone();
		});
	}

	open(key: string | null): void {
		this.activeKey = key;
	}

	toggle(key: string): void {
		this.activeKey = this.activeKey === key ? null : key;
	}

	close(): void {
		this.activeKey = null;
	}

	private withoutOwner(owner: string): ToolRegistration[] {
		return this.#registrations.filter((registration) => registration.owner !== owner);
	}

	private closeIfGone(): void {
		if (this.activeTool === null) this.activeKey = null;
	}
}

function highestRanked(registrations: ToolRegistration[]): ToolRegistration | null {
	let highest: ToolRegistration | null = null;
	for (const registration of registrations) {
		if (highest === null || registration.rank >= highest.rank) highest = registration;
	}
	return highest;
}

const dashboardToolsKey = Symbol('dashboardTools');

export function provideDashboardTools(): DashboardTools {
	return setContext(dashboardToolsKey, new DashboardTools());
}

export function useDashboardTools(): DashboardTools {
	return getContext<DashboardTools>(dashboardToolsKey);
}
