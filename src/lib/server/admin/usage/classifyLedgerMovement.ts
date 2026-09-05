import type { LedgerMovement } from './getLedgerMovements';

export type LedgerMovementKind = 'bought' | 'granted' | 'spent' | 'refunded';

const purchaseReasonPrefix = 'purchase:';
const refundReasonSuffix = '_refund';

// Bought credits came through a paid pack; a refund hands a spend back;
// every other credit in is a grant (welcome, promo, gift, earning); every
// credit out is a spend.
export function classifyLedgerMovement(movement: LedgerMovement): LedgerMovementKind {
	if (movement.delta < 0) return 'spent';
	if (movement.reason.startsWith(purchaseReasonPrefix)) return 'bought';
	if (movement.reason.endsWith(refundReasonSuffix)) return 'refunded';
	return 'granted';
}
