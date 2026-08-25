<script lang="ts">
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import { ledgerAccountTypeLabels, ledgerAccountTypeOrder } from '$lib/data/accounting/ledgerAccountTypes';
	import { confirmButtonClasses, inputClasses, selectClasses } from './accountingFormStyles';

	const tracker = new FormTracker();
</script>

<form method="POST" action="?/createAccount" use:enhance={tracker.submit()} class="flex flex-col gap-3">
	<div class="flex flex-wrap gap-3">
		<input name="code" required placeholder="Code, e.g. 6600" class={`${inputClasses} w-36`} />
		<input name="name" required placeholder="Account name" class={`${inputClasses} min-w-64 flex-1`} />
		<select name="accountType" value="expense" class={selectClasses}>
			{#each ledgerAccountTypeOrder as accountType (accountType)}
				<option value={accountType}>{ledgerAccountTypeLabels[accountType]}</option>
			{/each}
		</select>
		<SubmitButton isSaving={tracker.isSaving} savingLabel="Adding…" class={confirmButtonClasses}>
			Add account
		</SubmitButton>
	</div>
	<FormErrorNote message={tracker.errorMessage} />
</form>
