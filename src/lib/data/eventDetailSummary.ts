export function summariseEventDetail(detail: Record<string, unknown>): string {
	return Object.values(detail).filter(Boolean).join(' · ');
}
