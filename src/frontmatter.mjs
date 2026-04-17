/**
 * Parse SKILL.md frontmatter for name and description fields.
 * Avoids a YAML dependency — the frontmatter is simple single-line values.
 */
export function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const block = match[1];
  const name = block.match(/^name:\s*(.+)$/m)?.[1]?.trim() ?? null;
  const description =
    block.match(/^description:\s*(.+)$/m)?.[1]?.trim() ?? null;

  const permissionsRaw =
    block.match(/^permissions:\s*(.+)$/m)?.[1]?.trim() ?? null;
  const permissions = permissionsRaw
    ? permissionsRaw.split(", ").map((p) => p.trim())
    : [];

  if (!name) return null;
  return { name, description, permissions };
}
