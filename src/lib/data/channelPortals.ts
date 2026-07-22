export type ChannelPortal = {
	id: string;
	name: string;
	handle: string;
	url: string;
	accentColour: string;
};

export const channelPortals: ChannelPortal[] = [
	{
		id: 'youtube',
		name: 'YouTube',
		handle: '@YourBusinessToday',
		url: 'https://www.youtube.com/@yourbusinesstoday',
		accentColour: '#ff4d5e'
	},
	{
		id: 'x',
		name: 'X',
		handle: '@YourBusinessTdy',
		url: 'https://x.com/yourbusinesstdy',
		accentColour: '#eef1f8'
	},
	{
		id: 'instagram',
		name: 'Instagram',
		handle: '@yourbusinesstoday',
		url: 'https://www.instagram.com/yourbusinesstoday',
		accentColour: '#ffc861'
	},
	{
		id: 'tiktok',
		name: 'TikTok',
		handle: '@yourbusinesstoday',
		url: 'https://www.tiktok.com/@yourbusinesstoday',
		accentColour: '#2fd48a'
	},
	{
		id: 'linkedin',
		name: 'LinkedIn',
		handle: 'Your Business Today',
		url: 'https://www.linkedin.com/company/yourbusinesstoday',
		accentColour: '#0098d8'
	}
];
