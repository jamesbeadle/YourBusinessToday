const mostEnquiriesPerWindow = 5;
const windowMilliseconds = 10 * 60 * 1000;
const mostTrackedAddresses = 10_000;

const enquiryTimesByAddress = new Map<string, number[]>();

export function isEnquiryAllowedFrom(clientAddress: string): boolean {
	const now = Date.now();
	forgetQuietAddressesWhenCrowded(now);
	const recentTimes = timesWithinWindow(enquiryTimesByAddress.get(clientAddress) ?? [], now);
	if (recentTimes.length >= mostEnquiriesPerWindow) {
		enquiryTimesByAddress.set(clientAddress, recentTimes);
		return false;
	}
	enquiryTimesByAddress.set(clientAddress, [...recentTimes, now]);
	return true;
}

function timesWithinWindow(times: number[], now: number): number[] {
	return times.filter((time) => now - time < windowMilliseconds);
}

function forgetQuietAddressesWhenCrowded(now: number): void {
	if (enquiryTimesByAddress.size < mostTrackedAddresses) return;
	for (const [address, times] of enquiryTimesByAddress) {
		if (timesWithinWindow(times, now).length === 0) enquiryTimesByAddress.delete(address);
	}
}
