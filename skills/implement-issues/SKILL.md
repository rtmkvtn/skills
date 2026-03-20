---
name: implement-issues
description: Implement all open issues using TDD vertical slices, then close them. Fetches issues from GitHub or GitLab, sorts by dependencies, implements each with red-green-refactor, commits, and closes. Use when user wants to implement issues, work through a backlog, or build out planned features from existing issues.
---

# Implement Issues

Fetch open issues, implement each using TDD (vertical slices, red-green-refactor), commit, and close.

## Process

<platform-detection>
Before running issue commands, detect the hosting platform:
1. Run `git remote get-url origin`
2. If URL contains "github.com" → use `gh` CLI
3. If URL contains "gitlab" → use `glab` CLI
4. Otherwise → ask the user which platform and CLI to use
</platform-detection>

### 1. Fetch open issues

Fetch all open issues:

- **GitHub**: `gh issue list --state open --json number,title,body,labels --limit 100`
- **GitLab**: `glab issue list --opened`

If the user specifies a filter (label, milestone, or parent PRD number), apply it. Otherwise fetch all open issues.

### 2. Sort by dependencies

Parse each issue body for a "Blocked by" section containing `#<number>` references.

Sort issues so that issues with no unresolved blockers come first (topological sort). If a cycle is detected, warn the user and skip the cycle.

For each issue, note the **Type** field (HITL or AFK) from the issue body if present.

Present the sorted order to the user for confirmation before proceeding.

### 3. Ask branching strategy

Ask once: **"Branch per issue or single branch?"**

- **Branch per issue**: for each issue, create branch `issue-<number>/<slug>` from the current branch
- **Single branch**: work on the current branch

### 4. Implementation loop

For each issue in topological order:

#### 4a. Fetch full details

- **GitHub**: `gh issue view <number>` (with `--json` for structured data)
- **GitLab**: `glab issue view <number>`

#### 4b. Mark in progress

- **GitHub**: `gh issue edit <number> --add-label "in-progress"`
- **GitLab**: `glab issue update <number> --label "in-progress"`

#### 4c. Create branch (if branch-per-issue)

```bash
git checkout -b issue-<number>/<slug>
```

#### 4d. Explore codebase

Use the Agent tool with `subagent_type=Explore` to understand what needs to change for this issue.

#### 4e. TDD implement

Check if the issue body contains a **"TDD Fix Plan"** section (from the [triage-issue skill](../triage-issue/SKILL.md)). If it does, follow those RED-GREEN cycles directly.

Otherwise, try to read the [TDD skill](../tdd/SKILL.md) and follow its full workflow. If the TDD skill is not installed, use the embedded workflow below:

<tdd-workflow>
For each behavior to implement:

1. **RED** — Write ONE test that describes the expected behavior through a public interface. Run tests — confirm it fails.
2. **GREEN** — Write the minimal code to make that test pass. Run tests — confirm it passes.
3. Repeat for the next behavior (vertical slices, not horizontal).

After all behaviors pass:

4. **REFACTOR** — Clean up duplication, deepen modules. Run tests after each change to confirm nothing breaks.

Rules: test behavior not implementation, one test at a time, no speculative code.
</tdd-workflow>

#### 4f. Commit

Follow commit conventions:
- Use conventional commits format: `type(scope): description`
- Stage files by name — never `git add -A` or `git add .`
- Pass commit message via HEREDOC
- Include `Closes #<number>` or `Fixes #<number>` in the commit body
- Never include AI attribution in the commit message
- Never use `--force`, `--no-verify`, or `--amend`

#### 4g. Close the issue

- **GitHub**: `gh issue close <number>`
- **GitLab**: `glab issue update <number> --state close`

#### 4h. Merge back (if branch-per-issue)

```bash
git checkout <base-branch>
git merge issue-<number>/<slug>
```

#### 4i. Continue or pause

- **AFK issues**: auto-continue to the next issue
- **HITL issues**: present results and wait for user confirmation before continuing

### 5. Summary

Print a table with three sections:

| Status | # | Title | Commit |
|--------|---|-------|--------|
| Done | 1 | ... | abc1234 |
| Skipped | 5 | ... | (blocked by #3) |
| Failed | 8 | ... | (tests failed after retry) |

<error-handling>
- **Tests fail after GREEN**: analyze the failure and retry the cycle once
- **Still failing after retry**: skip the issue, record the reason, move to the next issue
- **Merge conflict**: pause and ask the user to resolve
- **Never** force-push, amend, or use `--no-verify`
</error-handling>
