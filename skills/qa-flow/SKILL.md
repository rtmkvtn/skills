---
name: qa-flow
description: Create QA testing flows for implemented features. Detects recently completed work, proposes testing scope from GitHub/GitLab issues, generates QA checklists, and submits them as QA issues. Use when user wants to create QA flows, test plans, testing checklists, or verify implemented features.
---

# QA Flow

Generate QA testing flows with checklists for implemented features and submit them as issues.

## Process

<platform-detection>
Before running issue commands, detect the hosting platform:
1. Run `git remote get-url origin`
2. If URL contains "github.com" → use `gh` CLI
3. If URL contains "gitlab" → use `glab` CLI
4. Otherwise → ask the user which platform and CLI to use
</platform-detection>

### 1. Detect recently completed work

Check for recent activity to propose testing scope:

1. Run `git log --oneline -20` to find recent commits
2. Look for commits referencing issues (`Closes #N`, `Fixes #N`)
3. Fetch recently closed issues:
   - **GitHub**: `gh issue list --state closed --json number,title,body,labels,closedAt --limit 20`
   - **GitLab**: `glab issue list --closed --per-page 20`
4. Also fetch open issues labeled `needs-qa`, `ready-for-qa`, or similar if any exist

If recent work is detected, propose those features first: "I found these recently completed features — want to create QA flows for them?"

### 2. Propose testing scope

Present a numbered list of candidate features/issues for QA:

- **Title** and issue number
- **Summary** of what was implemented
- **Source**: recently closed, current branch work, or user-specified

Ask the user:
- Which features to include in the QA scope?
- Any additional features or areas to test?
- Any specific edge cases or user flows to prioritize?

Wait for user confirmation before proceeding.

### 3. Explore the implementation

For each confirmed feature in scope:

1. Read the original issue body for acceptance criteria and requirements
2. Use the Agent tool with `subagent_type=Explore` to understand:
   - What code was changed (check commits, diffs)
   - What user-facing behaviors were added or modified
   - What edge cases exist
   - What existing tests cover (and what they don't)
   - What integrations or dependencies are involved

### 4. Generate QA flows

For each feature, create a structured QA flow covering:

<qa-categories>
- **Happy path**: Core user flows that must work
- **Edge cases**: Boundary conditions, empty states, max values
- **Error handling**: Invalid inputs, network failures, permission errors
- **Integration points**: Interactions with other features or services
- **Regression**: Existing functionality that could be affected
- **UX/UI** (if applicable): Visual correctness, responsiveness, accessibility
</qa-categories>

Each test case should be a checkbox item with:
- Clear action to perform
- Expected result
- Any preconditions needed

### 5. Review with user

Present the generated QA flows and ask:
- Is the coverage sufficient?
- Any scenarios missing?
- Should any tests be removed or modified?
- What priority/severity labels to apply?

Iterate until the user approves.

### 6. Submit QA issues

Create one QA issue per feature using the platform CLI.

- **GitHub**: `gh issue create --title "..." --body "..." --label "qa"`
- **GitLab**: `glab issue create --title "..." --description "..." --label "qa"`

<qa-issue-template>
## Feature Under Test

#<original-issue-number> — <feature title>

## Preconditions

- [ ] Feature is deployed to [environment]
- [ ] Test data is set up
- [ ] Any other prerequisites

## QA Checklist

### Happy Path
- [ ] **[Test name]**: [Action to perform] → Expected: [expected result]
- [ ] **[Test name]**: [Action to perform] → Expected: [expected result]

### Edge Cases
- [ ] **[Test name]**: [Action to perform] → Expected: [expected result]

### Error Handling
- [ ] **[Test name]**: [Action to perform] → Expected: [expected result]

### Integration
- [ ] **[Test name]**: [Action to perform] → Expected: [expected result]

### Regression
- [ ] **[Test name]**: [Verify existing behavior] → Expected: [still works as before]

## Notes

Any additional context, known limitations, or areas of concern.
</qa-issue-template>

### 7. Summary

Print a table of created QA issues:

| # | Feature | QA Issue | Test Count |
|---|---------|----------|------------|
| 1 | Feature name | #123 | 12 tests |
| 2 | Feature name | #124 | 8 tests |

Include the total number of test cases across all QA issues.
