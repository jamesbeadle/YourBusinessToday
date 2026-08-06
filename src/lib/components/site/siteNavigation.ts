export type NavigationLink = {
	href: string;
	label: string;
};

export type NavigationAccess = {
	isSignedIn: boolean;
	isProjectManager: boolean;
	isAdmin: boolean;
};

export function buildNavigationLinks(access: NavigationAccess): NavigationLink[] {
	return [
		{ href: '/', label: 'Home' },
		{ href: '/project', label: 'Demo map' },
		{ href: '/workspace', label: 'Workspace' },
		{ href: '/brain', label: 'Second Brain' },
		...(access.isSignedIn ? [{ href: '/shared', label: 'Shared with me' }] : []),
		...(access.isProjectManager ? [{ href: '/projects', label: 'Projects' }] : []),
		...(access.isAdmin ? [{ href: '/admin', label: 'Admin' }] : [])
	];
}
