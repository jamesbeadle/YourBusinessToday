<script lang="ts">
	let { label = 'YBT', size = 44 }: { label?: string; size?: number } = $props();
</script>

<svg viewBox="0 0 120 96" width={size} height={size * 0.8} aria-label="Your Business Today roundel">
	<circle cx="60" cy="48" r="34" fill="none" stroke="var(--color-tfl-red)" stroke-width="13" />
	<rect x="0" y="38" width="120" height="20" fill="var(--color-tfl-blue)" />
	<text
		x="60"
		y="53"
		text-anchor="middle"
		fill="var(--color-map-paper)"
		font-size="15"
		class="font-display tracking-widest"
	>
		{label}
	</text>
</svg>
