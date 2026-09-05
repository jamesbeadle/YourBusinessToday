<script lang="ts">
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { inputClasses, panelClasses } from '$lib/components/site/formStyles';
</script>

<form method="POST" action="?/addLead" class={panelClasses}>
	<h2 class="font-display text-lg">Add a lead</h2>
	<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
		<input name="name" required placeholder="Company" aria-label="Company" class={inputClasses} />
		<input name="website" placeholder="https://" aria-label="Website" class={inputClasses} />
		<input
			name="contactName"
			placeholder="First contact"
			aria-label="First contact name"
			class={inputClasses}
		/>
		<input
			name="contactEmail"
			type="email"
			placeholder="Their email"
			aria-label="First contact email"
			class={inputClasses}
		/>
	</div>
	<div class="flex flex-wrap items-center justify-between gap-3">
		<p class="text-xs text-chalk/50">
			Or let Claude do the reading:
			<a href="/clients/research" class="text-chalk/80 hover:text-signal">research a company</a>
			· <a href="/clients/prospect" class="text-chalk/80 hover:text-signal">search Companies House</a>
		</p>
		<SubmitButton>Add as a lead</SubmitButton>
	</div>
</form>
