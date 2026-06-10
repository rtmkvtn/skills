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

# Find a skill directory by name (searches one level deep under skills/<category>/<name>)
find_skill_src() {
  local name="$1"
  for category in "$REPO_DIR"/skills/*/; do
    local candidate="$category$name"
    if [[ -f "$candidate/SKILL.md" ]]; then
      echo "$candidate"
      return 0
    fi
  done
  return 1
}

# Build list of skills to install
skills=()
if [[ "$1" == "--all" ]]; then
  for category in "$REPO_DIR"/skills/*/; do
    for dir in "$category"*/; do
      [[ -f "$dir/SKILL.md" ]] && skills+=("$(basename "$dir")")
    done
  done
else
  skills=("$@")
fi

mkdir -p "$SKILLS_DIR"

for skill in "${skills[@]}"; do
  if ! src="$(find_skill_src "$skill")"; then
    echo "skip: $skill — no SKILL.md found under $REPO_DIR/skills/*/$skill/"
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
