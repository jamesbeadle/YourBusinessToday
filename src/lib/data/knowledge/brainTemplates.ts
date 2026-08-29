import { brainTypesFor, findBrainType } from './brainTypeCatalog';
import type { BrainCategory, BrainType, BrainTypeDefinition } from './knowledgeTypes';

export type BrainTemplate = {
	id: string;
	name: string;
	pitch: string;
	engineType: BrainType;
	isRecommended: boolean;
};

export const expertiseTemplates: BrainTemplate[] = [
	{
		id: 'trade_playbook',
		name: 'Trade Playbook',
		pitch:
			'What your business knows, modelled properly. Upload documents and an agent keeps your concepts, rules, and language current — in your own vocabulary.',
		engineType: 'ddd_model',
		isRecommended: true
	},
	{
		id: 'rules_and_standards',
		name: 'Rules & Standards',
		pitch:
			'Regulations, policies, and the constraints your work must satisfy — kept apart from the jobs they govern.',
		engineType: 'rules',
		isRecommended: false
	},
	{
		id: 'industry_glossary',
		name: 'Industry Glossary',
		pitch: 'The language of your trade — terms, categories, and how they relate.',
		engineType: 'taxonomy',
		isRecommended: false
	}
];

export const experienceTemplates: BrainTemplate[] = [
	{
		id: 'project_log',
		name: 'Project Log',
		pitch:
			'Everything that happened on a job, as it happened — meetings, decisions, observations, kept in order and never rewritten.',
		engineType: 'episodic_log',
		isRecommended: true
	},
	{
		id: 'client_and_job_records',
		name: 'Client & Job Records',
		pitch:
			'Structured records whose forms come straight from your Trade Playbook, so every entry lands in a known shape.',
		engineType: 'typed_records',
		isRecommended: false
	},
	{
		id: 'company_wiki',
		name: 'Company Wiki',
		pitch: 'The living reference your team actually reads — pages that update rather than pile up.',
		engineType: 'llm_wiki',
		isRecommended: false
	},
	{
		id: 'daily_log',
		name: 'Daily Log',
		pitch: 'The running diary of the business — get it down now, find it by date later.',
		engineType: 'journal',
		isRecommended: false
	}
];

export function templatesFor(category: BrainCategory): BrainTemplate[] {
	return category === 'domain' ? expertiseTemplates : experienceTemplates;
}

export function advancedTypesFor(category: BrainCategory): BrainTypeDefinition[] {
	const templateEngines = templatesFor(category).map((template) => template.engineType);
	return brainTypesFor(category).filter((definition) => !templateEngines.includes(definition.type));
}

export function engineDefinitionFor(template: BrainTemplate): BrainTypeDefinition | null {
	return findBrainType(template.engineType);
}
