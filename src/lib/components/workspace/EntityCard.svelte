<script lang="ts">
	import type { EntitySummary } from '$lib/server/entities/getEntityList';

	let { entity }: { entity: EntitySummary } = $props();

	function countLabel(count: number, singular: string, plural: string): string {
		return `${count} ${count === 1 ? singular : plural}`;
	}
</script>

<li>
	<a
		href={`/workspace/${entity.id}`}
		class="flex flex-col gap-2 rounded-2xl border border-hairline bg-carriage p-6 transition
			hover:border-signal/60"
	>
		<p class="font-display text-lg font-medium">{entity.name}</p>
		<p class="text-sm text-chalk/60">
			{countLabel(entity.domainBrainCount, 'expertise brain', 'expertise brains')} ·
			{countLabel(entity.workflowCount, 'workflow', 'workflows')}
		</p>
	</a>
</li>
