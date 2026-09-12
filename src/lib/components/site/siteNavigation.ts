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
	isProjectMember: boolean;
};

export const primaryNavigationLinks: NavigationLink[] = [
	{ href: '/', label: 'Home' },
	{ href: '/vision', label: 'What we build' },
	{ href: '/contact', label: 'Contact' }
];

export function buildMenuGroups(access: NavigationAccess): NavigationGroup[] {
	const groups: NavigationGroup[] = [{ label: 'Explore', links: primaryNavigationLinks }];
	if (access.isProjectManager) {
		groups.push({ label: 'Manage', links: managementLinks(access) });
	}
	if (access.isProjectMember) {
		groups.push({ label: 'Your projects', links: portalLinks });
	}
	groups.push({ label: 'Account', links: accountLinks(access) });
	return groups;
}

const adminLinks: NavigationLink[] = [
	{ href: '/accounting', label: 'Accounting' },
	{ href: '/admin', label: 'Admin' }
];

const portalLinks: NavigationLink[] = [{ href: '/portal', label: 'Your projects' }];

function managementLinks(access: NavigationAccess): NavigationLink[] {
	return [
		{ href: '/projects', label: 'Projects' },
		{ href: '/clients', label: 'Clients' },
		{ href: '/people', label: 'People' },
		{ href: '/support', label: 'Support' },
		...(access.isAdmin ? adminLinks : [])
	];
}

function accountLinks(access: NavigationAccess): NavigationLink[] {
	if (!access.isSignedIn) return [{ href: '/account/sign-in', label: 'Sign in' }];
	return [{ href: '/account', label: 'Account' }];
}
