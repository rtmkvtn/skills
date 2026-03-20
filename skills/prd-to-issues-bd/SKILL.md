---
name: prd-to-issues-bd
description: Break a PRD into independently-grabbable issues using Beads local tracker and tracer-bullet vertical slices. Use when user wants to convert a PRD to local issues, create implementation tickets with Beads, or break down a PRD into work items tracked locally.
---

# PRD to Issues (Beads)

Break a PRD into independently-grabbable issues using vertical slices (tracer bullets), tracked locally with Beads.

## Process

<beads-init>
Before running any `bd` commands, verify Beads is initialized:
1. Run `bd list`
2. If it fails, run `bd init` first to initialize the beads database in this project
</beads-init>

### 1. Locate the PRD

Ask the user for the PRD issue ID.

If the PRD is not already in your context window, fetch it with `bd show <id> --json`.

Run `bd update <id> --status in_progress` to mark the PRD issue as in progress.

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

For each approved slice, create a Beads issue. Use `bd create` with `--stdin` for the issue body, passing the template below. Use `-t task` to mark them as tasks.

Create issues in dependency order (blockers first) so you can reference real issue IDs in the "Blocked by" field.

<issue-template>
## Parent PRD

<prd-issue-id>

## What to build

A concise description of this vertical slice. Describe the end-to-end behavior, not layer-by-layer implementation. Reference specific sections of the parent PRD rather than duplicating content.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Blocked by

- Blocked by <issue-id> (if any)

Or "None - can start immediately" if no blockers.

## User stories addressed

Reference by number from the parent PRD:

- User story 3
- User story 7

</issue-template>

After all sub-issues are created, run `bd close <id>` to close the PRD issue.
