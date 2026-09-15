export const refactorRoundStoryPoints = 13;

export const refactorRoundBrief = [
	'REFACTOR round — a maintenance round of the repository’s refactor programme, not a feature.',
	'A person’s Claude runs it in the working tree with the repository’s refactor-round skill',
	'(.claude/skills/refactor-round/SKILL.md); the person commits. Nothing here opens a pull request.',
	'1. Read the coding rules at the top of CLAUDE.md, then tools/refactor/playbook.md, then the',
	'   skill, and follow the skill exactly. If the repository has no tools/refactor, run the',
	'   project-process bootstrap first.',
	'2. Baseline first: run the audit and the gate against tools/refactor/baseline.json. The report',
	'   you start from is the round’s before. A failing gate means drift: adopt the reading as the',
	'   baseline and say so.',
	'3. Run one extraction round: the worst files over the limit first, behaviour unchanged, the',
	'   repository’s checks green after every step.',
	'4. Baseline last: re-run the audit, copy audit.json over baseline.json, rewrite',
	'   tools/refactor/baseline-report.md in the skill’s shape, and post the before → after headline',
	'   on this task.',
	'5. Feature freeze: no new behaviour and no schema change. What a change would need, leave and',
	'   name in the report.'
].join('\n');

export function refactorRoundRaisedSentence(deploysSince: number, defaultBranch: string): string {
	return `Raised by the deploy count: ${deploysSince} pushes to ${defaultBranch} since the last round. Run the repository’s refactor-round skill (or its end-of-day script) and post the before → after headline here; this task is the round’s record.`;
}
