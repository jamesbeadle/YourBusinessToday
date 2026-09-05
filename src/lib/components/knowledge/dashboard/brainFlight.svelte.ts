import { dashboardMotion } from './dashboardMotion';
import { pageVisibility } from '$lib/client/pageVisibility.svelte';
import { getContext, setContext } from 'svelte';
import type KbConstellation from '../KbConstellation.svelte';

type Stage = Pick<KbConstellation, 'focusSlot' | 'releaseFocus' | 'pause' | 'resume' | 'hide' | 'show'>;

const restingDelayMilliseconds =
	dashboardMotion.flightMilliseconds + dashboardMotion.settleAfterFlightMilliseconds;

/**
 * Keeps the galaxy in step with the URL: a brain in the route means the camera
 * is inside it and the galaxy rests unseen once the flight lands; none means
 * the galaxy spins on the ring. Landing directly on a brain cuts instead of
 * flying, and a hidden page rests the galaxy until it is seen again.
 * Create inside a component.
 */
export class BrainFlight {
	#stage: () => Stage | undefined;
	#openBrainId: () => string | null;
	#hasLanded = false;
	#isInFlight = $state(false);

	constructor(stage: () => Stage | undefined, openBrainId: () => string | null) {
		this.#stage = stage;
		this.#openBrainId = openBrainId;
		$effect(() => this.followRoute());
		$effect(() => this.restWhileHidden());
	}

	/** A view entered by flight waits for the camera to land; a deep link shows it at once. */
	get viewFadeDelayMilliseconds(): number {
		return this.#isInFlight ? dashboardMotion.flightMilliseconds : 0;
	}

	flyInto(brainId: string, isInstant = false): void {
		this.#isInFlight = !isInstant;
		this.wake();
		this.#stage()?.focusSlot(brainId, { isInstant });
	}

	flyOut(): void {
		this.#isInFlight = false;
		this.wake();
		this.#stage()?.releaseFocus();
	}

	private wake(): void {
		this.#stage()?.show();
		this.#stage()?.resume();
	}

	private followRoute(): (() => void) | void {
		const brainId = this.#openBrainId();
		const isDeepLink = !this.#hasLanded;
		this.#hasLanded = true;
		if (brainId === null) return this.flyOut();
		this.flyInto(brainId, isDeepLink);
		const restTimer = setTimeout(() => this.rest(), restingDelayMilliseconds);
		return () => clearTimeout(restTimer);
	}

	private rest(): void {
		this.#isInFlight = false;
		this.#stage()?.pause();
		this.#stage()?.hide();
	}

	private restWhileHidden(): void {
		if (pageVisibility.isHidden) return this.#stage()?.pause();
		if (this.#openBrainId() === null) this.#stage()?.resume();
	}
}

const brainFlightKey = Symbol('brainFlight');

export function provideBrainFlight(flight: BrainFlight): BrainFlight {
	return setContext(brainFlightKey, flight);
}

export function useBrainFlight(): BrainFlight {
	return getContext<BrainFlight>(brainFlightKey);
}
