<script lang="ts">
	import { knowledgeKinds } from '$lib/data/knowledge/knowledgeKinds';

	const [expertise, experience, process] = knowledgeKinds;
</script>

<svg viewBox="0 0 340 300" aria-hidden="true" class="w-full max-w-md">
	<g stroke-width="1.5" opacity="0.55">
		<line x1="170" y1="76" x2="96" y2="196" stroke={expertise.accent} />
		<line x1="170" y1="76" x2="244" y2="196" stroke={experience.accent} />
		<line x1="96" y1="196" x2="244" y2="196" stroke={process.accent} />
		<line x1="170" y1="76" x2="170" y2="150" stroke="var(--color-hairline)" />
		<line x1="96" y1="196" x2="170" y2="150" stroke="var(--color-hairline)" />
		<line x1="244" y1="196" x2="170" y2="150" stroke="var(--color-hairline)" />
	</g>
	<g>
		<circle cx="170" cy="76" r="34" fill={expertise.accent} opacity="0.14" />
		<circle cx="170" cy="76" r="12" fill={expertise.accent} />
		<circle cx="150" cy="52" r="4" fill={expertise.accent} opacity="0.7" />
		<circle cx="196" cy="60" r="5" fill={expertise.accent} opacity="0.7" />
	</g>
	<g>
		<circle cx="96" cy="196" r="34" fill={experience.accent} opacity="0.14" />
		<circle cx="96" cy="196" r="12" fill={experience.accent} />
		<circle cx="70" cy="180" r="4" fill={experience.accent} opacity="0.7" />
		<circle cx="86" cy="228" r="5" fill={experience.accent} opacity="0.7" />
	</g>
	<g>
		<circle cx="244" cy="196" r="34" fill={process.accent} opacity="0.14" />
		<circle cx="244" cy="196" r="12" fill={process.accent} />
		<circle cx="272" cy="180" r="4" fill={process.accent} opacity="0.7" />
		<circle cx="256" cy="228" r="5" fill={process.accent} opacity="0.7" />
	</g>
	<circle cx="170" cy="150" r="6" fill="var(--color-chalk)" />
	<text
		x="170"
		y="278"
		text-anchor="middle"
		fill="var(--color-chalk)"
		opacity="0.35"
		class="font-display"
		font-size="12"
		letter-spacing="4"
	>
		ONE SECOND BRAIN
	</text>
</svg>
