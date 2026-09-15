const needsQuoting = /[",\n\r]/;

export function csvLine(values: string[]): string {
	return values.map(csvField).join(',');
}

function csvField(value: string): string {
	if (!needsQuoting.test(value)) return value;
	return `"${value.replaceAll('"', '""')}"`;
}
