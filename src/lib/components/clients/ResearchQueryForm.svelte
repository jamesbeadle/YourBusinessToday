<script lang="ts">
	import { enhance } from '$app/forms';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { inputClasses, panelClasses } from '$lib/components/site/formStyles';

	let { query, clientId }: { query: string; clientId: string | null } = $props();

	const tracker = new FormTracker();
</script>

<form
	method="POST"
	action="?/research"
	class={panelClasses}
	use:enhance={tracker.submit(undefined, { shouldKeepFields: true })}
>
	<input type="hidden" name="clientId" value={clientId ?? ''} />
	<label class="flex flex-col gap-2 text-sm text-chalk/70">
		Company name or website
		<input
			name="query"
			value={query}
			required
			placeholder="Acme Joinery, or https://acmejoinery.co.uk"
			class={inputClasses}
		/>
	</label>
	<div class="flex flex-wrap items-center justify-between gap-3">
		<p class="text-xs text-chalk/50">
			We read their homepage and an about or team page, nothing else, and record where each
			fact came from.
		</p>
		<SubmitButton isSaving={tracker.isSaving} savingLabel="Reading their site…">Research</SubmitButton>
	</div>
</form>
