import { complianceLine } from './complianceLine';
import { financeDirectorLine } from './financeDirectorLine';
import { healthSafetyLine } from './healthSafetyLine';
import { projectManagerLine } from './projectManagerLine';
import { quantitySurveyorLine } from './quantitySurveyorLine';
import { siteManagerLine } from './siteManagerLine';
import type { RoleLine } from './types';

export const workflowLines: RoleLine[] = [
	complianceLine,
	projectManagerLine,
	quantitySurveyorLine,
	siteManagerLine,
	healthSafetyLine,
	financeDirectorLine
];

export const mapViewBox = { width: 980, height: 640 };
