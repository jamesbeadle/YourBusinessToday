export type ChatbotSummary = {
	id: string;
	knowledgeBaseId: string;
	ownerId: string;
	name: string;
	poolCredits: number;
	isPaused: boolean;
	modelId: string;
	memberCount: number;
	createdAt: string;
};

export type ChatbotMember = {
	id: string;
	invitedEmail: string;
	hasJoined: boolean;
	modelId: string | null;
	allowanceCredits: number;
	spentCredits: number;
	joinedAt: string | null;
};

export type ChatbotTopUp = {
	id: string;
	credits: number;
	createdAt: string;
};

export type ChatbotMembership = {
	allowanceCredits: number;
	spentCredits: number;
	// The member's override, or the bot's own model when there is none.
	modelId: string;
};

export type ChatbotSpeaker = 'member' | 'bot';

export type ChatbotMessage = {
	id: string;
	speaker: ChatbotSpeaker;
	body: string;
	citedPageKeys: string[];
	createdAt: string;
};

export type ChatbotAnswer = {
	answerMarkdown: string;
	citedPageKeys: string[];
};

export type MemberAllowance = { memberId: string; allowance: number };

export type MemberChatbot = {
	id: string;
	name: string;
	allowanceCredits: number;
	spentCredits: number;
	isPaused: boolean;
};
