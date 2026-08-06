<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '$lib/components/site/Modal.svelte';
	import { taskStatusLabels, taskStatusOrder, type TaskStatus } from '$lib/data/taskStatus';
	import type { SubmitFunction } from '@sveltejs/kit';

	let {
		taskId,
		taskTitle,
		currentStatus,
		isOpen = $bindable()
	}: {
		taskId: string;
		taskTitle: string;
		currentStatus: TaskStatus;
		isOpen: boolean;
	} = $props();

	const closeWhenDone: SubmitFunction = () => {
		return async ({ update }) => {
			await update();
			isOpen = false;
		};
	};

	function optionClasses(status: TaskStatus): string {
		if (status === currentStatus) return 'border-go bg-go/10 text-go';
		return 'border-hairline text-chalk/80 hover:border-go hover:text-go';
	}
</script>

<Modal title="Change status" bind:isOpen>
	<div class="flex flex-col gap-4">
		<p class="text-sm text-chalk/60">{taskTitle}</p>
		<div class="flex flex-col gap-2">
			{#each taskStatusOrder as statusOption (statusOption)}
				<form method="POST" action="?/setStatus" use:enhance={closeWhenDone}>
					<input type="hidden" name="taskId" value={taskId} />
					<input type="hidden" name="status" value={statusOption} />
					<button
						type="submit"
						disabled={statusOption === currentStatus}
						class={`w-full rounded-xl border px-4 py-3 text-left font-display text-sm transition
							disabled:cursor-default ${optionClasses(statusOption)}`}
					>
						{taskStatusLabels[statusOption]}
						{#if statusOption === currentStatus}
							<span class="ml-2 text-xs text-chalk/50">current</span>
						{/if}
					</button>
				</form>
			{/each}
		</div>
	</div>
</Modal>
