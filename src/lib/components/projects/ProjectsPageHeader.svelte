<script lang="ts">
	let { onNewProject }: { onNewProject: () => void } = $props();
</script>

<div class="flex flex-wrap items-end justify-between gap-4">
	<div class="flex flex-col gap-2">
		<h1 class="font-display text-3xl font-medium">Projects</h1>
		<p class="max-w-prose text-chalk/70">
			Your projects, ordered by priority — the first tile is the next thing to spend time on.
		</p>
	</div>
	<div class="flex flex-wrap items-center gap-3">
		<a
			href="/tasks"
			class="rounded-full border border-hairline px-6 py-2.5 font-display text-sm text-chalk/80
				transition hover:border-go hover:text-go"
		>
			Task view
		</a>
		<button
			type="button"
			onclick={onNewProject}
			class="rounded-full bg-go px-6 py-2.5 font-display text-sm font-medium text-night
				transition hover:brightness-110"
		>
			New project
		</button>
	</div>
</div>
