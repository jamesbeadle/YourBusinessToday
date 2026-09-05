import { builderDoctrine } from './builderDoctrine';
import type { BuildPack } from './claimBuild';

export function describeBuildPack(pack: BuildPack): string {
	return [
		`Task: ${pack.title} (id: ${pack.taskId})`,
		`Project: ${pack.projectName}`,
		`Repository: ${pack.repositoryUrl}`,
		`Runs at: ${pack.environmentUrl === '' ? 'not recorded' : pack.environmentUrl}`,
		`Branch: ${pack.branchName}`,
		pack.story === '' ? '' : `Story: ${pack.story}`,
		'',
		'Brief:',
		pack.brief,
		'',
		...criterionLines(pack),
		'',
		builderDoctrine
	]
		.filter((line, index, lines) => !(line === '' && lines[index - 1] === ''))
		.join('\n');
}

function criterionLines(pack: BuildPack): string[] {
	if (pack.criteria.length === 0) return ['Acceptance criteria: none written. Meet the brief.'];
	return [
		'Acceptance criteria:',
		...pack.criteria.map((criterion) => `- ${criterion.description}`)
	];
}
