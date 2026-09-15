import { longestMessageBody } from './postMessage';

export type MessageSubmission = { body: string };

export function readMessageForm(formData: FormData): MessageSubmission | null {
	const body = String(formData.get('body') ?? '').trim();
	if (body === '' || body.length > longestMessageBody) return null;
	return { body };
}

export const messageFormRefusal = `A message needs some words, and fewer than ${longestMessageBody} of them.`;
