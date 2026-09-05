const WIDE_SCREEN_QUERY = '(min-width: 1024px)';

export function isWideScreen(): boolean {
	return window.matchMedia(WIDE_SCREEN_QUERY).matches;
}
