import { env } from '$env/dynamic/private';

const resendEndpoint = 'https://api.resend.com/emails';

export type EmailDelivery = 'sent' | 'skipped';

export async function sendTransactionalEmail(email: {
	to: string;
	subject: string;
	html: string;
}): Promise<EmailDelivery> {
	if (!env.RESEND_API_KEY || !env.EMAIL_FROM) return 'skipped';
	const response = await fetch(resendEndpoint, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			authorization: `Bearer ${env.RESEND_API_KEY}`
		},
		body: JSON.stringify({
			from: env.EMAIL_FROM,
			to: [email.to],
			subject: email.subject,
			html: email.html
		})
	});
	if (!response.ok) throw new Error(`Email send failed with status ${response.status}`);
	return 'sent';
}
