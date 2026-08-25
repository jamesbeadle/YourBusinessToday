<script lang="ts">
	import { page } from '$app/state';
	import { accountingNavigationLinks, isAccountingLinkActive } from './accountingNavigation';
</script>

<nav aria-label="Accounting" class="border-b border-hairline print:hidden">
	<ul class="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-6">
		{#each accountingNavigationLinks as navigationLink (navigationLink.href)}
			{@const isActive = isAccountingLinkActive(navigationLink.href, page.url.pathname)}
			<li>
				<a
					href={navigationLink.href}
					aria-current={isActive ? 'page' : undefined}
					class={`block whitespace-nowrap border-b-2 px-3 py-3 font-display text-sm transition
						${isActive ? 'border-signal text-chalk' : 'border-transparent text-chalk/60 hover:text-chalk'}`}
				>
					{navigationLink.label}
				</a>
			</li>
		{/each}
	</ul>
</nav>
