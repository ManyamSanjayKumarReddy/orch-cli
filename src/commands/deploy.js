import { loadConfig } from "../config.js";
import { parseOrchFile } from "../parser.js";
import {
  createPipelineDeployment,
  createPipeline,
  createService,
  createIngress,
  triggerPipelineRun,
} from "../api.js";

export async function deployCommand(filePath) {
  // step 1 — load control plane config
  console.log("Loading config...");
  const config = loadConfig();

  if (!config.controlPlaneUrl)
    throw new Error("controlPlaneUrl missing in ~/.orch/config.yaml");
  if (!config.apiKey) throw new Error("apiKey missing in ~/.orch/config.yaml");

  // step 2 — parse orch.yaml
  console.log(`Parsing ${filePath}...`);
  const { deployment, pipeline, service, ingress, namespace } =
    parseOrchFile(filePath);

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

  // step 5 — create service (optional)
  if (service) {
    console.log(`Creating service '${service.name}'...`);
    const serviceResult = await createService(
      config.controlPlaneUrl,
      config.apiKey,
      {
        name: service.name,
        labelSelector: deployment.labels,
        targetPort: deployment.containerPort,
      },
    );
    console.log(`Service created — id: ${serviceResult.id}`);

    // step 6 — create ingress (optional, only if service exists)
    if (ingress) {
      console.log(`Creating ingress '${ingress.name}'...`);
      const ingressResult = await createIngress(
        config.controlPlaneUrl,
        config.apiKey,
        {
          name: ingress.name,
          rules: [
            {
              path: ingress.path,
              serviceName: service.name,
              host: ingress.host ?? undefined,
              tls: ingress.tls ?? false,
            },
          ],
        },
      );
      console.log(`Ingress created — id: ${ingressResult.id}`);
    }
  }

  // step 7 — trigger first pipeline run automatically
  console.log(`Triggering first pipeline run...`);
  const runResult = await triggerPipelineRun(
    config.controlPlaneUrl,
    config.apiKey,
    pipelineResult.id,
  );
  console.log(`Pipeline run started — id: ${runResult.id}`);

  console.log(
    `\nDone. Your first build is running. Push to '${pipeline.branch}' for future deployments.`,
  );
}
