import { distanceInMiles, type Coordinates } from '$lib/data/distance';
import type { ClientStage } from '$lib/data/clientLifecycle';
import type { CompaniesHouseCompany } from '$lib/server/companiesHouse/searchCompaniesHouse';

export type RegisterStanding = { clientId: string; stage: ClientStage };

export type AreaPin = Coordinates & {
	key: string;
	companyNumber: string;
	name: string;
	address: string;
	postcode: string;
	incorporatedOn: string;
	sicCodes: string[];
	distanceMiles: number;
	standing: RegisterStanding | null;
};

export function pinForCompany(
	company: CompaniesHouseCompany,
	location: Coordinates,
	centre: Coordinates,
	standing: RegisterStanding | null
): AreaPin {
	return {
		key: company.companyNumber,
		companyNumber: company.companyNumber,
		name: company.name,
		address: company.address,
		postcode: company.postcode,
		incorporatedOn: company.incorporatedOn,
		sicCodes: company.sicCodes,
		latitude: location.latitude,
		longitude: location.longitude,
		distanceMiles: distanceInMiles(centre, location),
		standing
	};
}

export function byDistance(first: AreaPin, second: AreaPin): number {
	return first.distanceMiles - second.distanceMiles;
}
