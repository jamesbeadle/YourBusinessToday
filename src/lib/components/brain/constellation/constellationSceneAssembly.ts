import { Color, Group, Scene } from 'three';
import { createAmbientNeuralWeb, type AmbientNeuralWeb, type ClearZone } from './ambientNeuralWeb';
import { membraneRadiusOf } from './cellSoma';
import { neuronProportions, nucleusProportions } from './neuronProportions';
import { createFiringPulses, type FiringPulses } from './firingPulses';
import { createGlowTexture } from './glowTexture';
import { createMaterialBank, type MaterialBank } from './materialBank';
import { createCellSkinBank, type CellSkinBank } from './cellSkinBank';
import { createNeuronField, type NeuronField } from './neuronField';
import { createNucleusLabels, disposeNucleusLabels } from './nucleusLabels';
import { createSettleFlashes, type SettleFlashes } from './settleFlash';
import { createStarBackdrop } from './starBackdrop';
import { createSynapseWeb, type SynapseWeb } from './synapseWeb';
import { NIGHT_SKY } from './constellationPalette';
import type { ConstellationModel } from './constellationTypes';

const CLEARANCE_SHARE = 2.2;

export type ConstellationScene = {
	scene: Scene;
	readonly field: NeuronField;
	readonly web: SynapseWeb;
	readonly pulses: FiringPulses;
	ambient: AmbientNeuralWeb;
	flashes: SettleFlashes;
	bank: MaterialBank;
	skins: CellSkinBank;
	rebuild: (model: ConstellationModel) => void;
	dispose: () => void;
};

export function assembleConstellationScene(model: ConstellationModel): ConstellationScene {
	const scene = new Scene();
	scene.background = new Color(NIGHT_SKY);

	const glowTexture = createGlowTexture();
	const bank = createMaterialBank(glowTexture);
	const skins = createCellSkinBank();
	const backdrop = createStarBackdrop();
	const ambient = createAmbientNeuralWeb(glowTexture);
	const flashes = createSettleFlashes(glowTexture);
	scene.add(backdrop.points, ambient.group, flashes.group);

	let field: NeuronField;
	let web: SynapseWeb;
	let pulses: FiringPulses;
	let labels: Group;

	function mountModel(mountedModel: ConstellationModel): void {
		field = createNeuronField(mountedModel, bank, skins);
		web = createSynapseWeb(mountedModel, bank);
		pulses = createFiringPulses(web.curves, glowTexture);
		labels = createNucleusLabels(mountedModel.nuclei);
		ambient.keepClearOf(cellZonesOf(mountedModel));
		scene.add(field.group, web.group, pulses.group, labels);
	}

	function unmountModel(): void {
		scene.remove(field.group, web.group, pulses.group, labels);
		field.dispose();
		web.dispose();
		pulses.dispose();
		disposeNucleusLabels(labels);
	}

	mountModel(model);

	function rebuild(rebuiltModel: ConstellationModel): void {
		unmountModel();
		mountModel(rebuiltModel);
	}

	function dispose(): void {
		unmountModel();
		backdrop.dispose();
		ambient.dispose();
		flashes.dispose();
		bank.dispose();
		skins.dispose();
		glowTexture.dispose();
	}

	return {
		scene,
		get field() {
			return field;
		},
		get web() {
			return web;
		},
		get pulses() {
			return pulses;
		},
		ambient,
		flashes,
		bank,
		skins,
		rebuild,
		dispose
	};
}

function cellZonesOf(model: ConstellationModel): ClearZone[] {
	return [
		...model.neurons.map((neuron) => ({
			centre: neuron.position,
			radius: membraneRadiusOf(neuron.slug, neuronProportions) * CLEARANCE_SHARE
		})),
		...model.nuclei.map((nucleus) => ({
			centre: nucleus.position,
			radius: membraneRadiusOf(nucleus.slug, nucleusProportions) * CLEARANCE_SHARE
		}))
	];
}
