<script lang="ts">
	import { enhance } from '$app/forms';

	let {
		moveAction,
		fieldName,
		id,
		isFirst,
		isLast
	}: {
		moveAction: string;
		fieldName: string;
		id: string;
		isFirst: boolean;
		isLast: boolean;
	} = $props();
</script>

<div class="flex flex-col">
	<form method="POST" action={moveAction} use:enhance>
		<input type="hidden" name={fieldName} value={id} />
		<input type="hidden" name="direction" value="up" />
		<button
			type="submit"
			disabled={isFirst}
			aria-label="Raise priority"
			class="px-1 text-chalk/40 transition hover:text-go disabled:invisible"
		>
			▲
		</button>
	</form>
	<form method="POST" action={moveAction} use:enhance>
		<input type="hidden" name={fieldName} value={id} />
		<input type="hidden" name="direction" value="down" />
		<button
			type="submit"
			disabled={isLast}
			aria-label="Lower priority"
			class="px-1 text-chalk/40 transition hover:text-caution disabled:invisible"
		>
			▼
		</button>
	</form>
</div>
