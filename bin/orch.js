#!/usr/bin/env node

import { deployCommand } from "../src/commands/deploy.js";
import { configSetCommand } from "../src/commands/configSet.js";

const subcommand = process.argv[2];
const arg = process.argv[3];

async function main() {
  try {
    if (subcommand === "deploy") {
      if (!arg) throw new Error("Usage: orch deploy <file>");
      await deployCommand(arg);
    } else if (subcommand === "config" && arg === "set") {
      const args = process.argv.slice(4);
      configSetCommand(args);
    } else {
      console.log(`
orch — BYO-K8s CLI

Usage:
  orch deploy <file>        Deploy using an orch.yaml manifest
  orch config set           Configure control plane URL and API key
      `);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
