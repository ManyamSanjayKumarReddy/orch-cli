import { loadConfig } from "../config.js";
import { parseOrchFile } from "../parser.js";
import { createPipelineDeployment, createPipeline } from "../api.js";

export async function deployCommand(filePath) {
  // step 1 — load control plane config
  console.log("Loading config...");
  const config = loadConfig();

  if (!config.controlPlaneUrl)
    throw new Error("controlPlaneUrl missing in ~/.orch/config.yaml");
  if (!config.apiKey) throw new Error("apiKey missing in ~/.orch/config.yaml");

  // step 2 — parse orch.yaml
  console.log(`Parsing ${filePath}...`);
  const { deployment, pipeline, namespace } = parseOrchFile(filePath);

  // step 3 — create the deployment
  console.log(`Creating deployment '${deployment.name}'...`);
  const deploymentResult = await createPipelineDeployment(
    config.controlPlaneUrl,
    config.apiKey,
    deployment,
  );

  const deploymentId = deploymentResult.id;

  console.log(`Deployment created — id: ${deploymentId}`);

  // step 4 — attach the pipeline
  console.log(`Attaching pipeline on branch '${pipeline.branch}'...`);
  const pipelineResult = await createPipeline(
    config.controlPlaneUrl,
    config.apiKey,
    deploymentId,
    pipeline,
  );

  console.log(`Pipeline created — id: ${pipelineResult.id}`);
  console.log(
    `\nDone. Push to '${pipeline.branch}' to trigger your first build.`,
  );
}
