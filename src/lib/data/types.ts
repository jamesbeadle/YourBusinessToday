export type Point = { x: number; y: number };

export type StationTask = {
	summary: string;
	inputs: string[];
	outputs: string[];
};

export type Station = {
	id: string;
	name: string;
	position: Point;
	isInterchange: boolean;
	connectingRoles: string[];
	tickAngle: number;
	labelOffset: Point;
	labelAnchor: 'start' | 'middle' | 'end';
	task: StationTask;
};

export type RoleLine = {
	id: string;
	role: string;
	colour: string;
	route: Point[];
	stations: Station[];
};
