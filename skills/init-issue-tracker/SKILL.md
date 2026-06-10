---
name: init-issue-tracker
description: Record the project's issue-tracking backend (Beads, GitHub, or GitLab) into CLAUDE.md so other skills know how to file issues. Use when setting up a project for the first time, when issue-related skills need configuration, when switching trackers, or when mentions "init issue tracker", "set up issues", or "configure tracking".
permissions: Bash(bd:*), Bash(gh:*), Bash(glab:*), Bash(git:*)
---

# Init Issue Tracker

Detect the project's issue-tracking backend, confirm with the user, and write the choice into `CLAUDE.md` so other skills (triage-issue, implement-issues, prd-to-issues, write-a-prd, improve-codebase-architecture) read it.

## Process

### 1. Auto-detect a default

Check the project in this order — first match wins:

1. **Beads** — `.beads/` directory exists at the repo root
2. **GitHub** — `git remote get-url origin` returns a URL containing `github.com`
3. **GitLab** — `git remote get-url origin` returns a URL containing `gitlab`
4. **None** — no signal

If both `.beads/` and a GitHub/GitLab remote are present, **prefer Beads** — local tracking is the deliberate choice when both exist.

### 2. Confirm with the user

Present the detected default and ask the user to confirm or pick a different backend:

> "Detected **<backend>** as your issue tracker. Use this? (Beads / GitHub / GitLab)"

Accept their answer. The valid values are `beads`, `github`, `gitlab`.

If Beads is chosen and `bd list` fails, run `bd init` to initialise the database before continuing.

### 3. Write to CLAUDE.md

Find or create `CLAUDE.md` at the repo root.

Look for an existing `## Issue Tracking` section. If present, replace it. If not, append the section to the end of the file (with a blank line before it).

Section format — keep it exactly this shape so other skills can parse it reliably:

```markdown
## Issue Tracking

Backend: <beads|github|gitlab>
```

### 4. Report

Print: `Issue tracker configured: <backend>. Other skills will now use this.`
