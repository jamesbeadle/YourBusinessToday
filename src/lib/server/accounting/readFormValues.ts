import { roundToPence } from '$lib/data/accounting/money';
import { AccountingError } from './accountingErrors';

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export function readText(formData: FormData, name: string): string {
	return String(formData.get(name) ?? '').trim();
}

export function readRequiredText(formData: FormData, name: string, label: string): string {
	const value = readText(formData, name);
	if (value === '') throw new AccountingError(`${label} is required.`);
	return value;
}

export function readMoneyField(formData: FormData, name: string, label: string): number {
	const value = Number(readText(formData, name));
	if (!Number.isFinite(value)) throw new AccountingError(`${label} must be a number.`);
	return roundToPence(value);
}

export function readPositiveMoneyField(formData: FormData, name: string, label: string): number {
	const value = readMoneyField(formData, name, label);
	if (value <= 0) throw new AccountingError(`${label} must be greater than zero.`);
	return value;
}

export function readDateField(formData: FormData, name: string, label: string): string {
	const value = readText(formData, name);
	if (!isoDatePattern.test(value)) throw new AccountingError(`${label} needs a valid date.`);
	return value;
}

export function readOptionalId(formData: FormData, name: string): string | null {
	const value = readText(formData, name);
	return value === '' ? null : value;
}

export function readWholeNumberField(formData: FormData, name: string, label: string): number {
	const value = Number(readText(formData, name));
	if (!Number.isInteger(value) || value < 0) {
		throw new AccountingError(`${label} must be a whole number.`);
	}
	return value;
}

export function readIsChecked(formData: FormData, name: string): boolean {
	return String(formData.get(name)) === 'true';
}
