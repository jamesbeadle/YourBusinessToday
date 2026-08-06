<script lang="ts">
	import { enhance } from '$app/forms';
	import FormErrorNote from '$lib/components/site/FormErrorNote.svelte';
	import Modal from '$lib/components/site/Modal.svelte';
	import { FormTracker } from '$lib/client/formTracker.svelte';
	import { taskStatusLabels, taskStatusOrder, type TaskStatus } from '$lib/data/taskStatus';

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

	const tracker = new FormTracker();

	$effect(() => {
		if (!isOpen) tracker.reset();
	});

	function optionClasses(status: TaskStatus): string {
		if (status === currentStatus) return 'border-go bg-go/10 text-go';
		return 'border-hairline text-chalk/80 hover:border-go hover:text-go';
	}
</script>

<Modal title="Change status" bind:isOpen>
	<div class="flex flex-col gap-4">
		<p class="text-sm text-chalk/60">{taskTitle}</p>
		<FormErrorNote message={tracker.errorMessage} />
		<div class="flex flex-col gap-2" class:animate-pulse={tracker.isSaving}>
			{#each taskStatusOrder as statusOption (statusOption)}
				<form method="POST" action="?/setStatus" use:enhance={tracker.submit(() => (isOpen = false))}>
					<input type="hidden" name="taskId" value={taskId} />
					<input type="hidden" name="status" value={statusOption} />
					<button
						type="submit"
						disabled={statusOption === currentStatus || tracker.isSaving}
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
