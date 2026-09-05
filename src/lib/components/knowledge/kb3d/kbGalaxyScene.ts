import { assembleKbGalaxy, type KbGalaxy } from './kbGalaxyAssembly';
import { attachKbGalaxyInput, type KbGalaxyInput } from './kbGalaxyInput';
import type { Camera } from 'three';
import type { ConstellationSlot } from '../constellationSlots';

export type KbGalaxyScene = {
	galaxy: () => KbGalaxy;
	replace: (slots: ConstellationSlot[]) => void;
	dispose: () => void;
};

/** The assembled galaxy and its pointer input, rebuilt together whenever the slots change. */
export function createKbGalaxyScene(options: {
	canvas: HTMLCanvasElement;
	camera: Camera;
	initialSlots: ConstellationSlot[];
	onHover: (slot: ConstellationSlot | null) => void;
	onActivate: (slot: ConstellationSlot) => void;
}): KbGalaxyScene {
	let galaxy = assembleKbGalaxy(options.initialSlots);
	let input = attachInput();

	function attachInput(): KbGalaxyInput {
		return attachKbGalaxyInput({
			canvas: options.canvas,
			camera: options.camera,
			handles: galaxy.handles,
			onHover: options.onHover,
			onActivate: options.onActivate
		});
	}

	function dispose(): void {
		input.detach();
		galaxy.dispose();
	}

	function replace(slots: ConstellationSlot[]): void {
		dispose();
		galaxy = assembleKbGalaxy(slots);
		input = attachInput();
	}

	return { galaxy: () => galaxy, replace, dispose };
}
