#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILLS_DIR="$HOME/.claude/skills"
LEGACY_DIR="$HOME/.claude/commands"

usage() {
  echo "Usage: $0 <skill-name> [skill-name ...] | --all"
  echo "Installs skills by symlinking them into ~/.claude/skills/"
  exit 1
}

[[ $# -eq 0 ]] && usage

# Build list of skills to install
skills=()
if [[ "$1" == "--all" ]]; then
  for dir in "$REPO_DIR"/skills/*/; do
    [[ -f "$dir/SKILL.md" ]] && skills+=("$(basename "$dir")")
  done
else
  skills=("$@")
fi

mkdir -p "$SKILLS_DIR"

for skill in "${skills[@]}"; do
  src="$REPO_DIR/skills/$skill"

  if [[ ! -f "$src/SKILL.md" ]]; then
    echo "skip: $skill — no SKILL.md found in $src"
    continue
  fi

  target="$SKILLS_DIR/$skill"

  # Remove existing symlink or directory at target
  if [[ -L "$target" ]]; then
    rm "$target"
  elif [[ -d "$target" ]]; then
    echo "skip: $skill — $target exists and is not a symlink (remove manually)"
    continue
  fi

  ln -s "$src" "$target"
  echo "installed: $skill → $target"

  # Remove legacy command if it exists
  legacy="$LEGACY_DIR/$skill.md"
  if [[ -f "$legacy" ]]; then
    rm "$legacy"
    echo "  removed legacy command: $legacy"
  fi
done
