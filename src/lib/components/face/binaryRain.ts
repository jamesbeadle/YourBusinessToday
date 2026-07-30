import { Group } from 'three';
import { createGlyphField } from './glyphField';

const GLYPHS_PER_CHARACTER = 190;
const GLYPH_SIZE = 0.24;
const RAIN_COLOUR = '#3fb0ff';
const RAIN_OPACITY = 0.34;
const SPAN_X = 7;
const SPAN_Y = 4.5;
const DEPTH_NEAR = -2.6;
const DEPTH_RANGE = 1.5;
const FALL_SPEED = 0.4;
const SECTION_HEIGHT = SPAN_Y * 2;

export type BinaryRain = { group: Group; update: (deltaSeconds: number) => void };

export function createBinaryRain(): BinaryRain {
	const group = new Group();
	const sections: Group[] = [];
	for (const index of [0, 1]) {
		const section = createGlyphField(
			GLYPHS_PER_CHARACTER,
			GLYPH_SIZE,
			RAIN_COLOUR,
			RAIN_OPACITY,
			() => ({
				x: (Math.random() * 2 - 1) * SPAN_X,
				y: (Math.random() * 2 - 1) * SPAN_Y,
				z: DEPTH_NEAR - Math.random() * DEPTH_RANGE
			}),
			['0', '1']
		);
		section.position.y = index * SECTION_HEIGHT;
		group.add(section);
		sections.push(section);
	}
	function update(deltaSeconds: number): void {
		for (const section of sections) {
			section.position.y -= FALL_SPEED * deltaSeconds;
			if (section.position.y < -SECTION_HEIGHT) section.position.y += SECTION_HEIGHT * 2;
		}
	}
	return { group, update };
}
