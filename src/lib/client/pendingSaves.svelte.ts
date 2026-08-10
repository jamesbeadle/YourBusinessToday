/**
 * Global count of in-flight database saves. FormTracker increments it for
 * every form-action submission, so the app-wide SavingOverlay can react to
 * "something is saving" without any per-form wiring. Call begin()/end()
 * manually around bespoke fetch() mutations to get the same overlay.
 */
let pendingCount = $state(0);

export const pendingSaves = {
	/** True while at least one save is in flight. */
	get isActive(): boolean {
		return pendingCount > 0;
	},
	begin(): void {
		pendingCount += 1;
	},
	end(): void {
		pendingCount = Math.max(0, pendingCount - 1);
	}
};
