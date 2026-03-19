import { mkdir, writeFile, rm, chmod } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fetchDirectoryTree } from "./github.mjs";

const RAW_BASE = "https://raw.githubusercontent.com";

/**
 * Install selected skills to the target directory.
 */
export async function installSkills(owner, repo, skillDirNames, skillsDir) {
  await mkdir(skillsDir, { recursive: true });

  for (const dirName of skillDirNames) {
    const destDir = join(skillsDir, dirName);

    // Remove existing directory if present
    await rm(destDir, { recursive: true, force: true });
    await mkdir(destDir, { recursive: true });

    const files = await fetchDirectoryTree(owner, repo, `skills/${dirName}`);

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
