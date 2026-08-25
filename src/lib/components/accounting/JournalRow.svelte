<script lang="ts">
	import { formatIsoDate } from '$lib/data/accounting/accountingPeriods';
	import { journalKindLabels } from '$lib/data/accounting/journalKinds';
	import { formatMoney } from '$lib/data/accounting/money';
	import type { JournalSummary } from '$lib/server/accounting/getJournalList';

	let { journal }: { journal: JournalSummary } = $props();
</script>

<li>
	<details class="group px-5 py-4">
		<summary class="flex cursor-pointer flex-wrap items-center justify-between gap-4 list-none">
			<div class="min-w-0">
				<p class="font-display">
					{journal.description}
					<span class="ml-2 rounded-full bg-chalk/10 px-2 py-0.5 text-xs text-chalk/60">
						{journalKindLabels[journal.kind]}
					</span>
				</p>
				<p class="text-xs text-chalk/50">{formatIsoDate(journal.journalDate)}</p>
			</div>
			<span class="font-display tabular-nums">{formatMoney(journal.total)}</span>
		</summary>
		<table class="mt-3 w-full text-sm">
			<tbody class="divide-y divide-hairline/60">
				{#each journal.lines as line, lineIndex (lineIndex)}
					<tr>
						<td class="py-1.5 text-chalk/70">
							{line.accountCode} · {line.accountName}
							{#if line.costCentreName}
								<span class="text-chalk/40">({line.costCentreName})</span>
							{/if}
						</td>
						<td class="py-1.5 text-right tabular-nums">{line.debit > 0 ? formatMoney(line.debit) : ''}</td>
						<td class="py-1.5 text-right tabular-nums">{line.credit > 0 ? formatMoney(line.credit) : ''}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</details>
</li>
