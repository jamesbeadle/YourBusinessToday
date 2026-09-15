import { describe, expect, it } from 'vitest';
import { isSameRepository, repositoryUrlKey } from './repositoryUrlKey';

describe('repositoryUrlKey', () => {
	it('reads every spelling of the same repository the same way', () => {
		const spellings = [
			'https://github.com/jamesbeadle/jewel-portal',
			'https://github.com/jamesbeadle/jewel-portal.git',
			'https://github.com/jamesbeadle/jewel-portal/',
			'HTTPS://WWW.GitHub.com/JamesBeadle/Jewel-Portal',
			'git@github.com:jamesbeadle/jewel-portal.git',
			'  https://github.com/jamesbeadle/jewel-portal  '
		];
		for (const spelling of spellings) {
			expect(repositoryUrlKey(spelling)).toBe('github.com/jamesbeadle/jewel-portal');
		}
	});

	it('tells two repositories apart', () => {
		expect(
			isSameRepository(
				'https://github.com/jamesbeadle/jewel-portal',
				'https://github.com/jamesbeadle/YourBusinessToday'
			)
		).toBe(false);
	});

	it('never matches a project with no repository recorded', () => {
		expect(isSameRepository('', '')).toBe(false);
		expect(isSameRepository('', 'https://github.com/jamesbeadle/jewel-portal')).toBe(false);
	});
});
