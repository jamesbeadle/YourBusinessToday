import {
	AdditiveBlending,
	BufferGeometry,
	Color,
	Float32BufferAttribute,
	Group,
	LineBasicMaterial,
	LineSegments,
	Points,
	PointsMaterial,
	Sprite,
	SpriteMaterial,
	type Texture
} from 'three';
import { flattenSamples, linkPositions } from './miniBrainGeometry';
import { sampleItemBrainPoints } from './itemBrainGeometry';

const NEURON_SIZE = 0.42;
const HALO_SCALE = 10;

export type ItemBrainCloud = { group: Group; dispose: () => void };

export function buildItemBrainCloud(
	seed: string,
	accentCss: string,
	itemCount: number,
	glowTexture: Texture
): ItemBrainCloud {
	const accent = new Color(accentCss);
	const samples = sampleItemBrainPoints(seed, itemCount);
	const group = new Group();
	const disposers: (() => void)[] = [];

	const pointGeometry = new BufferGeometry();
	pointGeometry.setAttribute('position', new Float32BufferAttribute(flattenSamples(samples), 3));
	const pointMaterial = new PointsMaterial({
		map: glowTexture,
		color: accent,
		size: NEURON_SIZE,
		transparent: true,
		opacity: 0.85,
		blending: AdditiveBlending,
		depthWrite: false
	});
	group.add(new Points(pointGeometry, pointMaterial));
	disposers.push(() => pointGeometry.dispose(), () => pointMaterial.dispose());

	const linkGeometry = new BufferGeometry();
	linkGeometry.setAttribute('position', new Float32BufferAttribute(linkPositions(samples), 3));
	const linkMaterial = new LineBasicMaterial({
		color: accent,
		transparent: true,
		opacity: 0.22,
		blending: AdditiveBlending,
		depthWrite: false
	});
	group.add(new LineSegments(linkGeometry, linkMaterial));
	disposers.push(() => linkGeometry.dispose(), () => linkMaterial.dispose());

	const haloMaterial = new SpriteMaterial({
		map: glowTexture,
		color: accent,
		transparent: true,
		opacity: 0.12,
		blending: AdditiveBlending,
		depthWrite: false
	});
	const halo = new Sprite(haloMaterial);
	halo.scale.setScalar(HALO_SCALE);
	group.add(halo);
	disposers.push(() => haloMaterial.dispose());

	return { group, dispose: () => disposers.forEach((dispose) => dispose()) };
}
