import { creditsPerBrainIngest } from '$lib/data/creditPricing';
import { ingestSource, uploadSourceFile, type UploadOutcome } from '../uploadSourceFile';
import { invalidateAll } from '$app/navigation';

export type TerminalIngest = {
	ingestDroppedFile: (file: File) => Promise<void>;
	ingestLinkedPage: (pageUrl: string) => Promise<void>;
};

export function createTerminalIngest(dependencies: {
	brainId: string;
	appendLine: (line: string) => void;
	onOutOfCredits: () => void;
}): TerminalIngest {
	const { brainId, appendLine, onOutOfCredits } = dependencies;

	async function ingestDroppedFile(file: File): Promise<void> {
		appendLine(`⇡ reading ${file.name} — ${creditsPerBrainIngest} credits`);
		const outcome = await uploadSourceFile(file, brainId);
		if (outcome.status === 'out_of_credits') return onOutOfCredits();
		appendLine(verdictFor(file.name, outcome));
		await invalidateAll();
	}

	async function ingestLinkedPage(pageUrl: string): Promise<void> {
		appendLine(`⇡ reading ${new URL(pageUrl).host} — ${creditsPerBrainIngest} credits`);
		const response = await fetch('/api/brain/sources/link', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ brainId, url: pageUrl })
		});
		if (!response.ok) {
			const payload = await response.json().catch(() => null);
			appendLine(`✗ ${payload?.message ?? 'that link could not be read'}`);
			return;
		}
		const { sourceId, title } = await response.json();
		const outcome = await ingestSource(sourceId);
		if (outcome.status === 'out_of_credits') return onOutOfCredits();
		appendLine(verdictFor(title, outcome));
		await invalidateAll();
	}

	return { ingestDroppedFile, ingestLinkedPage };
}

function verdictFor(sourceName: string, outcome: UploadOutcome): string {
	if (outcome.status === 'ingested') return `✓ ${sourceName} is in the brain`;
	if (outcome.status === 'proposed') {
		return `➜ ${sourceName} proposed — waiting for the owner's review`;
	}
	if (outcome.status === 'out_of_credits') return '✗ out of credits';
	return `✗ ${outcome.message}`;
}
