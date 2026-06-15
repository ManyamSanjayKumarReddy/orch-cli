import os from "os";
import path from "path";
import fs from "fs";
import yaml from "js-yaml";

const CONFIG_DIR = path.join(os.homedir(), ".orch");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.yaml");

export function loadConfig() {
  if (!fs.existsSync(CONFIG_FILE)) {
    throw new Error(
      "No config found. Run orch config set --url <url> --key <apikey>",
    );
  }

  const content = fs.readFileSync(CONFIG_FILE, "utf8");
  return yaml.load(content);
}

export function saveConfig(data) {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }

  fs.writeFileSync(CONFIG_FILE, yaml.dump(data), "utf8");
}
