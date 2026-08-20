<script module lang="ts">
	export type FeatureRow = {
		id: string;
		name: string;
		createdAt: string;
	};
</script>

<script lang="ts">
	import { enhance } from '$app/forms';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { FormTracker } from '$lib/client/formTracker.svelte';

	let {
		title,
		description,
		emptyMessage,
		createAction,
		createPlaceholder,
		createLabel,
		rows,
		hrefFor
	}: {
		title: string;
		description: string;
		emptyMessage: string;
		createAction: string;
		createPlaceholder: string;
		createLabel: string;
		rows: FeatureRow[];
		hrefFor: (id: string) => string;
	} = $props();

	const tracker = new FormTracker();

	function formatCreatedDate(isoDate: string): string {
		return new Date(isoDate).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}
</script>

<section class="flex flex-col gap-4 rounded-2xl border border-hairline bg-carriage p-6">
	<div>
		<h2 class="font-display text-xl font-medium">{title}</h2>
		<p class="mt-1 text-sm text-chalk/60">{description}</p>
	</div>
	<FormErrorNote message={tracker.errorMessage} />
	<form method="POST" action={createAction} use:enhance={tracker.submit()} class="flex gap-2">
		<input
			name="name"
			required
			placeholder={createPlaceholder}
			aria-label={`${createLabel} name`}
			class="min-w-0 flex-1 rounded-full border border-hairline bg-night px-4 py-2.5 text-sm
				text-chalk outline-none placeholder:text-chalk/40 focus:border-signal"
		/>
		<SubmitButton
			isSaving={tracker.isSaving}
			savingLabel="Creating…"
			class="rounded-full bg-signal px-5 py-2.5 font-display text-sm font-medium text-night
				transition hover:brightness-110"
		>
			{createLabel}
		</SubmitButton>
	</form>
	{#if rows.length === 0}
		<p class="rounded-xl border-2 border-dashed border-hairline p-6 text-center text-sm text-chalk/50">
			{emptyMessage}
		</p>
	{:else}
		<ul class="flex flex-col divide-y divide-hairline">
			{#each rows as row (row.id)}
				<li>
					<a href={hrefFor(row.id)} class="group flex items-center justify-between gap-3 py-3">
						<span class="font-display text-sm text-chalk transition group-hover:text-signal">
							{row.name}
						</span>
						<span class="text-xs text-chalk/50">{formatCreatedDate(row.createdAt)}</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</section>
