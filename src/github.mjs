import { parseFrontmatter } from "./frontmatter.mjs";

const RAW_BASE = "https://raw.githubusercontent.com";

async function fetchJSON(url) {
  const res = await fetch(url);
  if (res.status === 403) {
    const remaining = res.headers.get("x-ratelimit-remaining");
    if (remaining === "0") {
      const reset = res.headers.get("x-ratelimit-reset");
      const resetDate = reset ? new Date(Number(reset) * 1000) : null;
      throw new Error(
        `GitHub API rate limit exceeded.${resetDate ? ` Resets at ${resetDate.toLocaleTimeString()}.` : ""} Set a GITHUB_TOKEN env var to increase the limit.`
      );
    }
  }
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${url}`);
  return res.json();
}

/**
 * List skills in the repo by discovering directories inside skills/ that contain a SKILL.md.
 */
export async function fetchSkillList(owner, repo) {
  const entries = await fetchJSON(
    `https://api.github.com/repos/${owner}/${repo}/contents/skills`
  );

  const dirs = entries.filter((e) => e.type === "dir");

  const results = await Promise.allSettled(
    dirs.map(async (dir) => {
      const url = `${RAW_BASE}/${owner}/${repo}/HEAD/skills/${dir.name}/SKILL.md`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const text = await res.text();
      const meta = parseFrontmatter(text);
      if (!meta) return null;
      return { dirName: dir.name, ...meta };
    })
  );

  return results
    .filter((r) => r.status === "fulfilled" && r.value !== null)
    .map((r) => r.value);
}

/**
 * Recursively list all files in a skill directory.
 */
export async function fetchDirectoryTree(owner, repo, dirPath) {
  const entries = await fetchJSON(
    `https://api.github.com/repos/${owner}/${repo}/contents/${dirPath}`
  );

  const files = [];
  for (const entry of entries) {
    if (entry.type === "file") {
      files.push({
        path: entry.path,
        relativePath: entry.path.slice(dirPath.length + 1),
      });
    } else if (entry.type === "dir") {
      const nested = await fetchDirectoryTree(owner, repo, entry.path);
      files.push(...nested);
    }
  }
  return files;
}
