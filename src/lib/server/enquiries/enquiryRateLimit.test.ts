import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isEnquiryAllowedFrom } from './enquiryRateLimit';

const mostEnquiriesPerWindow = 5;
const windowMilliseconds = 10 * 60 * 1000;
const oneSecondMilliseconds = 1000;

function submitEnquiries(clientAddress: string, count: number): boolean[] {
	return Array.from({ length: count }, () => isEnquiryAllowedFrom(clientAddress));
}

describe('isEnquiryAllowedFrom', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-09-05T18:00:00Z'));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('allows the first five enquiries in a window and refuses the sixth', () => {
		const outcomes = submitEnquiries('203.0.113.1', mostEnquiriesPerWindow + 1);
		expect(outcomes.slice(0, mostEnquiriesPerWindow).every(Boolean)).toBe(true);
		expect(outcomes[mostEnquiriesPerWindow]).toBe(false);
	});

	it('keeps refusing until the oldest enquiry leaves the window', () => {
		const clientAddress = '203.0.113.2';
		submitEnquiries(clientAddress, mostEnquiriesPerWindow);
		vi.advanceTimersByTime(windowMilliseconds - oneSecondMilliseconds);
		expect(isEnquiryAllowedFrom(clientAddress)).toBe(false);
		vi.advanceTimersByTime(oneSecondMilliseconds);
		expect(isEnquiryAllowedFrom(clientAddress)).toBe(true);
	});

	it('counts each address on its own', () => {
		submitEnquiries('203.0.113.3', mostEnquiriesPerWindow);
		expect(isEnquiryAllowedFrom('203.0.113.3')).toBe(false);
		expect(isEnquiryAllowedFrom('203.0.113.4')).toBe(true);
	});

	it('does not extend the window by refusing', () => {
		const clientAddress = '203.0.113.5';
		submitEnquiries(clientAddress, mostEnquiriesPerWindow);
		vi.advanceTimersByTime(windowMilliseconds / 2);
		expect(isEnquiryAllowedFrom(clientAddress)).toBe(false);
		vi.advanceTimersByTime(windowMilliseconds / 2);
		expect(isEnquiryAllowedFrom(clientAddress)).toBe(true);
	});
});
