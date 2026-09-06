export function surnameOf(displayName: string): string {
	const words = displayName.trim().split(/\s+/);
	return words[words.length - 1] ?? '';
}

export function suggestedGroupNameFor(displayName: string): string {
	return `${surnameOf(displayName)} group`.trim();
}
