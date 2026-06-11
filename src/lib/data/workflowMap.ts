import { financeLine } from './financeLine';
import { marketingLine } from './marketingLine';
import { operationsLine } from './operationsLine';
import { salesLine } from './salesLine';
import type { RoleLine } from './types';

export const workflowLines: RoleLine[] = [marketingLine, salesLine, operationsLine, financeLine];

export const mapViewBox = { width: 920, height: 620 };
