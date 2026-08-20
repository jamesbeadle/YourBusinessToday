import { Color, Group, Scene, Vector3 } from 'three';
import { createAmbientNeuralWeb, type AmbientNeuralWeb } from './ambientNeuralWeb';
import { createFiringPulses, type FiringPulses } from './firingPulses';
import { createGlowTexture } from './glowTexture';
import { createMaterialBank, type MaterialBank } from './materialBank';
import { createNeuronField, type NeuronField } from './neuronField';
import { createStarBackdrop } from './starBackdrop';
import { createSynapseWeb, type SynapseWeb } from './synapseWeb';
import { createTextSprite } from './textSprite';
import { asCssColour, NIGHT_SKY, SIGNAL, SILVER } from './constellationPalette';
import type { ConstellationModel, Nucleus } from './constellationTypes';

const LABEL_LIFT = 0.85;

export type ConstellationScene = {
	scene: Scene;
	field: NeuronField;
	web: SynapseWeb;
	pulses: FiringPulses;
	ambient: AmbientNeuralWeb;
	bank: MaterialBank;
	dispose: () => void;
};

export function assembleConstellationScene(model: ConstellationModel): ConstellationScene {
	const scene = new Scene();
	scene.background = new Color(NIGHT_SKY);

	const glowTexture = createGlowTexture();
	const bank = createMaterialBank(glowTexture);
	const backdrop = createStarBackdrop();
	const ambient = createAmbientNeuralWeb();
	const field = createNeuronField(model, bank);
	const web = createSynapseWeb(model.synapses);
	const pulses = createFiringPulses(web.curves, glowTexture);
	const labels = nucleusLabels(model.nuclei);
	scene.add(backdrop.points, ambient.group, field.group, web.group, pulses.group, labels);

	function dispose(): void {
		backdrop.dispose();
		ambient.dispose();
		field.dispose();
		web.dispose();
		pulses.dispose();
		bank.dispose();
		glowTexture.dispose();
	}

	return { scene, field, web, pulses, ambient, bank, dispose };
}

function nucleusLabels(nuclei: Nucleus[]): Group {
	const labels = new Group();
	for (const nucleus of nuclei) {
		const colour = nucleus.isCoreDomain ? asCssColour(SIGNAL) : asCssColour(SILVER);
		const label = createTextSprite(nucleus.name.toUpperCase(), colour);
		label.position.copy(nucleus.position).add(new Vector3(0, nucleus.clusterRadius + LABEL_LIFT, 0));
		labels.add(label);
	}
	return labels;
}
