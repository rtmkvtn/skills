#!/usr/bin/env bash
set -euo pipefail

SKILLS_DIR="$HOME/.claude/skills"

usage() {
  echo "Usage: $0 <skill-name> [skill-name ...]"
  echo "Removes skill symlinks from ~/.claude/skills/"
  exit 1
}

[[ $# -eq 0 ]] && usage

for skill in "$@"; do
  target="$SKILLS_DIR/$skill"

  if [[ -L "$target" ]]; then
    rm "$target"
    echo "uninstalled: $skill"
  elif [[ -e "$target" ]]; then
    echo "skip: $target exists but is not a symlink (remove manually)"
  else
    echo "skip: $skill — not installed"
  fi
done
