# Agent Skills

A collection of agent skills that extend capabilities across planning, development, and tooling.

## Installation

Install skills interactively — pick which ones you want:

```bash
npx skills add rtmkvtn/skills
```

Or install a specific skill directly:

```bash
npx skills add rtmkvtn/skills/<skill-name>
```

## Planning & Design

These skills help you think through problems before writing code.

- **write-a-prd** — Create a PRD through an interactive interview, codebase exploration, and module design. Filed as an issue (auto-detects GitHub/GitLab).

  ```
  npx skills@latest add rtmkvtn/skills/write-a-prd
  ```

- **write-a-prd-bd** — Same as write-a-prd, but tracks issues locally using Beads.

  ```
  npx skills@latest add rtmkvtn/skills/write-a-prd-bd
  ```

- **prd-to-plan** — Turn a PRD into a multi-phase implementation plan using tracer-bullet vertical slices.

  ```
  npx skills@latest add rtmkvtn/skills/prd-to-plan
  ```

- **prd-to-issues** — Break a PRD into independently-grabbable issues using vertical slices (auto-detects GitHub/GitLab).

  ```
  npx skills@latest add rtmkvtn/skills/prd-to-issues
  ```

- **prd-to-issues-bd** — Same as prd-to-issues, but tracks issues locally using Beads.

  ```
  npx skills@latest add rtmkvtn/skills/prd-to-issues-bd
  ```

- **grill-me** — Get relentlessly interviewed about a plan or design until every branch of the decision tree is resolved.

  ```
  npx skills@latest add rtmkvtn/skills/grill-me
  ```

- **design-an-interface** — Generate multiple radically different interface designs for a module using parallel sub-agents.

  ```
  npx skills@latest add rtmkvtn/skills/design-an-interface
  ```

- **request-refactor-plan** — Create a detailed refactor plan with tiny commits via user interview, filed as an issue (auto-detects GitHub/GitLab).

  ```
  npx skills@latest add rtmkvtn/skills/request-refactor-plan
  ```

- **request-refactor-plan-bd** — Same as request-refactor-plan, but tracks issues locally using Beads.

  ```
  npx skills@latest add rtmkvtn/skills/request-refactor-plan-bd
  ```

## Development

These skills help you write, refactor, and fix code.

- **tdd** — Test-driven development with a red-green-refactor loop. Builds features or fixes bugs one vertical slice at a time.

  ```
  npx skills@latest add rtmkvtn/skills/tdd
  ```

- **triage-issue** — Investigate a bug by exploring the codebase, identify the root cause, and file an issue with a TDD-based fix plan (auto-detects GitHub/GitLab).

  ```
  npx skills@latest add rtmkvtn/skills/triage-issue
  ```

- **triage-issue-bd** — Same as triage-issue, but tracks issues locally using Beads.

  ```
  npx skills@latest add rtmkvtn/skills/triage-issue-bd
  ```

- **improve-codebase-architecture** — Explore a codebase for architectural improvement opportunities, focusing on deepening shallow modules and improving testability. Issues filed via auto-detected platform (GitHub/GitLab).

  ```
  npx skills@latest add rtmkvtn/skills/improve-codebase-architecture
  ```

- **improve-codebase-architecture-bd** — Same as improve-codebase-architecture, but tracks issues locally using Beads.

  ```
  npx skills@latest add rtmkvtn/skills/improve-codebase-architecture-bd
  ```

- **migrate-to-shoehorn** — Migrate test files from `as` type assertions to @total-typescript/shoehorn.

  ```
  npx skills@latest add rtmkvtn/skills/migrate-to-shoehorn
  ```

- **scaffold-exercises** — Create exercise directory structures with sections, problems, solutions, and explainers.

  ```
  npx skills@latest add rtmkvtn/skills/scaffold-exercises
  ```

## Tooling & Setup

- **setup-pre-commit** — Set up Husky pre-commit hooks with lint-staged, Prettier, type checking, and tests.

  ```
  npx skills@latest add rtmkvtn/skills/setup-pre-commit
  ```

- **git-guardrails-claude-code** — Set up Claude Code hooks to block dangerous git commands (push, reset --hard, clean, etc.) before they execute.

  ```
  npx skills@latest add rtmkvtn/skills/git-guardrails-claude-code
  ```

## Writing & Knowledge

- **write-a-skill** — Create new skills with proper structure, progressive disclosure, and bundled resources.

  ```
  npx skills@latest add rtmkvtn/skills/write-a-skill
  ```

- **ubiquitous-language** — Extract a DDD-style ubiquitous language glossary from the current conversation.

  ```
  npx skills@latest add rtmkvtn/skills/ubiquitous-language
  ```

