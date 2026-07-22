import { CanvasTexture, DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';
import type { Object3D } from 'three';
import { channelPortals, type ChannelPortal } from '$lib/data/channelPortals';

const CARD_PIXEL_WIDTH = 512;
const CARD_PIXEL_HEIGHT = 256;
const CARD_WORLD_WIDTH = 2.1;
const CARD_WORLD_HEIGHT = 1.05;
const CARD_CORNER_RADIUS = 28;
const CardText = {
	background: 'rgba(11, 14, 22, 0.88)',
	name: '#eef1f8',
	hint: 'rgba(238, 241, 248, 0.5)'
} as const;

function drawCard(context: CanvasRenderingContext2D, channel: ChannelPortal): void {
	context.fillStyle = CardText.background;
	context.beginPath();
	context.roundRect(6, 6, CARD_PIXEL_WIDTH - 12, CARD_PIXEL_HEIGHT - 12, CARD_CORNER_RADIUS);
	context.fill();
	context.strokeStyle = channel.accentColour;
	context.lineWidth = 5;
	context.stroke();
	context.textAlign = 'center';
	context.fillStyle = CardText.name;
	context.font = "500 58px 'Space Grotesk', sans-serif";
	context.fillText(channel.name, CARD_PIXEL_WIDTH / 2, 110);
	context.fillStyle = channel.accentColour;
	context.font = "400 34px 'Inter', sans-serif";
	context.fillText(channel.handle, CARD_PIXEL_WIDTH / 2, 162);
	context.fillStyle = CardText.hint;
	context.font = "400 24px 'Inter', sans-serif";
	context.fillText('click to visit ↗', CARD_PIXEL_WIDTH / 2, 214);
}

export const PORTAL_EVERY_CELLS = 3;
const PORTAL_SIDE_OFFSET = 2.3;

export function attachPortalToCell(cellRoot: Object3D, cellIndex: number): Mesh | null {
	if (cellIndex % PORTAL_EVERY_CELLS !== 0) return null;
	const channel = channelPortals[(cellIndex / PORTAL_EVERY_CELLS) % channelPortals.length];
	const card = createPortalCard(channel);
	card.position.x = cellIndex % 2 === 0 ? PORTAL_SIDE_OFFSET : -PORTAL_SIDE_OFFSET;
	cellRoot.add(card);
	return card;
}

export function createPortalCard(channel: ChannelPortal): Mesh {
	const canvas = document.createElement('canvas');
	canvas.width = CARD_PIXEL_WIDTH;
	canvas.height = CARD_PIXEL_HEIGHT;
	const context = canvas.getContext('2d');
	if (context) drawCard(context, channel);
	const material = new MeshBasicMaterial({
		map: new CanvasTexture(canvas),
		transparent: true,
		side: DoubleSide,
		depthWrite: false
	});
	const card = new Mesh(new PlaneGeometry(CARD_WORLD_WIDTH, CARD_WORLD_HEIGHT), material);
	card.userData.channelUrl = channel.url;
	return card;
}
