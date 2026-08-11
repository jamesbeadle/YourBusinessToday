export function filterChipClasses(isSelected: boolean): string {
	return `rounded-full border px-4 py-1.5 font-display text-xs transition ${
		isSelected
			? 'border-go bg-go/10 text-go'
			: 'border-hairline text-chalk/60 hover:border-chalk/40 hover:text-chalk'
	}`;
}
