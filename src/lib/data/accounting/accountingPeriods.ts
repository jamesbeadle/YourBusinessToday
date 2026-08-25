export type MonthKey = string;

const isoDateLength = 10;
const monthKeyLength = 7;

export function toIsoDate(date: Date): string {
	return date.toISOString().slice(0, isoDateLength);
}

export function toMonthKey(isoDate: string): MonthKey {
	return isoDate.slice(0, monthKeyLength);
}

export function currentMonthKey(): MonthKey {
	return toMonthKey(toIsoDate(new Date()));
}

export function monthStart(monthKey: MonthKey): string {
	return `${monthKey}-01`;
}

export function monthEnd(monthKey: MonthKey): string {
	const [year, month] = splitMonthKey(monthKey);
	return toIsoDate(new Date(Date.UTC(year, month, 0)));
}

export function shiftMonth(monthKey: MonthKey, monthsToAdd: number): MonthKey {
	const [year, month] = splitMonthKey(monthKey);
	return toMonthKey(toIsoDate(new Date(Date.UTC(year, month - 1 + monthsToAdd, 1))));
}

export function financialYearStart(monthKey: MonthKey, startMonth: number): string {
	const [year, month] = splitMonthKey(monthKey);
	const startYear = month >= startMonth ? year : year - 1;
	return toIsoDate(new Date(Date.UTC(startYear, startMonth - 1, 1)));
}

export function formatMonth(monthKey: MonthKey): string {
	const [year, month] = splitMonthKey(monthKey);
	return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('en-GB', {
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC'
	});
}

export function formatIsoDate(isoDate: string): string {
	return new Date(isoDate).toLocaleDateString('en-GB', { timeZone: 'UTC' });
}

export function addDays(isoDate: string, days: number): string {
	const date = new Date(isoDate);
	date.setUTCDate(date.getUTCDate() + days);
	return toIsoDate(date);
}

function splitMonthKey(monthKey: MonthKey): [number, number] {
	const [year, month] = monthKey.split('-').map(Number);
	return [year, month];
}
