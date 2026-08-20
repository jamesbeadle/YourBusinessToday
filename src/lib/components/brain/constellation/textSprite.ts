import { CanvasTexture, Sprite, SpriteMaterial } from 'three';

const FONT_SIZE_PIXELS = 44;
const FONT = `600 ${FONT_SIZE_PIXELS}px 'Space Grotesk', 'Inter', sans-serif`;
const PADDING_PIXELS = 18;
const LABEL_HEIGHT_UNITS = 0.62;
const LABEL_OPACITY = 0.92;

export function createTextSprite(text: string, colourCss: string): Sprite {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	if (context === null) return new Sprite();

	context.font = FONT;
	canvas.width = Math.ceil(context.measureText(text).width) + PADDING_PIXELS * 2;
	canvas.height = FONT_SIZE_PIXELS + PADDING_PIXELS * 2;
	context.font = FONT;
	context.textBaseline = 'middle';
	context.fillStyle = colourCss;
	context.fillText(text, PADDING_PIXELS, canvas.height / 2);

	const material = new SpriteMaterial({
		map: new CanvasTexture(canvas),
		transparent: true,
		opacity: LABEL_OPACITY,
		depthWrite: false
	});
	const sprite = new Sprite(material);
	const aspect = canvas.width / canvas.height;
	sprite.scale.set(LABEL_HEIGHT_UNITS * aspect, LABEL_HEIGHT_UNITS, 1);
	return sprite;
}
