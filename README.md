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

## Engineering

These skills help you think through problems, write, refactor, and fix code.

- **init-for-skills** — Scaffold per-repo config (issue tracker, triage label vocabulary, domain-doc layout) into `CLAUDE.md` / `AGENTS.md` and `docs/agents/*.md` so the other engineering skills know how to operate. Supports GitHub, GitLab, Beads, and local markdown.

- **to-prd** — Synthesise a PRD from the current conversation and codebase understanding. Files it via the configured issue tracker.

- **to-issues** — Break a PRD or plan into independently-grabbable issues using tracer-bullet vertical slices.

- **triage** — Move an incoming issue through the five-state triage label vocabulary, applying the right labels.

- **tdd** — Test-driven development with a red-green-refactor loop. Builds features or fixes bugs one vertical slice at a time.

- **diagnose** — Investigate a bug or issue by exploring the codebase to find the root cause.

- **prototype** — Build a quick prototype to validate an idea before committing to full implementation.

- **improve-codebase-architecture** — Explore a codebase for architectural improvement opportunities, focusing on deepening shallow modules and improving testability.

- **grill-with-docs** — Resolve unclear concepts by interviewing the user, then update `CONTEXT.md` and ADRs with the agreed terminology / decisions.

- **zoom-out** — Ask the agent for broader context or a higher-level perspective on the code you're looking at.

## Tooling & Setup

- **setup-pre-commit** — Set up Husky pre-commit hooks with lint-staged, Prettier, type checking, and tests.

- **git-guardrails-claude-code** — Set up Claude Code hooks to block dangerous git commands (push, reset --hard, clean, etc.) before they execute.

- **migrate-to-shoehorn** — Migrate test files from `as` type assertions to @total-typescript/shoehorn.

- **scaffold-exercises** — Create exercise directory structures with sections, problems, solutions, and explainers.

## Git Workflow

- **commit** — Generate a commit message and commit all changes locally.

- **commit-push** — Generate a commit message, commit all changes, and push to the current branch.

## Productivity

- **grill-me** — Get relentlessly interviewed about a plan or design until every branch of the decision tree is resolved.

- **teach** — Teach a topic across multiple sessions using a structured workspace (mission, glossary, learning record, resources).

- **handoff** — Compact the current conversation into a handoff document so a fresh agent can pick up the work.

- **caveman** — Ultra-compressed communication mode. Cuts token usage ~75% by dropping filler while keeping technical accuracy.

- **write-a-skill** — Create new skills with proper structure, progressive disclosure, and bundled resources.
