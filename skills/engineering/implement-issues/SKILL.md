---
name: implement-issues
description: Implement all open issues using TDD vertical slices, then close them. Fetches issues from Beads, GitHub, GitLab, or local markdown (backend read from docs/agents/issue-tracker.md), sorts by dependencies, implements each with red-green-refactor, commits, and closes. Use when user wants to implement issues, work through a backlog, or build out planned features from existing issues.
permissions: Bash(bd:*), Bash(gh:*), Bash(glab:*), Bash(git:*)
---

# Implement Issues

Fetch open issues, implement each using TDD (vertical slices, red-green-refactor), commit, and close.

## Process

### 0. Resolve the issue-tracking backend

<issue-tracker-resolution>
Read `docs/agents/issue-tracker.md` at the repo root. It declares which backend is in use (GitHub, GitLab, Beads, local markdown, or other) and may override default conventions — defer to it whenever it's more specific than the inline blocks below.

If the file doesn't exist, auto-detect for this run:

1. `.beads/` exists → use `beads`
2. `git remote get-url origin` contains `github.com` → use `github`
3. `git remote get-url origin` contains `gitlab` → use `gitlab`
4. Otherwise → ask the user which to use

Then tell the user: *"No `docs/agents/issue-tracker.md` found. Using **\<backend\>** for this task. Run the `init-for-skills` skill to make this permanent."*

Use the matching `<beads>`, `<github>`, or `<gitlab>` blocks below for issue commands.

If `beads` is the resolved backend, verify it is initialised by running `bd list`; if it fails, run `bd init`.
</issue-tracker-resolution>

### 1. Fetch open issues

<beads>Run `bd list` to get all issues. For each open issue, run `bd show <id> --json` to fetch its full body. Only implement issues of type `task`, `bug`, or `chore` — skip `epic` (PRD containers, not implementable).</beads>
<github>Run `gh issue list --state open --json number,title,body,labels --limit 100`.</github>
<gitlab>Run `glab issue list --opened`.</gitlab>

If the user specifies a filter (label, milestone, parent PRD ID, or specific issue IDs/numbers), apply it. Otherwise fetch all open issues.

### 2. Sort by dependencies

Parse each issue body for a "Blocked by" section containing issue references (`#<number>` for GitHub/GitLab, beads ID for Beads).

Sort issues so that issues with no unresolved blockers come first (topological sort). If a cycle is detected, warn the user and skip the cycle.

<beads>Within the same dependency tier, prioritize by type: `bug` first, then `task`, then `chore`.</beads>

For each issue, note the **Type** field (HITL or AFK) from the issue body if present.

Present the sorted order to the user for confirmation before proceeding.

### 3. Ask branching strategy

Ask once: **"Branch per issue or single branch?"**

- **Branch per issue**: for each issue, create branch `issue-<id-or-number>/<slug>` from the current branch
- **Single branch**: work on the current branch

### 4. Implementation loop

For each issue in topological order:

#### 4a. Fetch full details

<beads>Run `bd show <id> --json` to get the complete issue body.</beads>
<github>Run `gh issue view <number> --json number,title,body,labels`.</github>
<gitlab>Run `glab issue view <number>`.</gitlab>

#### 4b. Mark in progress

<beads>Run `bd update <id> --status in_progress`.</beads>
<github>Run `gh issue edit <number> --add-label "in-progress"`.</github>
<gitlab>Run `glab issue update <number> --label "in-progress"`.</gitlab>

#### 4c. Create branch (if branch-per-issue)

```bash
git checkout -b issue-<id-or-number>/<slug>
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
- Reference the issue in the commit body — <github>include `Closes #<number>` or `Fixes #<number>`</github><gitlab>include `Closes #<number>`</gitlab><beads>include the Beads issue ID</beads>
- Never include AI attribution in the commit message
- Never use `--force`, `--no-verify`, or `--amend`

#### 4g. Close the issue

<beads>Run `bd close <id>`.</beads>
<github>Run `gh issue close <number>`.</github>
<gitlab>Run `glab issue update <number> --state close`.</gitlab>

#### 4h. Merge back (if branch-per-issue)

```bash
git checkout <base-branch>
git merge issue-<id-or-number>/<slug>
```

#### 4i. Continue or pause

- **AFK issues**: auto-continue to the next issue
- **HITL issues**: present results and wait for user confirmation before continuing

### 5. Summary

Print a table with three sections:

| Status | ID/# | Title | Commit |
|--------|------|-------|--------|
| Done | 1 | ... | abc1234 |
| Skipped | 5 | ... | (blocked by #3) |
| Failed | 8 | ... | (tests failed after retry) |

<error-handling>
- **Tests fail after GREEN**: analyze the failure and retry the cycle once
- **Still failing after retry**: skip the issue, record the reason, move to the next issue
- **Merge conflict**: pause and ask the user to resolve
- **Never** force-push, amend, or use `--no-verify`
</error-handling>
