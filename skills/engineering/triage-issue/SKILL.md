---
name: triage-issue
description: Triage a bug or issue by exploring the codebase to find root cause, then create an issue with a TDD-based fix plan. Backend (Beads, GitHub, GitLab, or local markdown) is read from docs/agents/issue-tracker.md. Use when user reports a bug, wants to file an issue, mentions "triage", or wants to investigate and plan a fix for a problem.
permissions: Bash(bd:*), Bash(gh:*), Bash(glab:*), Bash(git:*)
---

# Triage Issue

Investigate a reported problem, find its root cause, and create an issue with a TDD fix plan. This is a mostly hands-off workflow — minimize questions to the user.

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

### 1. Capture the problem

Get a brief description of the issue from the user. If they haven't provided one, ask ONE question: "What's the problem you're seeing?"

If the user provides an existing issue reference:

<beads>If they pass a Beads issue ID, fetch it with `bd show <id>` and run `bd update <id> --status in_progress`.</beads>
<github>If they pass an issue number or URL, fetch it with `gh issue view <number>`.</github>
<gitlab>If they pass an issue number, fetch it with `glab issue view <number>`.</gitlab>

Do NOT ask follow-up questions yet. Start investigating immediately.

### 2. Explore and diagnose

Use the Agent tool with subagent_type=Explore to deeply investigate the codebase. Your goal is to find:

- **Where** the bug manifests (entry points, UI, API responses)
- **What** code path is involved (trace the flow)
- **Why** it fails (the root cause, not just the symptom)
- **What** related code exists (similar patterns, tests, adjacent modules)

Look at:
- Related source files and their dependencies
- Existing tests (what's tested, what's missing)
- Recent changes to affected files (`git log` on relevant files)
- Error handling in the code path
- Similar patterns elsewhere in the codebase that work correctly

### 3. Identify the fix approach

Based on your investigation, determine:

- The minimal change needed to fix the root cause
- Which modules/interfaces are affected
- What behaviors need to be verified via tests
- Whether this is a regression, missing feature, or design flaw

### 4. Design TDD fix plan

Create a concrete, ordered list of RED-GREEN cycles. Each cycle is one vertical slice:

- **RED**: Describe a specific test that captures the broken/missing behavior
- **GREEN**: Describe the minimal code change to make that test pass

Rules:
- Tests verify behavior through public interfaces, not implementation details
- One test at a time, vertical slices (NOT all tests first, then all code)
- Each test should survive internal refactors
- Include a final refactor step if needed
- **Durability**: Only suggest fixes that would survive radical codebase changes. Describe behaviors and contracts, not internal structure. Tests assert on observable outcomes (API responses, UI state, user-visible effects), not internal state. A good suggestion reads like a spec; a bad one reads like a diff.

### 5. Create the issue

Use the backend's create command. Do NOT ask the user to review before creating — just create it and share the URL/ID.

<beads>Run `bd create -t bug --stdin` and pass the body below.</beads>
<github>Run `gh issue create --title "..." --body-file -` and pass the body below.</github>
<gitlab>Run `glab issue create --title "..." --description-file -` and pass the body below.</gitlab>

<issue-template>

## Problem

A clear description of the bug or issue, including:
- What happens (actual behavior)
- What should happen (expected behavior)
- How to reproduce (if applicable)

## Root Cause Analysis

Describe what you found during investigation:
- The code path involved
- Why the current code fails
- Any contributing factors

Do NOT include specific file paths, line numbers, or implementation details that couple to current code layout. Describe modules, behaviors, and contracts instead. The issue should remain useful even after major refactors.

## TDD Fix Plan

A numbered list of RED-GREEN cycles:

1. **RED**: Write a test that [describes expected behavior]
   **GREEN**: [Minimal change to make it pass]

2. **RED**: Write a test that [describes next behavior]
   **GREEN**: [Minimal change to make it pass]

...

**REFACTOR**: [Any cleanup needed after all tests pass]

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] All new tests pass
- [ ] Existing tests still pass

</issue-template>

After creating the issue, print the URL/ID and a one-line summary of the root cause.

<beads>If you were working from an existing Beads issue, run `bd close <id>` after creating the triage issue.</beads>
