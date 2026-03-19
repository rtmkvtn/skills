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

## Planning & Design

These skills help you think through problems before writing code.

- **write-a-prd** — Create a PRD through an interactive interview, codebase exploration, and module design. Filed as an issue (auto-detects GitHub/GitLab).

- **write-a-prd-bd** — Same as write-a-prd, but tracks issues locally using Beads.

- **prd-to-plan** — Turn a PRD into a multi-phase implementation plan using tracer-bullet vertical slices.

- **prd-to-issues** — Break a PRD into independently-grabbable issues using vertical slices (auto-detects GitHub/GitLab).

- **prd-to-issues-bd** — Same as prd-to-issues, but tracks issues locally using Beads.

- **grill-me** — Get relentlessly interviewed about a plan or design until every branch of the decision tree is resolved.

- **design-an-interface** — Generate multiple radically different interface designs for a module using parallel sub-agents.

- **request-refactor-plan** — Create a detailed refactor plan with tiny commits via user interview, filed as an issue (auto-detects GitHub/GitLab).

- **request-refactor-plan-bd** — Same as request-refactor-plan, but tracks issues locally using Beads.

## Development

These skills help you write, refactor, and fix code.

- **tdd** — Test-driven development with a red-green-refactor loop. Builds features or fixes bugs one vertical slice at a time.

- **triage-issue** — Investigate a bug by exploring the codebase, identify the root cause, and file an issue with a TDD-based fix plan (auto-detects GitHub/GitLab).

- **triage-issue-bd** — Same as triage-issue, but tracks issues locally using Beads.

- **improve-codebase-architecture** — Explore a codebase for architectural improvement opportunities, focusing on deepening shallow modules and improving testability. Issues filed via auto-detected platform (GitHub/GitLab).

- **improve-codebase-architecture-bd** — Same as improve-codebase-architecture, but tracks issues locally using Beads.

- **migrate-to-shoehorn** — Migrate test files from `as` type assertions to @total-typescript/shoehorn.

- **scaffold-exercises** — Create exercise directory structures with sections, problems, solutions, and explainers.

## Tooling & Setup

- **setup-pre-commit** — Set up Husky pre-commit hooks with lint-staged, Prettier, type checking, and tests.

- **git-guardrails-claude-code** — Set up Claude Code hooks to block dangerous git commands (push, reset --hard, clean, etc.) before they execute.

## Writing & Knowledge

- **write-a-skill** — Create new skills with proper structure, progressive disclosure, and bundled resources.

- **ubiquitous-language** — Extract a DDD-style ubiquitous language glossary from the current conversation.
