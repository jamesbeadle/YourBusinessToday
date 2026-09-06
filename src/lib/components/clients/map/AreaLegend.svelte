<script lang="ts">
	import { pinToneOrder, pinTones } from './areaPinTones';
</script>

<ul class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-chalk/60">
	{#each pinToneOrder as standing (standing)}
		<li class="flex items-center gap-1.5">
			<span
				class="inline-block h-2.5 w-2.5 rounded-full"
				style={`background-color: var(${pinTones[standing].colourToken}); opacity: ${pinTones[standing].fillOpacity}`}
			></span>
			{pinTones[standing].label}
		</li>
	{/each}
</ul>
