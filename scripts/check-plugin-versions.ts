#!/usr/bin/env bun

import { $ } from "bun";

interface Options {
  staged: boolean;
  branch: string;
}

function parseArgs(): Options {
  const args = process.argv.slice(2);
  const options: Options = {
    staged: false,
    branch: "HEAD",
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--staged") {
      options.staged = true;
    } else if (arg === "--branch" && i + 1 < args.length) {
      options.branch = args[i + 1];
      i++;
    }
  }

  return options;
}

async function getChangedPlugins(options: Options): Promise<string[]> {
  try {
    const args = ["./scripts/changed-plugins.ts"];
    if (options.staged) {
      args.push("--staged");
    }
    if (options.branch !== "HEAD") {
      args.push("--branch", options.branch);
    }

    const result = await $.raw(args.join(" ")).text();
    return result.trim().split("\n").filter(Boolean);
  } catch (error) {
    return [];
  }
}

async function validatePlugin(pluginName: string, options: Options): Promise<boolean> {
  try {
    const args = ["./scripts/changed-plugins.ts", pluginName];
    if (options.staged) {
      args.push("--staged");
    }
    if (options.branch !== "HEAD") {
      args.push("--branch", options.branch);
    }

    // Get the diff for the plugin
    const diff = await $.raw(args.join(" ")).text();

    // Pipe it to validate-plugin-version
    const result = await $`echo ${diff}`.pipe($`./scripts/validate-plugin-version.ts`).text();

    const response = result.trim();
    return response === "YES";
  } catch (error) {
    // If validate-plugin-version exits with code 0, it returns false (no update needed)
    return false;
  }
}

async function main() {
  const options = parseArgs();

  console.log("🔍 Checking plugin versions for changes");
  console.log("========================================");
  console.log("");

  const changedPlugins = await getChangedPlugins(options);

  if (changedPlugins.length === 0) {
    console.log("✨ No plugin changes detected");
    process.exit(0);
  }

  console.log(`📦 Found ${changedPlugins.length} changed plugin(s): ${changedPlugins.join(", ")}`);
  console.log("");

  const pluginsNeedingUpdate: string[] = [];

  for (const pluginName of changedPlugins) {
    console.log(`🔌 Checking plugin: ${pluginName}`);

    const needsUpdate = await validatePlugin(pluginName, options);

    if (needsUpdate) {
      console.log(`   ⚠️  Version update REQUIRED`);
      pluginsNeedingUpdate.push(pluginName);
    } else {
      console.log(`   ✅ No version update needed`);
    }

    console.log("");
  }

  // Summary
  console.log("========================================");
  console.log("📊 Summary:");
  console.log(`   Total plugins changed: ${changedPlugins.length}`);
  console.log(`   Plugins requiring version update: ${pluginsNeedingUpdate.length}`);
  console.log("");

  if (pluginsNeedingUpdate.length > 0) {
    console.log("⚠️  The following plugins need version updates:");
    for (const plugin of pluginsNeedingUpdate) {
      console.log(`   - ${plugin} (plugins/${plugin}/.claude-plugin/plugin.json)`);
    }
    console.log("");
    console.log("❌ Version check failed: Please update plugin versions");
    process.exit(1);
  } else {
    console.log("✨ All plugin versions are up to date!");
    process.exit(0);
  }
}

main();
