const poundsFormatter = new Intl.NumberFormat('en-GB', {
	style: 'currency',
	currency: 'GBP',
	minimumFractionDigits: 2
});

const penceInPound = 100;

export function formatMoney(amount: number): string {
	return poundsFormatter.format(amount);
}

export function roundToPence(amount: number): number {
	return Math.round(amount * penceInPound) / penceInPound;
}

export function sumMoney(amounts: number[]): number {
	return roundToPence(amounts.reduce((total, amount) => total + amount, 0));
}
