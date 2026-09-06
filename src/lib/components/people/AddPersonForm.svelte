<script lang="ts">
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { seniorityLabels, seniorityOrder } from '$lib/data/contactProfileFields';
	import { inputClasses, selectClasses } from '$lib/components/site/formStyles';

	let { action = '?/addPerson' }: { action?: string } = $props();
</script>

<form method="POST" {action} class="flex flex-col gap-4">
	<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
		<input name="name" required placeholder="Name" aria-label="Name" class={inputClasses} />
		<input name="email" type="email" placeholder="Their email" aria-label="Email" class={inputClasses} />
		<input name="phone" placeholder="Phone" aria-label="Phone" class={inputClasses} />
		<select name="seniority" aria-label="Seniority" class={selectClasses}>
			{#each seniorityOrder as seniority (seniority)}
				<option value={seniority}>{seniorityLabels[seniority]}</option>
			{/each}
		</select>
	</div>
	<div class="flex flex-wrap items-center justify-between gap-3">
		<p class="text-xs text-chalk/50">
			A director or an owner is a lead in their own right; their companies come next.
		</p>
		<SubmitButton>Add as a lead</SubmitButton>
	</div>
</form>
