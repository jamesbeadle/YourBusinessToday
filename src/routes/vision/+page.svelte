<script lang="ts">
	import { companyDetails } from '$lib/data/companyDetails';

	const pageTitle = 'What we build — Your Business Today';
	const pageDescription =
		'Generic AI has never met your business. We learn how yours really runs, then build software shaped around that work — your own portal, connected to Claude, delivered a stage at a time and owned by you.';
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={`${companyDetails.websiteUrl}/vision`} />
</svelte:head>

<article class="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16">
	<p class="font-display text-sm tracking-widest text-signal uppercase">What we build</p>
	<h1 class="font-display text-4xl leading-tight font-medium">
		AI already knows everything.<br />Except your business.
	</h1>
	<p class="text-lg text-chalk/80">
		Ask any AI assistant about the French Revolution and you'll get a lecture. Ask it whether
		you can afford to hire in March, whether your quoting process is losing you work, or who
		should cover invoicing while Sarah is on leave — and it has nothing. Not because it isn't
		clever, but because it has never met your business.
	</p>
	<p class="text-chalk/80">
		Off-the-shelf software has the same blind spot and has had it for twenty years. It arrives
		knowing the general case and nothing about yours, so the business bends itself around the
		tool: the same job typed into three places, one process living in the software and a
		different one living on the floor, and two or three people quietly holding the gap together.
	</p>
	<h2 class="font-display text-2xl font-medium">We learn the business before we build</h2>
	<p class="text-chalk/80">
		So we start where a consultancy should. We interview the people who actually do the work —
		not their managers' account of it — and we read the documents you already have. We write
		down how the business really runs: the rules of your trade, the record of the jobs you
		have done, and the way work moves from one person to the next. Some of what that turns up
		needs no software at all, and we will tell you so.
	</p>
	<h2 class="font-display text-2xl font-medium">Then we build what the work asks for</h2>
	<p class="text-chalk/80">
		What we build is shaped by that map rather than by a product roadmap. Automation goes where
		it takes real work off real people — the chasing, the retyping, the handovers that stall —
		and is left out where it would only add another screen to fill in. Nothing rests on a guess
		about your business, because by that point we are not guessing.
	</p>
	<p class="text-chalk/80">
		From the first day you have your own portal on this site: every project and every request,
		at the stage it is really at. You raise a request in plain English and follow it through to
		the build. And if your people use Claude, it connects straight to that portal — ask what is
		in flight, raise a request, follow the thread, without opening a browser. It is the same
		connection we use to run the work ourselves.
	</p>
	<h2 class="font-display text-2xl font-medium">And all of it belongs to you</h2>
	<p class="text-chalk/80">
		What we learn about your business is written in your own language and it is yours. It is
		never sold, never pooled, never used to train anything for anybody else, and it leaves with
		you if you leave us. So does the software: each stage is handed over into your ownership as
		it goes live, and you can stop after any of them.
	</p>
	<p class="text-chalk/80">
		Software has spent twenty years asking businesses to adapt to it. We think the next twenty
		belong to software that adapts to the business — and that starts with actually knowing it.
		Tell us about your business today, and every tomorrow gets easier.
	</p>
	<div class="mt-4 flex flex-wrap gap-4 border-t border-hairline pt-8">
		<a
			href="/contact"
			class="rounded-full bg-signal px-7 py-3 font-display text-sm font-medium text-night
				transition hover:brightness-110"
		>
			Talk to us
		</a>
		<a
			href="/offer"
			class="rounded-full border border-hairline px-7 py-3 font-display text-sm text-chalk/80
				transition hover:border-chalk/40 hover:text-chalk"
		>
			How an engagement works
		</a>
	</div>
</article>
