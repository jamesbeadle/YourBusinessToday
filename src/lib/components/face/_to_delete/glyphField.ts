import {
	AdditiveBlending, BufferAttribute, BufferGeometry, Group, Points, PointsMaterial
} from 'three';
import { createGlyphTexture } from './glyphTextures';

export type GlyphPlacement = () => { x: number; y: number; z: number };

const DEFAULT_GLYPH_CHARACTERS = ['{', '0', '>'];

export function createGlyphField(
	pointsPerCharacter: number,
	pointSize: number,
	colourCss: string,
	opacity: number,
	placeGlyph: GlyphPlacement,
	characters: string[] = DEFAULT_GLYPH_CHARACTERS
): Group {
	const group = new Group();
	for (const character of characters) {
		const positions = new Float32Array(pointsPerCharacter * 3);
		for (let index = 0; index < pointsPerCharacter; index += 1) {
			const place = placeGlyph();
			positions.set([place.x, place.y, place.z], index * 3);
		}
		const geometry = new BufferGeometry();
		geometry.setAttribute('position', new BufferAttribute(positions, 3));
		const material = new PointsMaterial({
			map: createGlyphTexture(character, colourCss),
			size: pointSize,
			transparent: true,
			opacity,
			depthWrite: false,
			blending: AdditiveBlending
		});
		const points = new Points(geometry, material);
		points.frustumCulled = false;
		group.add(points);
	}
	return group;
}
