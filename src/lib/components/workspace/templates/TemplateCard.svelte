<script lang="ts">
	import type { BrainTemplate } from '$lib/data/brainTemplates';

	let {
		template,
		accentColor,
		onSelect
	}: {
		template: BrainTemplate;
		accentColor: string;
		onSelect: (template: BrainTemplate) => void;
	} = $props();
</script>

<button
	type="button"
	onclick={() => onSelect(template)}
	style={`--accent: ${accentColor}`}
	class="group flex h-full w-full flex-col gap-3 rounded-2xl border border-hairline bg-carriage
		p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-(--accent)
		hover:shadow-[0_12px_32px_-16px_var(--accent)]"
>
	<span
		aria-hidden="true"
		class="flex h-11 w-11 items-center justify-center rounded-xl text-2xl"
		style="background: color-mix(in srgb, var(--accent) 14%, transparent)"
	>
		{template.icon}
	</span>
	<span class="flex flex-col gap-1">
		<span class="font-display text-base font-medium text-chalk">{template.title}</span>
		<span class="text-sm leading-relaxed text-chalk/60">{template.tagline}</span>
	</span>
	<span
		class="mt-auto pt-1 font-display text-xs text-(--accent) opacity-0 transition
			group-hover:opacity-100"
	>
		Use this template →
	</span>
</button>
