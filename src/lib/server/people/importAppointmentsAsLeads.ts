import type { SupabaseClient } from '@supabase/supabase-js';
import { addProspectAsLead } from '$lib/server/clients/addProspectAsLead';
import { affiliatePersonWithClient } from '$lib/server/clients/affiliatePersonWithClient';
import { groupClientsUnder } from '$lib/server/clients/groupClientsUnder';
import { recordClientEvent } from '$lib/server/clients/recordClientEvent';
import type { OfficerAppointment } from '$lib/server/companiesHouse/officerAppointmentRecord';
import type { Person } from './personRecord';

export type AppointmentImport = { clientIds: string[]; groupId: string | null };

const groupOwnerRole = 'Owner';
const companiesHouseSource = 'companies_house';

export function readChosenAppointments(formData: FormData): OfficerAppointment[] {
	const chosenNumbers = formData.getAll('companyNumber').map(String);
	const names = formData.getAll('companyName').map(String);
	const roles = formData.getAll('officerRole').map(String);
	const appointedDates = formData.getAll('appointedOn').map(String);
	const addresses = formData.getAll('address').map(String);
	const chosen = new Set(formData.getAll('chosen').map(String));
	return chosenNumbers
		.map((companyNumber, index) => ({
			companyNumber,
			companyName: names[index] ?? '',
			officerRole: roles[index] ?? '',
			appointedOn: appointedDates[index] ?? '',
			address: addresses[index] ?? ''
		}))
		.filter((appointment) => chosen.has(appointment.companyNumber) && appointment.companyName !== '');
}

export async function importAppointmentsAsLeads(
	supabase: SupabaseClient,
	person: Person,
	appointments: OfficerAppointment[],
	groupName: string,
	actorAccountId: string
): Promise<AppointmentImport> {
	const clientIds: string[] = [];
	for (const appointment of appointments) {
		clientIds.push(await importAppointment(supabase, person, appointment, actorAccountId));
	}
	if (groupName === '' || clientIds.length === 0) return { clientIds, groupId: null };
	const groupId = await groupClientsUnder(supabase, clientIds, { newParentName: groupName }, actorAccountId);
	await affiliatePersonWithClient(supabase, {
		personId: person.id,
		clientId: groupId,
		role: groupOwnerRole,
		isPrimary: true
	});
	return { clientIds, groupId };
}

async function importAppointment(
	supabase: SupabaseClient,
	person: Person,
	appointment: OfficerAppointment,
	actorAccountId: string
): Promise<string> {
	const { clientId, wasAlreadyListed } = await addProspectAsLead(
		supabase,
		{ name: appointment.companyName, companyNumber: appointment.companyNumber, address: appointment.address },
		actorAccountId
	);
	await affiliatePersonWithClient(supabase, {
		personId: person.id,
		clientId,
		role: appointment.officerRole,
		isPrimary: !wasAlreadyListed,
		officerRole: appointment.officerRole,
		appointedOn: appointment.appointedOn,
		source: companiesHouseSource
	});
	await recordClientEvent(
		supabase,
		clientId,
		'appointments_imported',
		{ person: person.name, role: appointment.officerRole },
		actorAccountId
	);
	return clientId;
}
