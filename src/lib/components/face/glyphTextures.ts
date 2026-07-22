import { CanvasTexture } from 'three';

const GLYPH_CANVAS_SIZE = 64;

export function createGlyphTexture(character: string, colourCss: string): CanvasTexture {
	const canvas = document.createElement('canvas');
	canvas.width = GLYPH_CANVAS_SIZE;
	canvas.height = GLYPH_CANVAS_SIZE;
	const context = canvas.getContext('2d');
	if (context) {
		context.font = `700 ${GLYPH_CANVAS_SIZE * 0.72}px 'Space Grotesk', monospace`;
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillStyle = colourCss;
		context.fillText(character, GLYPH_CANVAS_SIZE / 2, GLYPH_CANVAS_SIZE / 2);
	}
	return new CanvasTexture(canvas);
}
