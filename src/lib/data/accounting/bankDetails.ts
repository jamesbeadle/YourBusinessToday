const sortCodeDigitLength = 6;
const sortCodePairPattern = /(\d{2})(?=\d)/g;

export function formatSortCode(sortCode: string): string {
	const digits = sortCode.replace(/\D/g, '');
	if (digits.length !== sortCodeDigitLength) return sortCode;
	return digits.replace(sortCodePairPattern, '$1-');
}

export function hasBankDetails(details: { bankAccountNumber: string; bankSortCode: string }): boolean {
	return details.bankAccountNumber !== '' && details.bankSortCode !== '';
}
