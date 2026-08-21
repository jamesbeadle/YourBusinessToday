<script module lang="ts">
	export type FeatureRow = {
		id: string;
		name: string;
		createdAt: string;
	};
</script>

<script lang="ts">
	import FeatureCreateForm from './FeatureCreateForm.svelte';
	import type { FeatureGoalField } from './FeatureCreateForm.svelte';

	let {
		title,
		description,
		emptyMessage,
		createAction,
		createPlaceholder,
		createLabel,
		createHref,
		goalField,
		rows,
		hrefFor
	}: {
		title: string;
		description: string;
		emptyMessage: string;
		createAction?: string;
		createPlaceholder?: string;
		createLabel: string;
		createHref?: string;
		goalField?: FeatureGoalField;
		rows: FeatureRow[];
		hrefFor: (id: string) => string;
	} = $props();

	function formatCreatedDate(isoDate: string): string {
		return new Date(isoDate).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}
</script>

<section class="flex flex-col gap-4 rounded-2xl border border-hairline bg-carriage p-6">
	<div class="flex flex-wrap items-start justify-between gap-4">
		<div>
			<h2 class="font-display text-xl font-medium">{title}</h2>
			<p class="mt-1 text-sm text-chalk/60">{description}</p>
		</div>
		{#if createHref !== undefined}
			<a
				href={createHref}
				class="rounded-full bg-signal px-5 py-2.5 font-display text-sm font-medium text-night
					transition hover:brightness-110"
			>
				{createLabel}
			</a>
		{/if}
	</div>
	{#if createAction !== undefined && createPlaceholder !== undefined}
		<FeatureCreateForm {createAction} {createPlaceholder} {createLabel} {goalField} />
	{/if}
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
