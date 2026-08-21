export type NavigationLink = {
	href: string;
	label: string;
};

export type NavigationGroup = {
	label: string;
	links: NavigationLink[];
};

export type NavigationAccess = {
	isSignedIn: boolean;
	isProjectManager: boolean;
	isAdmin: boolean;
};

export const primaryNavigationLinks: NavigationLink[] = [
	{ href: '/', label: 'Home' },
	{ href: '/workspace', label: 'Workspace' },
	{ href: '/market', label: 'Market' },
	{ href: '/hive-mind', label: 'Hive Mind' }
];

export function buildMenuGroups(access: NavigationAccess): NavigationGroup[] {
	const groups: NavigationGroup[] = [];
	if (access.isSignedIn) {
		groups.push({ label: 'Shared', links: [{ href: '/shared', label: 'Shared with me' }] });
	}
	if (access.isProjectManager) {
		groups.push({ label: 'Manage', links: managementLinks(access) });
	}
	groups.push({ label: 'Account', links: accountLinks(access) });
	return groups;
}

function managementLinks(access: NavigationAccess): NavigationLink[] {
	return [
		{ href: '/projects', label: 'Projects' },
		...(access.isAdmin ? [{ href: '/admin', label: 'Admin' }] : [])
	];
}

function accountLinks(access: NavigationAccess): NavigationLink[] {
	if (!access.isSignedIn) return [{ href: '/account/sign-in', label: 'Sign in' }];
	return [{ href: '/account', label: 'Account' }];
}
