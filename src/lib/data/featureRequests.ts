export type FeatureRequestStatus = 'new' | 'accepted' | 'declined';

export const featureRequestStatusOrder: FeatureRequestStatus[] = ['new', 'accepted', 'declined'];

export const featureRequestStatusLabels: Record<FeatureRequestStatus, string> = {
	new: 'Awaiting triage',
	accepted: 'Accepted',
	declined: 'Declined'
};

const referenceDigits = 4;

export function parseFeatureRequestStatus(value: unknown): FeatureRequestStatus {
	const status = featureRequestStatusOrder.find((candidate) => candidate === value);
	if (status === undefined) return 'new';
	return status;
}

export function featureRequestReference(requestNumber: number): string {
	return `FR-${String(requestNumber).padStart(referenceDigits, '0')}`;
}
