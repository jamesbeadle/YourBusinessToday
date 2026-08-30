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
	{ href: '/knowledge-base', label: 'Knowledge Base' },
	{ href: '/market', label: 'Marketplace' },
	{ href: '/trade-talk', label: 'Trade Talk' }
];

export function buildMenuGroups(access: NavigationAccess): NavigationGroup[] {
	const groups: NavigationGroup[] = [{ label: 'Explore', links: primaryNavigationLinks }];
	if (access.isProjectManager) {
		groups.push({ label: 'Manage', links: managementLinks(access) });
	}
	groups.push({ label: 'Account', links: accountLinks(access) });
	return groups;
}

const adminLinks: NavigationLink[] = [
	{ href: '/accounting', label: 'Accounting' },
	{ href: '/admin', label: 'Admin' }
];

function managementLinks(access: NavigationAccess): NavigationLink[] {
	return [
		{ href: '/projects', label: 'Projects' },
		...(access.isAdmin ? adminLinks : [])
	];
}

function accountLinks(access: NavigationAccess): NavigationLink[] {
	if (!access.isSignedIn) return [{ href: '/account/sign-in', label: 'Sign in' }];
	return [{ href: '/account', label: 'Account' }];
}
