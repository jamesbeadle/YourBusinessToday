import { dashboardMotion } from './dashboardMotion';
import type KbConstellation from '../KbConstellation.svelte';

type Stage = Pick<KbConstellation, 'focusSlot' | 'releaseFocus' | 'pause' | 'resume'>;

const restingDelayMilliseconds =
	dashboardMotion.flightMilliseconds + dashboardMotion.settleAfterFlightMilliseconds;

/**
 * Keeps the galaxy in step with the URL: a brain in the route means the camera
 * is inside it and the galaxy rests once the flight lands; none means the
 * galaxy spins on the ring. Landing directly on a brain cuts instead of flying.
 * Create inside a component.
 */
export class BrainFlight {
	#stage: () => Stage | undefined;
	#hasLanded = false;

	constructor(stage: () => Stage | undefined, openBrainId: () => string | null) {
		this.#stage = stage;
		$effect(() => {
			const brainId = openBrainId();
			const isDeepLink = !this.#hasLanded;
			this.#hasLanded = true;
			if (brainId === null) return this.flyOut();
			this.flyInto(brainId, isDeepLink);
			const restTimer = setTimeout(() => this.#stage()?.pause(), restingDelayMilliseconds);
			return () => clearTimeout(restTimer);
		});
	}

	flyInto(brainId: string, isInstant = false): void {
		this.#stage()?.resume();
		this.#stage()?.focusSlot(brainId, { isInstant });
	}

	flyOut(): void {
		this.#stage()?.resume();
		this.#stage()?.releaseFocus();
	}
}
