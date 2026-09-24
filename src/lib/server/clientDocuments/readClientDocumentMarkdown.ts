const markdownByPath: Record<string, string> = import.meta.glob('./documents/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
});

export function readClientDocumentMarkdown(slug: string): string | undefined {
	return markdownByPath[`./documents/${slug}.md`];
}
