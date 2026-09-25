# Refactor audit

Generated 2026-09-25 06:39 UTC.

## Headline

**Code quality score 90.2%.** **0 of 834 source files are over the 100-line limit (0.0%)**; the worst file is 0 lines.

## Code quality score

| Element | Reading | Score | Weight | 0% at |
| --- | --- | --- | --- | --- |
| **Standard baseline checks** | | **94.1%** | **52** | |
| Files over the line limit | 0 in 834 files | 100.0% | 10 | 50% of files |
| Worst file, in limits over | 0 | 100.0% | 5 | 9 |
| Functions over the line limit | 6 in 1035 functions | 97.7% | 8 | 25% of functions |
| Else blocks | 1 in 1308 branches | 99.8% | 5 | 50% of branches |
| Duplication % | not measured | not measured | — | 20 |
| Explanatory comment lines | 90 in 29.58 thousand lines | 93.9% | 4 | 50 per thousand lines |
| Inline magic values | 36 in 29.58 thousand lines | 93.9% | 4 | 20 per thousand lines |
| Orphan components and functions | 29 in 1218 components and functions | 76.2% | 4 | 10% of components and functions |
| Long member chain lines | 208 in 29.58 thousand lines | 76.6% | 4 | 30 per thousand lines |
| Deeply indented lines | 94 in 29.58 thousand lines | 89.4% | 4 | 30 per thousand lines |
| Overlong function names | 2 in 1035 functions | 98.1% | 4 | 10% of functions |
| **Design pattern file count** | | **92.6%** | **10** | |
| Files the patterns predict but are missing | 1 in 27 predicted files | 92.6% | 10 | 50% of predicted files |
| Entities outside their expected file count | not measured | not measured | — | 50% of entities |
| **Prose** | | **79.0%** | **20** | |
| Conditions with calls tangled inside calls | 24 in 1308 branches | 92.7% | 8 | 25% of branches |
| Conditions compared to a raw literal | 109 in 1308 branches | 66.7% | 6 | 25% of branches |
| Accessor names that want to be a property | 28 in 1035 functions | 72.9% | 6 | 10% of functions |
| **Widget adoption** | | **not measured** | **0** | |
| Markup written by hand where a widget should be | not measured | not measured | — | 50% of widget slots |

Each element scores 100% with no offenders and falls in a straight line to 0% when its offenders, measured against the size of the codebase, reach the figure in the last column. The score is the weighted average of the elements that could be measured; an element that could not be measured lends its weight to the rest. Weights and zero points are set in `tools/refactor/rules.json` under `score.elements`. The offenders behind every reading are in `tools/refactor/audit-output/audit.json`.

## The repository by area

| Area | Files | Of which audited source | Source lines |
| --- | --- | --- | --- |
| backend | 367 | 364 | 11,365 |
| frontend | 239 | 230 | 8,950 |
| shared | 114 | 113 | 3,742 |
| api | 90 | 90 | 4,246 |
| database | 60 | 0 | 0 |
| tooling | 43 | 0 | 0 |
| docs | 40 | 0 | 0 |
| tests | 37 | 37 | 1,281 |
| infrastructure | 12 | 0 | 0 |
| **whole repository** | **1,002** | **834** | **29,584** |

## Summary

| Check | Key figures |
| --- | --- |
| fileLength | limit: 100, filesOverLimit: 0, totalFiles: 834, totalLines: 29584, worstFileLines: 0, worstFileTimesOverLimit: 0.0 |
| functionShape | limit: 30, functionsOverLimit: 6, totalFunctions: 1035, elseBlocks: 1, ifBlocks: 1308, measurementIsHeuristic: True |
| functionNames | overlongFunctionNames: 2, maxWords: 5, maxLength: 40 |
| accessorNames | gluedAccessorNames: 28, measurementIsHeuristic: True |
| duplication | skipped: jscpd is not installed (npm install -g jscpd) |
| naming | bannedAbbreviationHits: 17, unprefixedBooleans: 1 |
| comments | explanatoryCommentLines: 90, filesWithComments: 39, taskMarkers: 0 |
| magicValues | inlineHexColours: 4, inlineStyleAttributes: 2, repeatedStringLiterals: 30 |
| prose | longMemberChainLines: 208, deeplyIndentedLines: 94, overlongLines: 75, measurementIsHeuristic: True |
| conditions | tangledConditionLines: 24, literalComparisonLines: 109, measurementIsHeuristic: True |
| orphans | orphanFunctions: 26, functionsExamined: 1035 |
| designPatterns | roleFamilies: 45, predictedFiles: 27, predictedFilesMissing: 1, entities: 0, entitiesOutOfRange: 0, measurementIsHeuristic: True |
| inventory | pages: 30, components: 183, orphanComponents: 3, averagePageLines: 50 |
| siteDefinition | skipped: no siteDefinition catalogue in rules.json |
| fileAreas | totalFiles: 1002, backend: 367, frontend: 239, shared: 114, api: 90, database: 60, tooling: 43, docs: 40, tests: 37, infrastructure: 12 |

## Against the baseline

| Ratcheted figure | Baseline | Now | Verdict |
| --- | --- | --- | --- |
| code quality score | not measured | 90.2% | — |
| fileLength.filesOverLimit | 0 | 0 | held |
| fileLength.worstFileLines | 0 | 0 | held |
| functionShape.functionsOverLimit | 6 | 6 | held |
| functionShape.elseBlocks | 1 | 1 | held |
| duplication.duplicatedPercentage | 0.42 | None | — |
| comments.explanatoryCommentLines | 90 | 90 | held |
| magicValues.inlineHexColours | 4 | 4 | held |
| inventory.orphanComponents | 3 | 3 | held |
| orphans.orphanFunctions | None | 26 | — |
| prose.longMemberChainLines | 58 | 208 | worse |
| prose.deeplyIndentedLines | 113 | 94 | better |
| functionNames.overlongFunctionNames | 2 | 2 | held |
| accessorNames.gluedAccessorNames | None | 28 | — |
| conditions.tangledConditionLines | None | 24 | — |
| conditions.literalComparisonLines | None | 109 | — |
| designPatterns.predictedFilesMissing | None | 1 | — |
| siteDefinition.handRolledElements | None | None | — |

## Worst files by length

All files are within the limit.

Full detail, including every offender list, is in `audit.json`.
