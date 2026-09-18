export type CaseStudyFigure = {
	label: string;
	value: string;
};

export type CaseStudy = {
	id: string;
	href: string;
	clientName: string;
	clientDescription: string;
	clientWebsiteUrl: string;
	problem: string;
	idea: string;
	outcome: string;
	figures: CaseStudyFigure[];
};

export const jewelBespokeBuildCaseStudy: CaseStudy = {
	id: 'jewel-bespoke-build',
	href: '/case-studies/jewel',
	clientName: 'Jewel Bespoke Build',
	clientDescription:
		'A family-run construction company in Surrey, building loft conversions, extensions and whole-house renovations across the South of England on sixty-five years of trade experience.',
	clientWebsiteUrl: 'https://www.jewelbb.co.uk',
	problem:
		'The building was never the problem. It was everything around it. The day on site arrived in the office as messages and photographs that somebody then had to turn into a report for the client. Drawings came back marked up. Valuations were assembled by hand. The person who knew where everything was could never be away on a Friday.',
	idea:
		'We spent a week on paper with the people who do the work, and a week proving the idea in code. The idea was small enough to say in one sentence: everything arriving at the business is a communication — a photograph, a message, a marked-up drawing, an email — and a person makes one decision about each one. After that the system groups them, and the machine writes what has to be written.',
	outcome:
		'Jewel now run on a portal that shows every project at the stage it is really at, a request flow where a plain-English ask becomes a build they can watch, and a connection that lets their own Claude read a job or raise a request without opening the site.',
	figures: [
		{ value: '1,032', label: 'commits' },
		{ value: '79', label: 'build days' },
		{ value: '41', label: 'pull requests' },
		{ value: '85', label: 'connector tools' }
	]
};
