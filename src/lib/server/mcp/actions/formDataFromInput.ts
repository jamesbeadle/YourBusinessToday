export function formDataFromInput(input: Record<string, unknown>): FormData {
	const formData = new FormData();
	for (const [field, value] of Object.entries(withoutBlankFields(input))) {
		formData.set(field, String(value));
	}
	return formData;
}

export function withoutBlankFields(input: Record<string, unknown>): Record<string, unknown> {
	return Object.fromEntries(Object.entries(input).filter(([, value]) => !isBlank(value)));
}

function isBlank(value: unknown): boolean {
	return value === null || value === undefined || value === '';
}
