import { describe, expect, it } from 'vitest';
import companyOfficersFixture from './fixtures/companyOfficers.json';
import officerAppointmentsFixture from './fixtures/officerAppointments.json';
import officerSearchFixture from './fixtures/officerSearch.json';
import { parseCompanyOfficers } from './companyOfficerRecord';
import { parseOfficerAppointments } from './officerAppointmentRecord';
import { parseOfficerSearch } from './officerSearchRecord';

describe('parseOfficerSearch', () => {
	const officers = parseOfficerSearch(officerSearchFixture);

	it('reads the officer id from the appointments link and tidies the name', () => {
		expect(officers[0]).toEqual({
			officerId: 'abc123DEF456',
			name: 'Jane Elizabeth Smith',
			appointmentCount: 3,
			bornIn: '06/1975',
			addressSnippet: '1 High Street, Guildford, GU1 3AA'
		});
	});

	it('leaves the birth blank when the register gives none', () => {
		expect(officers[1].bornIn).toBe('');
	});

	it('drops a result with no appointments link', () => {
		expect(officers).toHaveLength(2);
	});
});

describe('parseOfficerAppointments', () => {
	const appointments = parseOfficerAppointments(officerAppointmentsFixture);

	it('names the officer forename first', () => {
		expect(appointments.officerName).toBe('Jane Elizabeth Smith');
	});

	it('keeps only current appointments at active companies', () => {
		expect(appointments.appointments.map((appointment) => appointment.companyNumber)).toEqual([
			'01234567',
			'07654321'
		]);
	});

	it('carries the role, the date and the address', () => {
		expect(appointments.appointments[0]).toEqual({
			companyNumber: '01234567',
			companyName: 'SMITH HOLDINGS LIMITED',
			officerRole: 'director',
			appointedOn: '2015-03-01',
			address: '1 High Street, Guildford, GU1 3AA'
		});
	});
});

describe('parseCompanyOfficers', () => {
	const officers = parseCompanyOfficers(companyOfficersFixture);

	it('keeps only officers who have not resigned', () => {
		expect(officers.map((officer) => officer.officerId)).toEqual(['abc123DEF456', 'pat789']);
	});

	it('turns the register name into a display name, hyphens and apostrophes intact', () => {
		expect(officers[1].name).toBe("Patrick O'brien-Jones");
	});
});
