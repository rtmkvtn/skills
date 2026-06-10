# Agent Skills

A collection of agent skills that extend capabilities across planning, development, and tooling.

## Installation

Pick and install skills interactively:

```bash
npx github:rtmkvtn/skills
```

Or clone and use the install script:

```bash
git clone https://github.com/rtmkvtn/skills.git
cd skills
./install.sh --all
```

> **Per-repo config:** Engineering skills read the issue-tracker backend (Beads / GitHub / GitLab / local markdown), triage label vocabulary, and domain-doc layout from `docs/agents/*.md`. Run **init-for-skills** once per project to scaffold these. If unset, issue skills auto-detect a backend for the current run.

## Planning & Design

These skills help you think through problems before writing code.

- **write-a-prd** — Create a PRD through an interactive interview, codebase exploration, and module design. Filed as an issue using the configured backend.

- **prd-to-plan** — Turn a PRD into a multi-phase implementation plan using tracer-bullet vertical slices.

- **prd-to-issues** — Break a PRD into independently-grabbable issues using vertical slices.

- **grill-me** — Get relentlessly interviewed about a plan or design until every branch of the decision tree is resolved.

## Development

These skills help you write, refactor, and fix code.

- **tdd** — Test-driven development with a red-green-refactor loop. Builds features or fixes bugs one vertical slice at a time.

- **triage-issue** — Investigate a bug by exploring the codebase, identify the root cause, and file an issue with a TDD-based fix plan.

- **implement-issues** — Fetch open issues, sort by dependencies, implement each with TDD (red-green-refactor), commit, and close.

- **improve-codebase-architecture** — Explore a codebase for architectural improvement opportunities, focusing on deepening shallow modules and improving testability. Issues filed using the configured backend.

- **migrate-to-shoehorn** — Migrate test files from `as` type assertions to @total-typescript/shoehorn.

- **scaffold-exercises** — Create exercise directory structures with sections, problems, solutions, and explainers.

## Tooling & Setup

- **init-for-skills** — Scaffold per-repo config (issue tracker, triage label vocabulary, domain-doc layout) into `CLAUDE.md` / `AGENTS.md` and `docs/agents/*.md` so engineering skills know how to operate. Supports GitHub, GitLab, Beads, and local markdown.

- **setup-pre-commit** — Set up Husky pre-commit hooks with lint-staged, Prettier, type checking, and tests.

- **git-guardrails-claude-code** — Set up Claude Code hooks to block dangerous git commands (push, reset --hard, clean, etc.) before they execute.

## Git Workflow

- **commit** — Generate a commit message and commit all changes locally.

- **commit-push** — Generate a commit message, commit all changes, and push to the current branch.

## Writing & Knowledge

- **write-a-skill** — Create new skills with proper structure, progressive disclosure, and bundled resources.

- **teach** — Teach a topic across multiple sessions using a structured workspace (mission, glossary, learning record, resources).

- **handoff** — Compact the current conversation into a handoff document so a fresh agent can pick up the work.

- **caveman** — Ultra-compressed communication mode. Cuts token usage ~75% by dropping filler while keeping technical accuracy.
