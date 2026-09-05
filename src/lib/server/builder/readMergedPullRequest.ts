export type MergedPullRequest = { branchName: string; url: string };

type PullRequestEvent = {
	action?: string;
	pull_request?: { merged?: boolean; html_url?: string; head?: { ref?: string } };
};

export function readMergedPullRequest(event: unknown): MergedPullRequest | null {
	const { action, pull_request: pullRequest } = event as PullRequestEvent;
	if (action !== 'closed' || pullRequest === undefined) return null;
	if (pullRequest.merged !== true) return null;
	const branchName = pullRequest.head?.ref ?? '';
	const url = pullRequest.html_url ?? '';
	if (branchName === '' || url === '') return null;
	return { branchName, url };
}
