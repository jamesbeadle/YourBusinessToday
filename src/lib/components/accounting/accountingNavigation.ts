import type { NavigationLink } from '$lib/components/site/siteNavigation';

export const accountingNavigationLinks: NavigationLink[] = [
	{ href: '/accounting', label: 'Overview' },
	{ href: '/accounting/invoices', label: 'Invoices' },
	{ href: '/accounting/clients', label: 'Clients' },
	{ href: '/accounting/expenses', label: 'Expenses' },
	{ href: '/accounting/journals', label: 'Journals' },
	{ href: '/accounting/reports', label: 'Reports' },
	{ href: '/accounting/cost-centres', label: 'Cost centres' },
	{ href: '/accounting/accounts', label: 'Accounts' },
	{ href: '/accounting/settings', label: 'Settings' }
];

export function isAccountingLinkActive(linkHref: string, currentPath: string): boolean {
	if (linkHref === '/accounting') return currentPath === '/accounting';
	return currentPath.startsWith(linkHref);
}
