<script lang="ts">
	import { enhance } from '$app/forms';
	import type { MapViewer } from '$lib/server/maps/getMapViewers';

	let { viewers }: { viewers: MapViewer[] } = $props();
</script>

<section class="flex flex-col gap-4 rounded-2xl border border-hairline bg-carriage p-6">
	<div>
		<h2 class="font-display text-xl font-medium">Share your map</h2>
		<p class="mt-1 text-sm text-chalk/70">
			Invite someone by email — once they sign in with that address, your latest map appears in
			their “Shared with me”.
		</p>
	</div>
	<form method="POST" action="?/addViewer" use:enhance class="flex gap-2">
		<input
			name="viewerEmail"
			type="email"
			required
			placeholder="colleague@company.com"
			aria-label="Email address to share your map with"
			class="min-w-0 flex-1 rounded-full border border-hairline bg-night px-4 py-2.5 text-sm
				text-chalk outline-none placeholder:text-chalk/40 focus:border-signal"
		/>
		<button
			type="submit"
			class="rounded-full bg-go px-5 py-2.5 font-display text-sm font-medium text-night
				transition hover:brightness-110"
		>
			Share
		</button>
	</form>
	{#if viewers.length > 0}
		<ul class="flex flex-col divide-y divide-hairline">
			{#each viewers as viewer (viewer.id)}
				<li class="flex items-center justify-between gap-3 py-2.5">
					<span class="truncate text-sm text-chalk/80">{viewer.email}</span>
					<form method="POST" action="?/removeViewer" use:enhance>
						<input type="hidden" name="viewerId" value={viewer.id} />
						<button
							type="submit"
							aria-label={`Stop sharing with ${viewer.email}`}
							class="font-display text-sm text-chalk/50 transition hover:text-signal"
						>
							Remove
						</button>
					</form>
				</li>
			{/each}
		</ul>
	{/if}
</section>
