<script lang="ts">
	import FormField from '$lib/components/accounting/FormField.svelte';
	import FoundLinkChoices from './FoundLinkChoices.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { inputClasses } from '$lib/components/site/formStyles';
	import type { PersonFindings } from '$lib/server/people/research/personFindings';

	let { findings }: { findings: PersonFindings } = $props();

	function describeRole(role: PersonFindings['roles'][number]): string {
		const position = [role.title, role.organisation].filter(Boolean).join(', ');
		if (role.sourceUrl === '') return position;
		return `${position} (${role.sourceUrl})`;
	}
</script>

<form method="POST" action="?/saveFindings" class="flex flex-col gap-4">
	<input type="hidden" name="personId" value={findings.personId} />
	<p class="text-sm text-chalk/60">
		What the open web says about {findings.personName} in a business capacity, from
		{findings.sources.length} page{findings.sources.length === 1 ? '' : 's'}. Nothing is kept until you save.
	</p>
	<FormField label="Summary">
		<textarea name="summary" rows="5" value={findings.summary} class={inputClasses}></textarea>
	</FormField>
	{#if findings.roles.length > 0}
		<div class="flex flex-col gap-1 text-sm text-chalk/70">
			<p>Roles found</p>
			<ul class="list-disc pl-5 text-chalk/80">
				{#each findings.roles as role (describeRole(role))}
					<li>
						{role.title}{role.organisation === '' ? '' : `, ${role.organisation}`}
						{#if role.sourceUrl !== ''}
							<a href={role.sourceUrl} target="_blank" rel="noreferrer" class="text-xs text-chalk/40 hover:text-signal">source</a>
						{/if}
					</li>
					<input type="hidden" name="roleLine" value={describeRole(role)} />
				{/each}
			</ul>
		</div>
	{/if}
	<FoundLinkChoices links={findings.links} />
	<div class="flex flex-col gap-1 text-xs text-chalk/40">
		<p>Pages read</p>
		{#each findings.sources as source (source.url)}
			<a href={source.url} target="_blank" rel="noreferrer" class="truncate hover:text-signal">{source.title}</a>
			<input type="hidden" name="sourceUrl" value={source.url} />
		{/each}
	</div>
	<SubmitButton>Save to the record</SubmitButton>
</form>
