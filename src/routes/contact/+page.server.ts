import { fail } from '@sveltejs/kit';
import { notifyEnquiryReceived } from '$lib/server/enquiries/notifyEnquiryReceived';
import { readWebsiteEnquiry } from '$lib/server/enquiries/websiteEnquiry';
import { recordWebsiteEnquiry } from '$lib/server/enquiries/recordWebsiteEnquiry';
import { supabaseServiceClient } from '$lib/server/payments/supabaseServiceClient';
import { companyDetails } from '$lib/data/companyDetails';
import type { WebsiteEnquiry } from '$lib/data/enquiryForm';
import type { Actions } from './$types';

const recordingFailedMessage = `We could not save your message just now — please email ${companyDetails.consultingEmail} instead.`;

export const actions: Actions = {
	sendEnquiry: async ({ request, url }) => {
		const reading = readWebsiteEnquiry(await request.formData());
		if ('isHoneypotFilled' in reading) return { isSent: true };
		if ('problem' in reading) return fail(400, { message: reading.problem });
		try {
			await recordAndNotify(reading.enquiry, url.origin);
		} catch {
			return fail(500, { message: recordingFailedMessage });
		}
		return { isSent: true };
	}
};

async function recordAndNotify(enquiry: WebsiteEnquiry, siteOrigin: string): Promise<void> {
	const clientId = await recordWebsiteEnquiry(supabaseServiceClient(), enquiry);
	await notifyEnquiryReceived(enquiry, `${siteOrigin}/clients/${clientId}`);
}
