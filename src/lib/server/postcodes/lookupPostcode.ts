import { parsePostcodeLocation, type PostcodeLocation } from './postcodeLocation';
import { postcodeIn } from '$lib/data/postcode';
import { postcodesApiOrigin, requestPostcodes } from './postcodesRequest';

const postcodePath = '/postcodes/';

export async function lookupPostcode(candidate: string): Promise<PostcodeLocation | null> {
	const postcode = postcodeIn(candidate);
	if (postcode === '') return null;
	const url = new URL(postcodePath + encodeURIComponent(postcode), postcodesApiOrigin);
	const body = await requestPostcodes(url);
	return parsePostcodeLocation(body.result);
}
