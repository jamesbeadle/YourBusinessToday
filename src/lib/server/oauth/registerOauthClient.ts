import { hashSecret, mintSecret } from './oauthTokens';
import { supabaseServiceClient } from '$lib/server/payments/supabaseServiceClient';

export type ClientRegistration = {
	client_id: string;
	client_name: string;
	redirect_uris: string[];
	client_secret?: string;
	token_endpoint_auth_method: string;
	grant_types: string[];
	response_types: string[];
};

const confidentialAuthMethod = 'client_secret_post';

export async function registerOauthClient(
	submission: Record<string, unknown>
): Promise<ClientRegistration | null> {
	const redirectUris = readRedirectUris(submission.redirect_uris);
	if (redirectUris === null) return null;
	const authMethod = String(submission.token_endpoint_auth_method ?? 'none');
	const clientId = mintSecret('ybt_client_');
	const clientSecret = authMethod === confidentialAuthMethod ? mintSecret('ybt_cs_') : null;
	const { error } = await supabaseServiceClient()
		.from('oauth_clients')
		.insert({
			client_id: clientId,
			client_secret_hash: clientSecret === null ? null : hashSecret(clientSecret),
			client_name: String(submission.client_name ?? 'An MCP client'),
			redirect_uris: redirectUris
		});
	if (error) throw error;
	return {
		client_id: clientId,
		client_name: String(submission.client_name ?? 'An MCP client'),
		redirect_uris: redirectUris,
		...(clientSecret === null ? {} : { client_secret: clientSecret }),
		token_endpoint_auth_method: authMethod,
		grant_types: ['authorization_code', 'refresh_token'],
		response_types: ['code']
	};
}

function readRedirectUris(value: unknown): string[] | null {
	if (!Array.isArray(value) || value.length === 0) return null;
	const uris = value.map(String).filter((uri) => uri.startsWith('https://') || isLoopback(uri));
	if (uris.length === 0) return null;
	return uris;
}

function isLoopback(uri: string): boolean {
	return uri.startsWith('http://localhost') || uri.startsWith('http://127.0.0.1');
}
