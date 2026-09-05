import type { SupabaseClient } from '@supabase/supabase-js';
import { recordClientEvent } from '$lib/server/clients/recordClientEvent';
import type { WebsiteEnquiry } from '$lib/data/enquiryForm';

const websiteSource = 'website';
const leadStage = 'lead';

export async function recordWebsiteEnquiry(
	supabase: SupabaseClient,
	enquiry: WebsiteEnquiry
): Promise<string> {
	const clientId = await insertLead(supabase, enquiry);
	await insertPrimaryContact(supabase, clientId, enquiry);
	await recordClientEvent(
		supabase,
		clientId,
		'enquiry_received',
		{ message: enquiry.message, source: websiteSource },
		null
	);
	return clientId;
}

async function insertLead(supabase: SupabaseClient, enquiry: WebsiteEnquiry): Promise<string> {
	const clientName = enquiry.company === '' ? enquiry.name : enquiry.company;
	const { data, error } = await supabase
		.from('clients')
		.insert({
			name: clientName,
			website: enquiry.website,
			lifecycle_stage: leadStage,
			lead_source: websiteSource
		})
		.select('id')
		.single();
	if (error) throw error;
	return data.id;
}

async function insertPrimaryContact(
	supabase: SupabaseClient,
	clientId: string,
	enquiry: WebsiteEnquiry
): Promise<void> {
	const { error } = await supabase.from('client_contacts').insert({
		client_id: clientId,
		name: enquiry.name,
		email: enquiry.email,
		is_primary: true
	});
	if (error) throw error;
}
