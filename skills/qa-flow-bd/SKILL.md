---
name: qa-flow-bd
description: Create QA testing flows for implemented features using local Beads tracker. Detects recently completed work, proposes testing scope from Beads issues, generates QA checklists, and submits them as Beads QA issues. Use when user wants to create QA flows, test plans, testing checklists, or verify implemented features tracked in Beads.
permissions: Bash(bd:*)
---

# QA Flow (Beads)

Generate QA testing flows with checklists for implemented features and submit them as Beads issues.

## Process

<beads-init>
Before running any `bd` commands, verify Beads is initialized:
1. Run `bd list`
2. If it fails, run `bd init` first to initialize the beads database in this project
</beads-init>

### 1. Detect recently completed work

Check for recent activity to propose testing scope:

1. Run `git log --oneline -20` to find recent commits
2. Look for commits referencing beads issues
3. Run `bd list` and identify recently closed issues
4. Also check for issues with status `done` or `closed`

If recent work is detected, propose those features first: "I found these recently completed features — want to create QA flows for them?"

### 2. Propose testing scope

Present a numbered list of candidate features/issues for QA:

- **Title** and beads ID
- **Summary** of what was implemented
- **Source**: recently closed, current branch work, or user-specified

Ask the user:
- Which features to include in the QA scope?
- Any additional features or areas to test?
- Any specific edge cases or user flows to prioritize?

Wait for user confirmation before proceeding.

### 3. Explore the implementation

For each confirmed feature in scope:

1. Run `bd show <id> --json` for the original issue body, acceptance criteria, and requirements
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

Create one QA issue per feature using Beads:

Run `bd create --type chore --title "QA: <feature title>"` with the body content, then use `bd update <id>` to add labels if needed.

<qa-issue-template>
## Feature Under Test

<original-beads-id> — <feature title>

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

| # | Feature | QA Issue ID | Test Count |
|---|---------|-------------|------------|
| 1 | Feature name | abc123 | 12 tests |
| 2 | Feature name | def456 | 8 tests |

Include the total number of test cases across all QA issues.
