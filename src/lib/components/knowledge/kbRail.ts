import { sectionIconPaths } from '../brain/dashboard/railIcons';
import type { RailItem } from '../shell/railTypes';

export type KbSectionKey =
	| 'interview'
	| 'brains'
	| 'documents'
	| 'review'
	| 'share'
	| 'sell'
	| 'tradeTalk'
	| 'api'
	| 'log'
	| 'settings';

const interviewIconPaths = ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'];

const kbRailItems: Record<KbSectionKey, RailItem> = {
	interview: { key: 'interview', label: 'The interview', iconPaths: interviewIconPaths },
	brains: { key: 'brains', label: 'Second brains', iconPaths: sectionIconPaths.model },
	documents: { key: 'documents', label: 'Source documents', iconPaths: sectionIconPaths.sources },
	review: { key: 'review', label: 'Review changes', iconPaths: sectionIconPaths.review },
	share: { key: 'share', label: 'Sharing', iconPaths: sectionIconPaths.share },
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
	'sell',
	'tradeTalk',
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
