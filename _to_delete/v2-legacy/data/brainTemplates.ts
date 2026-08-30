export type BrainTemplateCategory = {
	slug: string;
	title: string;
	tagline: string;
	accentColor: string;
};

export type BrainTemplate = {
	slug: string;
	categorySlug: string;
	title: string;
	tagline: string;
	icon: string;
	namePlaceholder: string;
	domainGoal: string;
	feedIdeas: string[];
	exampleQuestions: string[];
};

export const brainTemplateCategories: BrainTemplateCategory[] = [
	{
		slug: 'vehicles-and-machines',
		title: 'Vehicles & machines',
		tagline: 'A full history that travels with the asset — and adds to its value when you sell.',
		accentColor: 'var(--color-tube-victoria)'
	},
	{
		slug: 'home-and-property',
		title: 'Home & property',
		tagline: 'Every certificate, tradesperson and repair, remembered for you.',
		accentColor: 'var(--color-go)'
	},
	{
		slug: 'sport-and-passions',
		title: 'Sport & passions',
		tagline: 'Logs and collections that learn what works and never forget a detail.',
		accentColor: 'var(--color-tube-circle)'
	},
	{
		slug: 'life-and-family',
		title: 'Life & family',
		tagline: 'The records and stories that matter most, kept safe and askable.',
		accentColor: 'var(--color-caution)'
	},
	{
		slug: 'work-and-business',
		title: 'Work & business',
		tagline: 'How the work gets done, captured so anyone can ask.',
		accentColor: 'var(--color-signal)'
	}
];

