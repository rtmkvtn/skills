import { mkdir, readFile, writeFile, rm, chmod } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fetchSkillFiles } from "./github.mjs";

const RAW_BASE = "https://raw.githubusercontent.com";

/**
 * Install selected skills to the target directory.
 * @param {Array<{category: string, dirName: string}>} selected
 */
export async function installSkills(owner, repo, selected, skillsDir) {
  await mkdir(skillsDir, { recursive: true });

  for (const { category, dirName } of selected) {
    const destDir = join(skillsDir, dirName);

    // Remove existing directory if present
    await rm(destDir, { recursive: true, force: true });
    await mkdir(destDir, { recursive: true });

    const files = await fetchSkillFiles(owner, repo, category, dirName);

    for (const file of files) {
      const destPath = join(destDir, file.relativePath);
      await mkdir(dirname(destPath), { recursive: true });

      const url = `${RAW_BASE}/${owner}/${repo}/HEAD/${file.path}`;
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`  Failed to download ${file.path} (${res.status})`);
        continue;
      }

      const buffer = Buffer.from(await res.arrayBuffer());
      await writeFile(destPath, buffer);

      if (file.relativePath.endsWith(".sh")) {
        await chmod(destPath, 0o755);
      }
    }

    console.log(`  Installed ${dirName} → ${destDir}`);
  }
}

/**
 * Merge permissions into a project's .claude/settings.local.json.
 * Creates the file if it doesn't exist. Returns newly added permissions.
 */
export async function mergePermissions(settingsPath, permissions) {
  let settings = { permissions: { allow: [] } };

  try {
    const raw = await readFile(settingsPath, "utf-8");
    settings = JSON.parse(raw);
    if (!settings.permissions) settings.permissions = {};
    if (!Array.isArray(settings.permissions.allow))
      settings.permissions.allow = [];
  } catch {
    // File doesn't exist or is invalid — use default
  }

  const existing = new Set(settings.permissions.allow);
  const added = permissions.filter((p) => !existing.has(p));

  if (added.length === 0) return [];

  settings.permissions.allow.push(...added);

  await mkdir(dirname(settingsPath), { recursive: true });
  await writeFile(settingsPath, JSON.stringify(settings, null, 2) + "\n");

  return added;
}
