const schemePrefix = /^[a-z]+:\/\//;
const sshPrefix = /^git@([^:]+):/;
const wwwPrefix = /^www\./;
const gitSuffix = /\.git$/;
const trailingSlashes = /\/+$/;

/** One spelling for a repository however it was written, so a URL from GitHub matches the one a person typed. */
export function repositoryUrlKey(url: string): string {
	return url
		.trim()
		.toLowerCase()
		.replace(sshPrefix, '$1/')
		.replace(schemePrefix, '')
		.replace(wwwPrefix, '')
		.replace(trailingSlashes, '')
		.replace(gitSuffix, '');
}

export function isSameRepository(left: string, right: string): boolean {
	const leftKey = repositoryUrlKey(left);
	return leftKey !== '' && leftKey === repositoryUrlKey(right);
}
