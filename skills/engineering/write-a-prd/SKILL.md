---
name: write-a-prd
description: Create a PRD through user interview, codebase exploration, and module design, then submit as an issue. Backend (Beads, GitHub, GitLab, or local markdown) is read from docs/agents/issue-tracker.md. Use when user wants to write a PRD, create a product requirements document, or plan a new feature.
permissions: Bash(bd:*), Bash(gh:*), Bash(glab:*), Bash(git:*)
---

# Write a PRD

This skill will be invoked when the user wants to create a PRD. You may skip steps if you don't consider them necessary.

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

### 1. Optional: pick up an existing issue

If the user passes an existing issue reference, fetch it for context:

<beads>If they pass a Beads issue ID, fetch it with `bd show <id>` and run `bd update <id> --status in_progress`.</beads>
<github>If they pass an issue number or URL, fetch it with `gh issue view <number>`.</github>
<gitlab>If they pass an issue number, fetch it with `glab issue view <number>`.</gitlab>

### 2. Describe the problem

Ask the user for a long, detailed description of the problem they want to solve and any potential ideas for solutions.

### 3. Verify against the codebase

Explore the repo to verify their assertions and understand the current state of the codebase.

### 4. Interview to shared understanding

Interview the user relentlessly about every aspect of this plan until you reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one.

### 5. Sketch the modules

Sketch out the major modules you will need to build or modify to complete the implementation. Actively look for opportunities to extract deep modules that can be tested in isolation.

A deep module (as opposed to a shallow module) is one which encapsulates a lot of functionality in a simple, testable interface which rarely changes.

Check with the user that these modules match their expectations. Check with the user which modules they want tests written for.

### 6. Submit the PRD

Once you have a complete understanding of the problem and solution, write the PRD using the template below and submit it as an issue.

<beads>Run `bd create -t epic --stdin` and pass the body below.</beads>
<github>Run `gh issue create --title "..." --body-file -` and pass the body below.</github>
<gitlab>Run `glab issue create --title "..." --description-file -` and pass the body below.</gitlab>

<prd-template>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A LONG, numbered list of user stories. Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

This list of user stories should be extremely extensive and cover all aspects of the feature.

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

## Testing Decisions

A list of testing decisions that were made. Include:

- A description of what makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Out of Scope

A description of the things that are out of scope for this PRD.

## Further Notes

Any further notes about the feature.

</prd-template>

<beads>If you were working from an existing Beads issue, run `bd close <id>` after creating the PRD issue.</beads>
