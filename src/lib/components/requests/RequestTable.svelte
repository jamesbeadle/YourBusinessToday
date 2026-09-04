<script lang="ts">
	import RequestStatusPill from './RequestStatusPill.svelte';
	import { formatBritishDate } from '$lib/data/britishDate';

	type ListedRequest = {
		id: string;
		reference: string;
		title: string;
		projectName: string;
		status: 'new' | 'accepted' | 'declined';
		isDelivered?: boolean;
		createdAt: string;
	};

	let {
		requests,
		basePath
	}: { requests: ListedRequest[]; basePath: string } = $props();
</script>

<ul class="divide-y divide-hairline rounded-2xl border border-hairline">
	{#each requests as featureRequest (featureRequest.id)}
		<li class="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
			<div class="min-w-0">
				<a href={`${basePath}/${featureRequest.id}`} class="font-display hover:text-signal">
					{featureRequest.title}
				</a>
				<p class="text-xs text-chalk/50">
					{featureRequest.reference} · {featureRequest.projectName} ·
					{formatBritishDate(featureRequest.createdAt)}
				</p>
			</div>
			<RequestStatusPill
				status={featureRequest.status}
				isDelivered={featureRequest.isDelivered ?? false}
			/>
		</li>
	{/each}
</ul>
