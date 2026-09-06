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
	#landingTime: number | null = null;
	#landingTimer: ReturnType<typeof setTimeout> | undefined;

	constructor(stage: () => Stage | undefined, openBrainId: () => string | null) {
		this.#stage = stage;
		this.#openBrainId = openBrainId;
		$effect(() => this.followRoute());
		$effect(() => this.restWhileHidden());
	}

	/** A view entered by flight waits for the camera to land; a deep link, or a landed camera, shows it at once. */
	get viewFadeDelayMilliseconds(): number {
		if (this.#landingTime === null) return 0;
		return Math.max(0, this.#landingTime - Date.now());
	}

	flyInto(brainId: string, isInstant = false): void {
		this.beginFlight(isInstant);
		this.wake();
		this.#stage()?.focusSlot(brainId, { isInstant });
	}

	flyOut(): void {
		this.land();
		this.wake();
		this.#stage()?.releaseFocus();
	}

	private beginFlight(isInstant: boolean): void {
		if (isInstant) return this.land();
		clearTimeout(this.#landingTimer);
		this.#landingTime = Date.now() + dashboardMotion.flightMilliseconds;
		this.#landingTimer = setTimeout(() => this.land(), dashboardMotion.flightMilliseconds);
	}

	private land(): void {
		clearTimeout(this.#landingTimer);
		this.#landingTime = null;
	}

	private wake(): void {
		this.#stage()?.show();
		this.#stage()?.resume();
	}

	private followRoute(): (() => void) | void {
		if (this.#stage() === undefined) return;
		const brainId = this.#openBrainId();
		const isDeepLink = !this.#hasLanded;
		this.#hasLanded = true;
		if (brainId === null) return this.flyOut();
		this.flyInto(brainId, isDeepLink);
		const restTimer = setTimeout(() => this.rest(), restingDelayMilliseconds);
		return () => clearTimeout(restTimer);
	}

	private rest(): void {
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