export const brainTemplates: BrainTemplate[] = [
	{
		slug: 'car',
		categorySlug: 'vehicles-and-machines',
		title: 'Car',
		tagline: 'Every service, MOT and repair — the complete story of one car.',
		icon: '🚗',
		namePlaceholder: 'The Golf, Mum’s Fiesta…',
		domainGoal:
			'The domain of owning, maintaining and running a car — servicing, MOT and inspections, repairs, parts and tyres, insurance, tax and ownership history. Model the concepts a complete vehicle history needs, so every question about what was done, when, by whom and at what cost can be answered from the records.',
		feedIdeas: [
			'Service invoices and garage receipts',
			'MOT certificates and advisories',
			'The V5C and purchase paperwork',
			'Insurance and warranty documents'
		],
		exampleQuestions: [
			'When was the cambelt last changed?',
			'What advisories came up on the last two MOTs?',
			'What has this car cost me per year?'
		]
	},
	{
		slug: 'boat',
		categorySlug: 'vehicles-and-machines',
		title: 'Boat',
		tagline: 'Engine hours, antifoul, surveys and safety kit — shipshape on paper too.',
		icon: '⛵',
		namePlaceholder: 'Morning Star, the RIB…',
		domainGoal:
			'The domain of owning and running a boat — engine servicing, hull and antifoul work, safety equipment and its expiry dates, mooring and storage, licensing, insurance and surveys. Model the concepts a complete vessel history needs, so every question about the boat’s condition and paperwork can be answered from the records.',
		feedIdeas: [
			'Engine service records and hours logs',
			'Survey reports and insurance documents',
			'Mooring, licence and safety certificates',
			'Yard invoices for hull and antifoul work'
		],
		exampleQuestions: [
			'When does the life raft need servicing?',
			'What did the last survey flag on the hull?',
			'How many hours since the engine was serviced?'
		]
	},
	{
		slug: 'caravan-or-motorhome',
		categorySlug: 'vehicles-and-machines',
		title: 'Caravan & motorhome',
		tagline: 'Habitation checks, damp readings and every trip it has taken.',
		icon: '🚐',
		namePlaceholder: 'The Bailey, our camper…',
		domainGoal:
			'The domain of owning and touring with a caravan or motorhome — habitation checks, gas and damp inspections, servicing and repairs, insurance and storage, weights and towing limits, and the record of its travels. Model the concepts a complete history of the vehicle and its touring life would need.',
		feedIdeas: [
			'Habitation check and service reports',
			'Damp and gas inspection records',
			'Insurance, storage and club paperwork',
			'Weight plates and towing documents'
		],
		exampleQuestions: [
			'What were the damp readings last year?',
			'What’s my remaining payload with a full water tank?',
			'When is the next habitation check due?'
		]
	},
	{
		slug: 'equipment',
		categorySlug: 'vehicles-and-machines',
		title: 'Machinery & equipment',
		tagline: 'An askable asset register for plant, tools and machines.',
		icon: '🚜',
		namePlaceholder: 'Farm machinery, site plant…',
		domainGoal:
			'The domain of owning and operating equipment and machinery — purchase and warranty, scheduled servicing, inspections and certifications, repairs and parts, operating records and running costs. Model the concepts any asset register and maintenance log would need, whatever machines the documents describe.',
		feedIdeas: [
			'Purchase invoices and warranties',
			'Service schedules and job sheets',
			'Inspection and certification records',
			'Operator manuals and parts lists'
		],
		exampleQuestions: [
			'Which machines are due an inspection this quarter?',
			'What parts did the last repair on the digger use?',
			'What’s still under warranty?'
		]
	},
	{
		slug: 'house',
		categorySlug: 'home-and-property',
		title: 'House',
		tagline: 'A home logbook — and a head start when you come to sell.',
		icon: '🏠',
		namePlaceholder: '42 Elm Street, the cottage…',
		domainGoal:
			'The domain of owning and running a house — purchase and deeds, mortgage and insurance, utilities, appliances and warranties, maintenance and improvements, tradespeople and certificates. Model the concepts a complete home logbook needs, so the house’s full story could be handed to a surveyor, insurer or future buyer.',
		feedIdeas: [
			'Purchase papers, surveys and deeds',
			'Boiler service and electrical certificates',
			'Appliance manuals and warranties',
			'Invoices from builders and tradespeople'
		],
		exampleQuestions: [
			'Who rewired the kitchen and when?',
			'Which appliances are still under warranty?',
			'When was the boiler last serviced?'
		]
	},
	{
		slug: 'rental-property',
		categorySlug: 'home-and-property',
		title: 'Rental property',
		tagline: 'Tenancies, certificates and deadlines — compliance that keeps itself.',
		icon: '🔑',
		namePlaceholder: 'Flat 3, the Leeds house…',
		domainGoal:
			'The domain of letting a property — tenancies and deposits, rent records, gas, electrical and energy certificates with their renewal dates, inspections, repairs, tradespeople and the landlord’s compliance duties. Model the concepts any landlord’s records need, so no certificate, deadline or obligation is ever lost.',
		feedIdeas: [
			'Tenancy agreements and deposit records',
			'Gas safety, EICR and EPC certificates',
			'Inspection reports and repair invoices',
			'Correspondence with tenants and agents'
		],
		exampleQuestions: [
			'When does the gas safety certificate expire?',
			'What repairs has the bathroom needed?',
			'Is the deposit protected, and where?'
		]
	},
	{
		slug: 'renovation',
		categorySlug: 'home-and-property',
		title: 'Renovation project',
		tagline: 'Quotes, trades, decisions — and what’s hidden behind which wall.',
		icon: '🛠️',
		namePlaceholder: 'The extension, loft conversion…',
		domainGoal:
			'The domain of a building project — designs and planning permission, building regulations, quotes and contracts, trades and schedules, materials, costs against budget, and what was built where. Model the concepts any renovation record needs, so decisions and hidden details can be recalled years later.',
		feedIdeas: [
			'Drawings and planning documents',
			'Quotes, contracts and invoices',
			'Building control sign-offs',
			'Photos of work before it was covered up'
		],
		exampleQuestions: [
			'Where do the new pipes run in the kitchen?',
			'How far over budget is the project?',
			'Which electrician did the first fix?'
		]
	},
	{
		slug: 'holiday-let',
		categorySlug: 'home-and-property',
		title: 'Holiday let',
		tagline: 'The property, its quirks and every guest answer — a host’s manual that talks.',
		icon: '🌊',
		namePlaceholder: 'Seaview Cottage, the Airbnb…',
		domainGoal:
			'The domain of running a holiday let — the property and its quirks, guest information and frequently asked questions, changeover and cleaning routines, suppliers and tradespeople, bookings, reviews and compliance. Model the concepts a host’s operations manual needs, so anyone could run a changeover or answer a guest from it.',
		feedIdeas: [
			'The guest welcome pack and house guide',
			'Changeover and cleaning checklists',
			'Supplier and tradesperson contacts',
			'Guest questions and reviews'
		],
		exampleQuestions: [
			'How does the hot tub get ready for arrival day?',
			'What do guests most often complain about?',
			'Who fixes the Wi-Fi and what does it cost?'
		]
	},
	{
		slug: 'sport-or-activity',
		categorySlug: 'sport-and-passions',
		title: 'Sport or activity',
		tagline: 'Golf, badminton, running — a training log that spots the patterns.',
		icon: '⛳',
		namePlaceholder: 'My golf, marathon training…',
		domainGoal:
			'The domain of one sport or activity as its records describe it — sessions, rounds and matches, technique and coaching notes, equipment, venues, competition and progress over time. Model the concepts any training log for the activity would need, so patterns and progress can be drawn out of the records.',
		feedIdeas: [
			'Scorecards, session logs and results',
			'Coaching notes and lesson summaries',
			'Equipment specs and setup notes',
			'Competition entries and handicap records'
		],
		exampleQuestions: [
			'What does my coach keep telling me about my grip?',
			'How have my scores trended this season?',
			'Which course do I play best and why?'
		]
	},
	{
		slug: 'collection',
		categorySlug: 'sport-and-passions',
		title: 'Collection',
		tagline: 'Watches, vinyl, wine — provenance and value, catalogued and askable.',
		icon: '⌚',
		namePlaceholder: 'The watch box, wine cellar…',
		domainGoal:
			'The domain of collecting — items and their provenance, acquisition and valuation, condition and care, storage and insurance, makers, series and the language collectors use. Model the concepts any catalogue of the collection would need, so each piece’s story and the collection’s shape are always at hand.',
		feedIdeas: [
			'Receipts and auction records',
			'Valuations and insurance schedules',
			'Condition notes and service papers',
			'Reference articles about makers and series'
		],
		exampleQuestions: [
			'What did I pay for the Speedmaster and what’s it insured for?',
			'Which pieces are due a service or revaluation?',
			'What gaps are left in the 1970s run?'
		]
	},
	{
		slug: 'garden',
		categorySlug: 'sport-and-passions',
		title: 'Garden & allotment',
		tagline: 'What went where, what thrived, what the frost took — season after season.',
		icon: '🌱',
		namePlaceholder: 'The allotment, back garden…',
		domainGoal:
			'The domain of a garden or allotment through its seasons — beds and plots, what was sown and planted where and when, varieties, feeding, pests and treatments, harvests and weather. Model the concepts any growing journal needs, so each season learns from the last.',
		feedIdeas: [
			'Planting notes and seed packets',
			'Photos of beds through the year',
			'Harvest tallies and variety reviews',
			'Soil tests and treatment records'
		],
		exampleQuestions: [
			'Which tomato variety did best last year?',
			'When did I last lime the brassica bed?',
			'What was planted in bed three the past two seasons?'
		]
	},
	{
		slug: 'fishing',
		categorySlug: 'sport-and-passions',
		title: 'Fishing',
		tagline: 'Waters, weather, baits and catches — the log that learns your waters.',
		icon: '🎣',
		namePlaceholder: 'Carp fishing, the syndicate lake…',
		domainGoal:
			'The domain of angling as its records describe it — waters and swims, sessions and catches, baits, rigs and tackle, conditions and seasons, permits and club rules. Model the concepts any fishing log would need, so the records reveal what works, where and when.',
		feedIdeas: [
			'Session logs and catch photos',
			'Notes on baits, rigs and tackle',
			'Club rules and permit paperwork',
			'Venue maps and swim notes'
		],
		exampleQuestions: [
			'What bait has produced most in autumn?',
			'Which swims fish best in a south-westerly?',
			'What’s my biggest fish from each water?'
		]
	},
	{
		slug: 'pet',
		categorySlug: 'life-and-family',
		title: 'Pet',
		tagline: 'Vaccinations, vet visits, diet — everything a vet or sitter would ask.',
		icon: '🐾',
		namePlaceholder: 'Bella, the labrador…',
		domainGoal:
			'The domain of caring for a pet — vaccinations, treatments and vet visits, weight and diet, insurance, identity and breeding records, routines and behaviour. Model the concepts a complete pet health and care record needs, so any question a vet, sitter or kennel would ask can be answered.',
		feedIdeas: [
			'Vaccination cards and vet letters',
			'Insurance policy and claim records',
			'Diet, weight and medication notes',
			'Microchip and pedigree papers'
		],
		exampleQuestions: [
			'When is the next booster due?',
			'What did the vet say about her weight last visit?',
			'What food and doses does the sitter need to know?'
		]
	},
	{
		slug: 'wedding',
		categorySlug: 'life-and-family',
		title: 'Wedding',
		tagline: 'Venues, vendors, budget and guest list — every detail one question away.',
		icon: '💍',
		namePlaceholder: 'Our wedding, June 2027…',
		domainGoal:
			'The domain of planning a wedding — venues and vendors, quotes and contracts, budget against spend, the guest list and RSVPs, timelines and the decisions behind them. Model the concepts any wedding plan needs, so every supplier detail and deadline can be recalled in seconds.',
		feedIdeas: [
			'Venue and supplier quotes and contracts',
			'The guest list and RSVP tracker',
			'Budget spreadsheets and receipts',
			'Emails with key decisions'
		],
		exampleQuestions: [
			'What’s left to pay the photographer and when?',
			'Who hasn’t RSVP’d from the groom’s side?',
			'What did the florist agree to include?'
		]
	},
	{
		slug: 'family-history',
		categorySlug: 'life-and-family',
		title: 'Family history',
		tagline: 'The people, places and stories — preserved before they’re lost.',
		icon: '📜',
		namePlaceholder: 'The Beadle family, Grandma’s story…',
		domainGoal:
			'The domain of a family’s history — people and the relationships between them, births, marriages and migrations, places and dates, documents, photographs and the stories passed down. Model the concepts any family archive needs, so what’s known, what’s sourced and what’s still missing stays clear.',
		feedIdeas: [
			'Birth, marriage and death certificates',
			'Old letters, photographs and diaries',
			'Census records and research notes',
			'Recorded or written family stories'
		],
		exampleQuestions: [
			'How are we related to the Yorkshire branch?',
			'Where was great-grandfather born, and what’s the source?',
			'Which lines still have gaps to research?'
		]
	},
	{
		slug: 'business-handbook',
		categorySlug: 'work-and-business',
		title: 'Business handbook',
		tagline: 'How your business actually runs — askable by every new starter.',
		icon: '🏢',
		namePlaceholder: 'How we work, the studio handbook…',
		domainGoal:
			'The domain of how this business runs — its services, processes and standards, roles and responsibilities, suppliers and tools, policies and the language the team uses. Model the concepts any operations handbook needs, so a new starter could learn how things are done here by asking.',
		feedIdeas: [
			'Process docs and checklists',
			'Policies and onboarding notes',
			'Supplier and tool records',
			'Templates the team relies on'
		],
		exampleQuestions: [
			'How do we onboard a new customer?',
			'Who approves spending over the limit?',
			'Which supplier do we use for printing, and why?'
		]
	},
	{
		slug: 'client',
		categorySlug: 'work-and-business',
		title: 'Client',
		tagline: 'One brain per client — every brief, decision and preference remembered.',
		icon: '🤝',
		namePlaceholder: 'Acme Ltd, the bakery account…',
		domainGoal:
			'The domain of serving one client — their organisation and people, the brief and scope, decisions and approvals, preferences and standards, deliverables and the history of work together. Model the concepts any client account record needs, so every past decision and preference is one question away.',
		feedIdeas: [
			'Briefs, proposals and contracts',
			'Meeting notes and key emails',
			'Brand or style guidelines',
			'Delivered work and feedback'
		],
		exampleQuestions: [
			'What did we agree was out of scope?',
			'Who signs off creative on their side?',
			'What feedback did round one get?'
		]
	}
];

export const scratchBrainTemplate: BrainTemplate = {
	slug: 'scratch',
	categorySlug: '',
	title: 'Start from scratch',
	tagline: 'Name the domain and write your own goal — the brain will follow it.',
	icon: '✨',
	namePlaceholder: 'Football, contracts, site operations…',
	domainGoal: '',
	feedIdeas: [],
	exampleQuestions: []
};

const scratchAccentColor = 'var(--color-signal)';

export function brainTemplatesInCategory(categorySlug: string): BrainTemplate[] {
	return brainTemplates.filter((template) => template.categorySlug === categorySlug);
}

export function brainTemplateAccentColor(template: BrainTemplate): string {
	const category = brainTemplateCategories.find(
		(candidate) => candidate.slug === template.categorySlug
	);
	if (category === undefined) return scratchAccentColor;
	return category.accentColor;
}
