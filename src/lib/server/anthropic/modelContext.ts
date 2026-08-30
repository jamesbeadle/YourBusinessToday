import { AsyncLocalStorage } from 'node:async_hooks';

type ModelResolver = () => Promise<string | null>;

const modelContextStorage = new AsyncLocalStorage<{ resolveOverride: ModelResolver }>();

export function runWithModelResolver<T>(resolveOverride: ModelResolver, run: () => T): T {
	return modelContextStorage.run({ resolveOverride }, run);
}

export async function requestModelOverride(): Promise<string | null> {
	const context = modelContextStorage.getStore();
	if (context === undefined) return null;
	return context.resolveOverride();
}
