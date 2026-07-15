export type SignInCredentials = { email: string; password: string };

export async function readCredentials(request: Request): Promise<SignInCredentials | null> {
	const formData = await request.formData();
	const email = String(formData.get('email') ?? '').trim();
	const password = String(formData.get('password') ?? '');
	if (email === '' || password === '') return null;
	return { email, password };
}
