import { longestMessageBody } from './postMessage';

export type MessageSubmission = { body: string; isInternal: boolean };

export function readMessageForm(formData: FormData): MessageSubmission | null {
	const body = String(formData.get('body') ?? '').trim();
	if (body === '' || body.length > longestMessageBody) return null;
	return { body, isInternal: formData.get('isInternal') === 'on' };
}

export const messageFormRefusal = `A message needs some words, and fewer than ${longestMessageBody} of them.`;
