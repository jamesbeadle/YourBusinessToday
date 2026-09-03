import { renderDomainModelIndex } from '../brain/getBrainPageIndex';
import type { ChatbotBrainModel } from './getChatbotBrains';

export function renderChatbotIndex(brains: ChatbotBrainModel[]): string {
	if (brains.length === 0) return 'The knowledge base has no expertise brains yet.';
	return brains.map(renderBrain).join('\n\n');
}

function renderBrain(brain: ChatbotBrainModel): string {
	const keyedPages = brain.pages.map((page) => ({ ...page, slug: `${brain.handle}/${page.slug}` }));
	const header = `## Brain: ${brain.name} [${brain.handle}]\n${brain.description}`;
	return `${header}\n\n${renderDomainModelIndex(brain.contexts, keyedPages)}`;
}
