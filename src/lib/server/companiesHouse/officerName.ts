const surnameFirstSeparator = ', ';

export function displayNameFromRegisterName(registerName: string): string {
	const [surname, forenames] = registerName.split(surnameFirstSeparator);
	if (forenames === undefined) return toTitleCase(surname.trim());
	return `${toTitleCase(forenames.trim())} ${toTitleCase(surname.trim())}`.trim();
}

export function displayNameFromSearchTitle(title: string): string {
	return toTitleCase(title.trim());
}

export function surnameOf(displayName: string): string {
	const words = displayName.trim().split(/\s+/);
	return words[words.length - 1] ?? '';
}

function toTitleCase(words: string): string {
	return words
		.toLowerCase()
		.split(/(\s+|-)/)
		.map(capitaliseWord)
		.join('');
}

function capitaliseWord(word: string): string {
	if (word === '') return word;
	return word.charAt(0).toUpperCase() + word.slice(1);
}
