import { homedir } from "node:os";
import { join } from "node:path";
import { existsSync } from "node:fs";
import { checkbox, confirm, select } from "@inquirer/prompts";
import { fetchSkillList } from "./github.mjs";
import { installSkills } from "./installer.mjs";

const OWNER = "rtmkvtn";
const REPO = "skills";
const GLOBAL_SKILLS_DIR = join(homedir(), ".claude", "skills");
const PROJECT_SKILLS_DIR = join(process.cwd(), ".claude", "skills");

export async function run() {
  // Node version check
  const major = parseInt(process.version.slice(1), 10);
  if (major < 18) {
    console.error(`Node.js >= 18 is required (current: ${process.version})`);
    process.exit(1);
  }

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

  let selected;
  try {
    selected = await checkbox({
      message: "Select skills to install:",
      choices: skills.map((s) => ({
        name: s.name,
        value: s.dirName,
      })),
      pageSize: skills.length,
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

  let skillsDir;
  try {
    skillsDir = await select({
      message: "Install scope:",
      choices: [
        { name: "Global  (~/.claude/skills/)", value: GLOBAL_SKILLS_DIR },
        { name: "Project (./.claude/skills/)", value: PROJECT_SKILLS_DIR },
      ],
    });
  } catch (err) {
    if (err.name === "ExitPromptError") {
      console.log("\nCancelled.");
      return;
    }
    throw err;
  }

  // Check for existing installs
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

  try {
    await installSkills(OWNER, REPO, selected, skillsDir);
  } catch (err) {
    console.error(`\nInstallation failed: ${err.message}`);
    process.exit(1);
  }

  console.log("\nDone! Skills are ready to use in Claude Code.");
}
