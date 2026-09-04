import type { LegalDocument } from './legalDocument';

export const privacyStatement: LegalDocument = {
	title: 'Privacy statement',
	metaDescription:
		'How Your Business Today collects, uses, protects, and deletes your information — and the promise we make about your business profile.',
	lastUpdatedOn: '21 August 2026',
	sections: [
		{
			heading: 'Who we are',
			paragraphs: [
				'Your Business Today Ltd, a company registered in England and Wales, is the data controller for the personal information handled by yourbusiness.today. For anything in this statement, contact consulting@yourbusiness.today.',
				'The short version of our promise, stated once here and repeated wherever it matters: your business profile powers your tools and nothing else. It is never sold, never pooled, never used to train anything for anyone else, and it leaves when you do.'
			]
		},
		{
			heading: 'What we collect',
			paragraphs: ['We hold three kinds of information:'],
			listItems: [
				'Account details — your email address, display name, and which sign-in method you use (Google, or email and password).',
				'Business content — the documents you upload, the answers you give the interviewer, and the maps, models, and conversations built from them.',
				'Activity records — your credit purchases and spends, shares you create, notifications, and listings or applications you make on the Market or the Hive Mind. Card details go directly to Stripe; we never see or store them.'
			]
		},
		{
			heading: 'How we use it',
			paragraphs: [
				'We use your information to run the service you asked for: signing you in, drawing your map, maintaining your expertise brain, answering your questions from your own records, fulfilling credit purchases, delivering shares and marketplace access, and sending service notifications. The legal basis for almost all of this is performing our contract with you; keeping the service secure and improving it rests on our legitimate interests.',
				'We do not use your information for advertising, and we do not sell it to anyone.'
			]
		},
		{
			heading: 'AI processing',
			paragraphs: [
				'When an agent replies to you, the content needed to answer — your message, and the relevant parts of your profile or brain — is sent to Anthropic’s Claude API to generate the reply. It is used to produce your answer and is not used to train models for anyone else.'
			]
		},
		{
			heading: 'Who processes it for us',
			paragraphs: ['A small number of providers process data on our behalf:'],
			listItems: [
				'Supabase — authentication and the database where your account and content live.',
				'Stripe — payment processing for credit packs.',
				'Anthropic — AI processing of the content sent to generate agent replies.',
				'Vercel — hosting of the application.'
			]
		},
		{
			heading: 'Who else can see it',
			paragraphs: [
				'Only the people you choose. Sharing your map gives the named person read-only access. Listing a brain edition on the Market gives buyers the access your listing describes. Hive Mind answers are drawn from the snapshot you agreed to when your application was approved. Beyond that, we disclose information only where the law requires it.'
			]
		},
		{
			heading: 'How long we keep it',
			paragraphs: [
				'We keep your information while your account is active. When your account is deleted, your content and profile are deleted with it. Records of purchases are kept for as long as tax and accounting law requires, and no longer.'
			]
		},
		{
			heading: 'Your rights',
			paragraphs: [
				'Under UK data protection law you can ask us for a copy of your information, ask us to correct it, delete it, or restrict how we use it, object to our use of it, and receive it in a portable form — the expertise brain export exists precisely for that. Contact us and we will respond within a month.',
				'If you are unhappy with how we handle your information you can complain to the Information Commissioner’s Office at ico.org.uk.'
			]
		},
		{
			heading: 'Cookies',
			paragraphs: [
				'We use only the cookies needed to keep you signed in and the service working. There are no advertising or third-party tracking cookies.'
			]
		},
		{
			heading: 'Changes to this statement',
			paragraphs: [
				'If how we handle your information changes, this statement will change with it, and the date at the top will tell you when. Material changes will be flagged on the site or by email.'
			]
		}
	]
};
