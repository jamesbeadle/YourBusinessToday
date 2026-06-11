import { labelBaseline, labelLineHeight, stationLabelLines } from '../src/lib/components/map/stationLabel';
import { workflowLines } from '../src/lib/data/workflowMap';
import type { Point, Station } from '../src/lib/data/types';

const approximateCharacterWidth = 7.2;
const lineClearance = 6;
const labelGap = 2;
const glyphAscent = 10;
const glyphDescent = 3;

type LabelBox = { stationId: string; text: string; left: number; right: number; top: number; bottom: number };
type LineSegment = { lineId: string; start: Point; end: Point };

function anchoredLeft(station: Station, width: number): number {
	const anchorX = station.position.x + station.labelOffset.x;
	if (station.labelAnchor === 'middle') return anchorX - width / 2;
	if (station.labelAnchor === 'start') return anchorX;
	return anchorX - width;
}

function labelBoxes(): LabelBox[] {
	const boxes: LabelBox[] = [];
	for (const line of workflowLines) {
		for (const station of line.stations) {
			const textLines = stationLabelLines(station.name);
			const firstBaseline = labelBaseline(station.position.y, station.labelOffset.y, textLines.length);
			textLines.forEach((text, lineIndex) => {
				const width = text.length * approximateCharacterWidth;
				const bottom = firstBaseline + lineIndex * labelLineHeight + glyphDescent;
				const left = anchoredLeft(station, width);
				boxes.push({ stationId: station.id, text, left, right: left + width, top: bottom - glyphDescent - glyphAscent, bottom });
			});
		}
	}
	return boxes;
}

function lineSegments(): LineSegment[] {
	const segments: LineSegment[] = [];
	for (const line of workflowLines) {
		for (const route of line.routes) {
			for (let pointIndex = 0; pointIndex < route.length - 1; pointIndex++) {
				segments.push({ lineId: line.id, start: route[pointIndex], end: route[pointIndex + 1] });
			}
		}
	}
	return segments;
}

function segmentEntersBox(segment: LineSegment, box: LabelBox): Point | null {
	for (let progress = 0; progress <= 1; progress += 0.002) {
		const x = segment.start.x + (segment.end.x - segment.start.x) * progress;
		const y = segment.start.y + (segment.end.y - segment.start.y) * progress;
		const isInsideHorizontally = x > box.left - lineClearance && x < box.right + lineClearance;
		const isInsideVertically = y > box.top - lineClearance && y < box.bottom + lineClearance;
		if (isInsideHorizontally && isInsideVertically) return { x: Math.round(x), y: Math.round(y) };
	}
	return null;
}

function boxesOverlap(first: LabelBox, second: LabelBox): boolean {
	if (first.stationId === second.stationId) return false;
	const overlapHorizontally = first.left < second.right + labelGap && second.left < first.right + labelGap;
	const overlapVertically = first.top < second.bottom + labelGap && second.top < first.bottom + labelGap;
	return overlapHorizontally && overlapVertically;
}

const boxes = labelBoxes();
let issueCount = 0;

for (const box of boxes) {
	for (const segment of lineSegments()) {
		const crossing = segmentEntersBox(segment, box);
		if (crossing === null) continue;
		console.log(`LINE CROSS: "${box.text}" (${box.stationId}) crossed by ${segment.lineId} near ${crossing.x},${crossing.y}`);
		issueCount += 1;
	}
}

for (let firstIndex = 0; firstIndex < boxes.length; firstIndex++) {
	for (let secondIndex = firstIndex + 1; secondIndex < boxes.length; secondIndex++) {
		if (!boxesOverlap(boxes[firstIndex], boxes[secondIndex])) continue;
		const [first, second] = [boxes[firstIndex], boxes[secondIndex]];
		console.log(`LABEL OVERLAP: "${first.text}" (${first.stationId}) vs "${second.text}" (${second.stationId})`);
		issueCount += 1;
	}
}

console.log(issueCount === 0 ? 'ALL CLEAR' : `${issueCount} issues`);
process.exit(issueCount === 0 ? 0 : 1);
