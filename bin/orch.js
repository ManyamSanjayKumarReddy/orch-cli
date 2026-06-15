#!/usr/bin/env node

import { deployCommand } from "../src/commands/deploy.js";
import { configSetCommand } from "../src/commands/configSet.js";
import { statusCommand } from "../src/commands/status.js";
import { pipelineTriggerCommand } from "../src/commands/pipelineTrigger.js";
import { restartCommand } from "../src/commands/restart.js";
import { scaleCommand } from "../src/commands/scale.js";
import { destroyCommand } from "../src/commands/destroy.js";

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
    } else if (subcommand === "status") {
      await statusCommand(arg);
    } else if (subcommand === "pipeline" && arg === "trigger") {
      const deploymentName = process.argv[4];
      await pipelineTriggerCommand(deploymentName);
    } else if (subcommand === "restart") {
      await restartCommand(arg);
    } else if (subcommand === "scale") {
      const replicas = process.argv[4];
      await scaleCommand(arg, replicas);
    } else if (subcommand === "destroy") {
      await destroyCommand(arg);
    } else {
      console.log(`
orch — BYO-K8s CLI

Usage:
  orch deploy <file>                              Deploy using an orch.yaml manifest
  orch config set --url <url> --key <apiKey>      Configure control plane connection
  orch status <deployment-name>                   Show deployment status
  orch scale <deployment-name> <replicas>         Scale deployment replicas
  orch restart <deployment-name>                  Rolling restart of all replicas
  orch pipeline trigger <deployment-name>         Manually trigger a pipeline run
  orch destroy <deployment-name>                  Delete deployment and all resources

      `);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
