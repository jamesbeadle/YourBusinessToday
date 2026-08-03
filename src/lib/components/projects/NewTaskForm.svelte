<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<form method="POST" action="?/createTask" use:enhance class="flex items-center gap-3">
	<input
		name="title"
		required
		placeholder="Add a task — it joins the bottom of the priority order"
		class="flex-1 rounded-full border border-hairline bg-carriage px-5 py-2.5 text-chalk
			outline-none focus:border-go"
	/>
	<button
		type="submit"
		class="rounded-full bg-go px-6 py-2.5 font-display text-sm font-medium text-night transition
			hover:brightness-110"
	>
		Add task
	</button>
</form>
