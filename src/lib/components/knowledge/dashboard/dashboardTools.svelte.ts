import { getContext, setContext, type Snippet } from 'svelte';

export type DashboardTool = {
	key: string;
	label: string;
	iconPaths: string[];
	panel: Snippet;
};

type ToolRegistration = { owner: string; tools: DashboardTool[] };

/**
 * The toolbar's contents and which panel is open. Whoever owns a set of tools
 * registers it; the most recent registration is the one on show, so a brain's
 * tools replace the knowledge base's while the brain is open.
 */
export class DashboardTools {
	#registrations = $state<ToolRegistration[]>([]);
	activeKey = $state<string | null>(null);

	get tools(): DashboardTool[] {
		const current = this.#registrations.at(-1);
		return current === undefined ? [] : current.tools;
	}

	get activeTool(): DashboardTool | null {
		return this.tools.find((tool) => tool.key === this.activeKey) ?? null;
	}

	register(owner: string, tools: DashboardTool[]): void {
		this.#registrations = [...this.withoutOwner(owner), { owner, tools }];
		this.closeIfGone();
	}

	release(owner: string): void {
		this.#registrations = this.withoutOwner(owner);
		this.closeIfGone();
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

const dashboardToolsKey = Symbol('dashboardTools');

export function provideDashboardTools(): DashboardTools {
	return setContext(dashboardToolsKey, new DashboardTools());
}

export function useDashboardTools(): DashboardTools {
	return getContext<DashboardTools>(dashboardToolsKey);
}
