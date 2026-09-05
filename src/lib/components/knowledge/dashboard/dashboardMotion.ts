import { cubicOut } from 'svelte/easing';

export const dashboardMotion = {
	flightMilliseconds: 900,
	settleAfterFlightMilliseconds: 200,
	viewFadeMilliseconds: 260,
	panelSlideMilliseconds: 220,
	scrimFadeMilliseconds: 150,
	dimmedSlotOpacity: 0.16
} as const;

export const flightEasing = cubicOut;
export const panelEasing = cubicOut;
