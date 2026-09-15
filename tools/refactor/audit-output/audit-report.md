# Refactor audit

Generated 2026-09-15 17:14 UTC.

## Headline

**0 of 740 source files are over the 100-line limit (0.0%)**; the worst file is 0 lines.

## Summary

| Check | Key figures |
| --- | --- |
| fileLength | limit: 100, filesOverLimit: 0, totalFiles: 740, worstFileLines: 0 |
| functionShape | limit: 30, functionsOverLimit: 6, elseBlocks: 1, measurementIsHeuristic: True |
| functionNames | overlongFunctionNames: 2, maxWords: 5, maxLength: 40 |
| duplication | clones: 8, duplicatedLines: 106, totalLines: 25640, duplicatedPercentage: 0.41 |
| naming | bannedAbbreviationHits: 0, unprefixedBooleans: 0 |
| comments | explanatoryCommentLines: 90, filesWithComments: 39, taskMarkers: 0 |
| magicValues | inlineHexColours: 4, inlineStyleAttributes: 2, repeatedStringLiterals: 30 |
| prose | longMemberChainLines: 58, deeplyIndentedLines: 113, overlongLines: 56, measurementIsHeuristic: True |
| inventory | pages: 24, components: 158, orphanComponents: 3, averagePageLines: 54 |

## Against the baseline

| Ratcheted figure | Baseline | Now | Verdict |
| --- | --- | --- | --- |
| fileLength.filesOverLimit | 0 | 0 | held |
| fileLength.worstFileLines | 0 | 0 | held |
| functionShape.functionsOverLimit | 6 | 6 | held |
| functionShape.elseBlocks | 1 | 1 | held |
| duplication.duplicatedPercentage | 0.42 | 0.41 | better |
| comments.explanatoryCommentLines | 90 | 90 | held |
| magicValues.inlineHexColours | 4 | 4 | held |
| inventory.orphanComponents | 3 | 3 | held |
| prose.longMemberChainLines | 58 | 58 | held |
| prose.deeplyIndentedLines | 113 | 113 | held |
| functionNames.overlongFunctionNames | 2 | 2 | held |

## Worst files by length

All files are within the limit.

Full detail, including every offender list, is in `audit.json`.
