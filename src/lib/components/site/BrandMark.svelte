<script lang="ts">
	let { size = 36 }: { size?: number } = $props();
</script>

<svg viewBox="0 0 48 48" width={size} height={size} aria-label="Your Business Today mark">
	<rect x="0" y="0" width="48" height="48" rx="12" fill="var(--color-carriage)" />
	<path
		d="M9 35 L19 35 L33 21 L33 10"
		fill="none"
		stroke="var(--color-signal)"
		stroke-width="5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M9 13 L15 13 L29 27 L39 27"
		fill="none"
		stroke="var(--color-go)"
		stroke-width="5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<circle cx="26" cy="28" r="4.5" fill="var(--color-night)" stroke="var(--color-chalk)" stroke-width="3" />
</svg>
