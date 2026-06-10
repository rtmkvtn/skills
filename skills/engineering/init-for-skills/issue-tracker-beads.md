# Issue tracker: Beads

Issues and PRDs for this repo live in a local Beads database. Use the `bd` CLI for all operations.

## Initialisation

Before running any `bd` commands, verify Beads is initialised:

1. Run `bd list`.
2. If it fails, run `bd init` to initialise the database in this project.

## Conventions

- **Create an issue**: `bd create -t <type> --stdin` (pipe the body via stdin). Types: `bug`, `task`, `chore`, `epic`. Use `epic` for PRDs; `task`/`bug`/`chore` for implementation work.
- **Read an issue**: `bd show <id>` for human-readable, `bd show <id> --json` for structured output.
- **List issues**: `bd list` for an overview, `bd list --json` for machine-readable.
- **Mark in progress**: `bd update <id> --status in_progress`
- **Apply / change status**: `bd update <id> --status <status>`. Beads uses statuses (`open`, `in_progress`, `closed`) as well as labels — record canonical triage roles as labels via `bd update <id> --label <label>`.
- **Close**: `bd close <id>`
- **Link parent**: `bd create -t task --parent <prd-id> --stdin` to link an implementation task to its PRD epic.

Issue IDs are short slugs (e.g. `bd-001`).

## When a skill says "publish to the issue tracker"

Run `bd create` with the appropriate `-t` flag for the issue type.

## When a skill says "fetch the relevant ticket"

Run `bd show <id>` (or `bd show <id> --json` for parsing).
