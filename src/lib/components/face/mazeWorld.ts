import { Fog, Group, Mesh, PerspectiveCamera, Raycaster, Scene, Vector2 } from 'three';
import { FacePalette } from './facePalette';
import { createGlyphField } from './glyphField';
import { mazePathPoint } from './mazePath';
import { attachPortalToCell } from './portalCard';
import { TesseractCell } from './tesseractCell';

const CELL_COUNT = 15;
const CELL_SPACING = 6;
const LOOP_LENGTH = CELL_COUNT * CELL_SPACING;
const CELL_SCALE = 2.1;
const CELL_OPACITY = 0.55;
const TRAVEL_SPEED = 4.0;
const RECYCLE_BEHIND = 5;
const STEER_REACH_X = 1.1;
const STEER_REACH_Y = 0.7;
const LOOK_AHEAD = 7;
const GLYPHS_PER_CHARACTER = 240;
const GLYPH_SPREAD = 4.5;
const GLYPH_POINT_SIZE = 0.34;
const FOG_NEAR = 4;
const FOG_FAR = 34;

type MazeCell = { root: Group; tesseract: TesseractCell };

export class MazeWorld {
	scene = new Scene();
	private cells: MazeCell[] = [];
	private cellDepths: number[] = [];
	private portalCards: Mesh[] = [];
	private glyphGroups: Group[] = [];
	private cameraDepth = 0;
	private steer = new Vector2();
	private raycaster = new Raycaster();

	constructor() {
		this.scene.fog = new Fog(FacePalette.night, FOG_NEAR, FOG_FAR);
		for (let index = 0; index < CELL_COUNT; index += 1) this.addCell(index);
		for (const section of [0, 1]) this.addGlyphSection(section);
	}

	private addCell(index: number): void {
		const cellColour = index % 2 === 0 ? FacePalette.go : FacePalette.chalk;
		const tesseract = new TesseractCell(CELL_SCALE, cellColour, CELL_OPACITY);
		const root = new Group();
		root.add(tesseract.lines);
		const portalCard = attachPortalToCell(root, index);
		if (portalCard) this.portalCards.push(portalCard);
		this.scene.add(root);
		this.cells.push({ root, tesseract });
		this.cellDepths.push(-(index + 1) * CELL_SPACING);
	}

	private addGlyphSection(section: number): void {
		const glyphs = createGlyphField(GLYPHS_PER_CHARACTER, GLYPH_POINT_SIZE, '#2fd48a', 0.4, () => ({
			x: (Math.random() * 2 - 1) * GLYPH_SPREAD,
			y: (Math.random() * 2 - 1) * GLYPH_SPREAD,
			z: -Math.random() * LOOP_LENGTH
		}));
		glyphs.position.z = -section * LOOP_LENGTH;
		this.scene.add(glyphs);
		this.glyphGroups.push(glyphs);
	}

	setSteer(x: number, y: number): void {
		this.steer.set(x, y);
	}

	update(deltaSeconds: number, timeSeconds: number, camera: PerspectiveCamera): void {
		this.cameraDepth -= TRAVEL_SPEED * deltaSeconds;
		const path = mazePathPoint(this.cameraDepth);
		camera.position.set(
			path.x + this.steer.x * STEER_REACH_X,
			path.y + this.steer.y * STEER_REACH_Y,
			this.cameraDepth
		);
		const ahead = mazePathPoint(this.cameraDepth - LOOK_AHEAD);
		camera.lookAt(ahead.x, ahead.y, this.cameraDepth - LOOK_AHEAD);
		this.cells.forEach((cell, index) => {
			if (this.cellDepths[index] > this.cameraDepth + RECYCLE_BEHIND)
				this.cellDepths[index] -= LOOP_LENGTH;
			const depth = this.cellDepths[index];
			const cellPath = mazePathPoint(depth);
			cell.root.position.set(cellPath.x, cellPath.y, depth);
			cell.tesseract.update(timeSeconds, index * 0.7);
		});
		for (const card of this.portalCards) card.lookAt(camera.position);
		for (const glyphs of this.glyphGroups)
			if (glyphs.position.z > this.cameraDepth + LOOP_LENGTH) glyphs.position.z -= 2 * LOOP_LENGTH;
	}

	pickPortalUrl(pointer: Vector2, camera: PerspectiveCamera): string | null {
		this.raycaster.setFromCamera(pointer, camera);
		const hits = this.raycaster.intersectObjects(this.portalCards, false);
		if (hits.length === 0) return null;
		return hits[0].object.userData.channelUrl as string;
	}
}
