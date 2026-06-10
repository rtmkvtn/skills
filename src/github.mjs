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

// Cached per CLI invocation — one recursive tree call covers discovery and install.
let cachedTree = null;
async function getRepoTree(owner, repo) {
  if (cachedTree) return cachedTree;
  const json = await fetchJSON(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`
  );
  if (json.truncated) {
    console.warn(
      "Warning: GitHub returned a truncated repo tree. Some skills may be missed."
    );
  }
  cachedTree = json.tree;
  return cachedTree;
}

/**
 * List skills by finding SKILL.md files under skills/<category>/<dirName>/.
 */
export async function fetchSkillList(owner, repo) {
  const tree = await getRepoTree(owner, repo);
  const skillMd = /^skills\/([^/]+)\/([^/]+)\/SKILL\.md$/;

  const entries = tree
    .filter((e) => e.type === "blob")
    .map((e) => {
      const m = e.path.match(skillMd);
      return m ? { category: m[1], dirName: m[2], path: e.path } : null;
    })
    .filter(Boolean);

  const results = await Promise.allSettled(
    entries.map(async ({ category, dirName, path }) => {
      const url = `${RAW_BASE}/${owner}/${repo}/HEAD/${path}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const text = await res.text();
      const meta = parseFrontmatter(text);
      if (!meta) return null;
      return { category, dirName, ...meta };
    })
  );

  return results
    .filter((r) => r.status === "fulfilled" && r.value !== null)
    .map((r) => r.value);
}

/**
 * List every file under a single skill's source directory.
 */
export async function fetchSkillFiles(owner, repo, category, dirName) {
  const tree = await getRepoTree(owner, repo);
  const prefix = `skills/${category}/${dirName}/`;
  return tree
    .filter((e) => e.type === "blob" && e.path.startsWith(prefix))
    .map((e) => ({
      path: e.path,
      relativePath: e.path.slice(prefix.length),
    }));
}
