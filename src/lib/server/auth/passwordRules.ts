import { minimumPasswordLength } from '$lib/data/passwordRules';
import type { EmailAndPassword } from './emailAndPassword';

const missingEmailAddress = 'Enter your email address.';
const passwordTooShort = `Passwords need at least ${minimumPasswordLength} characters.`;
const passwordsDoNotMatch = 'Those two passwords are not the same.';

/** A sentence for the person when the address cannot be used, or null when it can. */
export function problemWithEmailAddress(emailAddress: string): string | null {
	if (emailAddress === '') return missingEmailAddress;
	return null;
}

/** A sentence for the person when the credentials cannot be used, or null when they can. */
export function problemWithCredentials(credentials: EmailAndPassword): string | null {
	const { emailAddress, password } = credentials;
	const emailProblem = problemWithEmailAddress(emailAddress);
	if (emailProblem !== null) return emailProblem;
	return problemWithPassword(password);
}

/** A sentence for the person when the password is too weak to use, or null when it will do. */
export function problemWithPassword(password: string): string | null {
	if (password.length < minimumPasswordLength) return passwordTooShort;
	return null;
}

/** A sentence for the person when the chosen password cannot be used, or null when it can. */
export function problemWithNewPassword(password: string, confirmation: string): string | null {
	const passwordProblem = problemWithPassword(password);
	if (passwordProblem !== null) return passwordProblem;
	if (password !== confirmation) return passwordsDoNotMatch;
	return null;
}
