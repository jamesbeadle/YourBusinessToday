import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) =>
					event.cookies.set(name, value, { ...options, path: '/' })
				);
			}
		}
	});

	event.locals.safeGetSession = async () => {
		const { data: userData } = await event.locals.supabase.auth.getUser();
		if (userData.user === null) return { session: null, user: null };
		const { data: sessionData } = await event.locals.supabase.auth.getSession();
		return { session: sessionData.session, user: userData.user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders: (headerName) =>
			headerName === 'content-range' || headerName === 'x-supabase-api-version'
	});
};
