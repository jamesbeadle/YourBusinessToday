import { describe, expect, it } from 'vitest';
import { inviteOutcomeMessage } from './inviteOutcomeMessage';

describe('inviteOutcomeMessage', () => {
	it('refuses the owner, a repeat, and a spent allowance', () => {
		expect(inviteOutcomeMessage('is_the_owner', 'a@b.c').isRefusal).toBe(true);
		expect(inviteOutcomeMessage('already_on_project', 'a@b.c').isRefusal).toBe(true);
		expect(inviteOutcomeMessage('too_many_invites', 'a@b.c').isRefusal).toBe(true);
	});

	it('reports a sent invitation as a success naming the address', () => {
		const outcome = inviteOutcomeMessage('sent', 'a@b.c');
		expect(outcome.isRefusal).toBe(false);
		expect(outcome.message).toContain('a@b.c');
		expect(outcome.message).toContain('emailed');
	});

	it('still counts an undelivered email as joined, and says the email did not go', () => {
		const outcome = inviteOutcomeMessage('failed', 'a@b.c');
		expect(outcome.isRefusal).toBe(false);
		expect(outcome.message).toContain('is on the project');
		expect(outcome.message).toContain('could not be sent');
	});
});
