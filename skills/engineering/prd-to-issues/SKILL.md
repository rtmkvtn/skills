---
name: prd-to-issues
description: Break a PRD into independently-grabbable issues using tracer-bullet vertical slices. Backend (Beads, GitHub, or GitLab) is read from CLAUDE.md. Use when user wants to convert a PRD to issues, create implementation tickets, or break down a PRD into work items.
permissions: Bash(bd:*), Bash(gh:*), Bash(glab:*), Bash(git:*)
---

# PRD to Issues

Break a PRD into independently-grabbable issues using vertical slices (tracer bullets).

## Process

### 0. Resolve the issue-tracking backend

<issue-tracker-resolution>
Read `CLAUDE.md` at the repo root and look for:

```
## Issue Tracking

Backend: <beads|github|gitlab>
```

- If found → use the backend named there. Use the matching `<beads>`, `<github>`, or `<gitlab>` blocks below for all issue commands.
- If missing → auto-detect for this run:
  1. `.beads/` exists → use `beads`
  2. `git remote get-url origin` contains `github.com` → use `github`
  3. `git remote get-url origin` contains `gitlab` → use `gitlab`
  4. Otherwise → ask the user which to use
  
  Then tell the user: *"No issue tracking backend is set in CLAUDE.md. Using **\<backend\>** for this task. Run the `init-issue-tracker` skill to make this permanent."*

If `beads` is the resolved backend, verify it is initialised by running `bd list`; if it fails, run `bd init`.
</issue-tracker-resolution>

### 1. Locate the PRD

Ask the user for the PRD issue reference (number, URL, or Beads ID).

If the PRD is not already in your context window, fetch it:

<beads>Run `bd show <id> --json`. Run `bd update <id> --status in_progress` to mark the PRD as in progress.</beads>
<github>Run `gh issue view <number> --comments`.</github>
<gitlab>Run `glab issue view <number> --comments`.</gitlab>

### 2. Explore the codebase (optional)

If you have not already explored the codebase, do so to understand the current state of the code.

### 3. Draft vertical slices

Break the PRD into **tracer bullet** issues. Each issue is a thin vertical slice that cuts through ALL integration layers end-to-end, NOT a horizontal slice of one layer.

Slices may be 'HITL' or 'AFK'. HITL slices require human interaction, such as an architectural decision or a design review. AFK slices can be implemented and merged without human interaction. Prefer AFK over HITL where possible.

<vertical-slice-rules>
- Each slice delivers a narrow but COMPLETE path through every layer (schema, API, UI, tests)
- A completed slice is demoable or verifiable on its own
- Prefer many thin slices over few thick ones
</vertical-slice-rules>

### 4. Quiz the user

Present the proposed breakdown as a numbered list. For each slice, show:

- **Title**: short descriptive name
- **Type**: HITL / AFK
- **Blocked by**: which other slices (if any) must complete first
- **User stories covered**: which user stories from the PRD this addresses

Ask the user:

- Does the granularity feel right? (too coarse / too fine)
- Are the dependency relationships correct?
- Should any slices be merged or split further?
- Are the correct slices marked as HITL and AFK?

Iterate until the user approves the breakdown.

### 5. Create the issues

For each approved slice, create an issue. Create them in dependency order (blockers first) so you can reference real IDs in the "Blocked by" field.

<beads>Run `bd create -t task --parent <prd-issue-id> --stdin` and pass the body below.</beads>
<github>Run `gh issue create --title "..." --body-file -` with the body below. Reference the parent PRD as `#<prd-number>` in the body.</github>
<gitlab>Run `glab issue create --title "..." --description-file -` with the body below. Reference the parent PRD as `#<prd-number>` in the body.</gitlab>

<issue-template>
## Parent PRD

<reference to PRD issue — #<number> for GitHub/GitLab, ID for Beads>

## What to build

A concise description of this vertical slice. Describe the end-to-end behavior, not layer-by-layer implementation. Reference specific sections of the parent PRD rather than duplicating content.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Blocked by

- Blocked by <issue reference> (if any)

Or "None - can start immediately" if no blockers.

## User stories addressed

Reference by number from the parent PRD:

- User story 3
- User story 7

</issue-template>

<beads>After all sub-issues are created, run `bd close <prd-id>` to close the PRD epic.</beads>
<github>Do NOT close or modify the parent PRD issue.</github>
<gitlab>Do NOT close or modify the parent PRD issue.</gitlab>
