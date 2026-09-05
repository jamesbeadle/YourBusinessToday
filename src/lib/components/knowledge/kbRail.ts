import { sectionIconPaths } from '../brain/dashboard/railIcons';
import type { RailItem } from '../shell/railTypes';

export type KbSectionKey =
	| 'interview'
	| 'brains'
	| 'documents'
	| 'review'
	| 'share'
	| 'chatbots'
	| 'sell'
	| 'tradeTalk'
	| 'api'
	| 'log'
	| 'settings';

const interviewIconPaths = ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'];
const chatbotIconPaths = [
	'M12 2v4',
	'M5 10a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z',
	'M9 13h.01M15 13h.01',
	'M2 13h3M19 13h3'
];

const kbRailItems: Record<KbSectionKey, RailItem> = {
	interview: { key: 'interview', label: 'The interview', iconPaths: interviewIconPaths },
	brains: { key: 'brains', label: 'Second brains', iconPaths: sectionIconPaths.model },
	documents: { key: 'documents', label: 'Source documents', iconPaths: sectionIconPaths.sources },
	review: { key: 'review', label: 'Review changes', iconPaths: sectionIconPaths.review },
	share: { key: 'share', label: 'Sharing', iconPaths: sectionIconPaths.share },
	chatbots: { key: 'chatbots', label: 'Chatbots', iconPaths: chatbotIconPaths },
	sell: { key: 'sell', label: 'Sell on the marketplace', iconPaths: sectionIconPaths.sell },
	tradeTalk: { key: 'tradeTalk', label: 'Trade Talk', iconPaths: sectionIconPaths.hive },
	api: { key: 'api', label: 'API access', iconPaths: sectionIconPaths.api },
	log: { key: 'log', label: 'The log', iconPaths: sectionIconPaths.log },
	settings: { key: 'settings', label: 'Settings', iconPaths: sectionIconPaths.settings }
};

const ownerKeys: KbSectionKey[] = [
	'interview',
	'brains',
	'documents',
	'review',
	'share',
	'chatbots',
	'api',
	'log',
	'settings'
];

const viewerKeys: KbSectionKey[] = ['interview', 'brains', 'log'];

export function kbRailItemsFor(isOwner: boolean): RailItem[] {
	const keys = isOwner ? ownerKeys : viewerKeys;
	return keys.map((key) => kbRailItems[key]);
}

export function kbSectionLabel(key: KbSectionKey): string {
	return kbRailItems[key].label;
}

const sectionParameter = 'section';

export function kbSectionHref(knowledgeBaseId: string, key: KbSectionKey): string {
	return `/knowledge-base/${knowledgeBaseId}?${sectionParameter}=${key}`;
}

// A link may ask for a section; otherwise a wide screen opens the interview
// and a phone opens nothing.
export function openingKbSection(url: URL, isOwner: boolean, isWideScreen: boolean): KbSectionKey | null {
	const requested = url.searchParams.get(sectionParameter);
	const allowed = isOwner ? ownerKeys : viewerKeys;
	const requestedSection = allowed.find((key) => key === requested);
	if (requestedSection !== undefined) return requestedSection;
	return isWideScreen ? 'interview' : null;
}
