import type { ActionData } from './.svelte-kit/types/src/routes/account/sign-in/$types';

type Probe = NonNullable<ActionData>;
declare const probe: Probe;
const email: string | never | undefined = probe.unverifiedEmail;
console.log(email);
