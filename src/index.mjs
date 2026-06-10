import { execSync } from "node:child_process";
import { homedir } from "node:os";
import { join } from "node:path";
import { existsSync } from "node:fs";
import { checkbox, confirm, select, Separator } from "@inquirer/prompts";
import { fetchSkillList } from "./github.mjs";
import { installSkills, mergePermissions } from "./installer.mjs";

const OWNER = "rtmkvtn";
const REPO = "skills";
const GLOBAL_SKILLS_DIR = join(homedir(), ".claude", "skills");

function getGitRoot() {
  try {
    return execSync("git rev-parse --show-toplevel", { encoding: "utf-8" }).trim();
  } catch {
    return null;
  }
}

function buildGroupedChoices(skills) {
  const byCategory = new Map();
  for (const s of skills) {
    if (!byCategory.has(s.category)) byCategory.set(s.category, []);
    byCategory.get(s.category).push(s);
  }
  const choices = [];
  for (const category of [...byCategory.keys()].sort()) {
    choices.push(new Separator(`── ${category} ──`));
    for (const s of byCategory.get(category).sort((a, b) =>
      a.dirName.localeCompare(b.dirName)
    )) {
      choices.push({ name: s.dirName, value: s.dirName });
    }
  }
  return choices;
}

export async function run() {
  // Node version check
  const major = parseInt(process.version.slice(1), 10);
  if (major < 18) {
    console.error(`Node.js >= 18 is required (current: ${process.version})`);
    process.exit(1);
  }

  const gitRoot = getGitRoot();

  console.log("Fetching available skills…\n");

  let skills;
  try {
    skills = await fetchSkillList(OWNER, REPO);
  } catch (err) {
    console.error(`Failed to fetch skill list: ${err.message}`);
    process.exit(1);
  }

  if (skills.length === 0) {
    console.log("No skills found in the repository.");
    return;
  }

  const choices = buildGroupedChoices(skills);

  let selected;
  try {
    selected = await checkbox({
      message: "Select skills to install:",
      choices,
      pageSize: choices.length,
    });
  } catch (err) {
    if (err.name === "ExitPromptError") {
      console.log("\nCancelled.");
      return;
    }
    throw err;
  }

  if (selected.length === 0) {
    console.log("No skills selected.");
    return;
  }

  const projectRoot = gitRoot ?? process.cwd();
  const projectSkillsDir = join(projectRoot, ".claude", "skills");

  const scopeChoices = [
    { name: `Project (${projectSkillsDir})`, value: projectSkillsDir },
    { name: "Global  (~/.claude/skills/)", value: GLOBAL_SKILLS_DIR },
  ];

  let skillsDir;
  try {
    skillsDir = await select({
      message: "Install scope:",
      choices: scopeChoices,
    });
  } catch (err) {
    if (err.name === "ExitPromptError") {
      console.log("\nCancelled.");
      return;
    }
    throw err;
  }

  // Check for existing installs (destination is flat, so check by dirName)
  const existing = selected.filter((name) =>
    existsSync(join(skillsDir, name))
  );

  if (existing.length > 0) {
    console.log(`\nAlready installed: ${existing.join(", ")}`);
    try {
      const overwrite = await confirm({
        message: "Overwrite existing skills?",
        default: false,
      });
      if (!overwrite) {
        selected = selected.filter((name) => !existing.includes(name));
        if (selected.length === 0) {
          console.log("Nothing to install.");
          return;
        }
      }
    } catch (err) {
      if (err.name === "ExitPromptError") {
        console.log("\nCancelled.");
        return;
      }
      throw err;
    }
  }

  console.log(`\nInstalling ${selected.length} skill(s) to ${skillsDir}…\n`);

  const installList = selected.map((dirName) => {
    const s = skills.find((x) => x.dirName === dirName);
    return { category: s.category, dirName };
  });

  try {
    await installSkills(OWNER, REPO, installList, skillsDir);
  } catch (err) {
    console.error(`\nInstallation failed: ${err.message}`);
    process.exit(1);
  }

  // Permissions prompt — only for project-scoped installs
  const isProjectScope = skillsDir === projectSkillsDir;
  if (isProjectScope) {
    const allPermissions = [
      ...new Set(
        selected.flatMap((dirName) => {
          const skill = skills.find((s) => s.dirName === dirName);
          return skill?.permissions ?? [];
        })
      ),
    ];

    if (allPermissions.length > 0) {
      console.log("\nThe selected skills request these permissions:");
      for (const p of allPermissions) {
        console.log(`  - ${p}`);
      }
      console.log();

      try {
        const addPerms = await confirm({
          message: "Add these to .claude/settings.local.json?",
          default: true,
        });

        if (addPerms) {
          const settingsPath = join(projectRoot, ".claude", "settings.local.json");
          const added = await mergePermissions(settingsPath, allPermissions);
          if (added.length > 0) {
            console.log(`\nAdded ${added.length} permission(s) to ${settingsPath}`);
          } else {
            console.log("\nAll permissions already configured.");
          }
        }
      } catch (err) {
        if (err.name === "ExitPromptError") {
          console.log("\nSkipped permissions.");
        } else {
          throw err;
        }
      }
    }
  }

  console.log("\nDone! Skills are ready to use in Claude Code.");
}
