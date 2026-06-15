import { loadConfig } from '../config.js'
import { getDeployments, getPipelines, triggerPipelineRun } from '../api.js'

export async function pipelineTriggerCommand(deploymentName) {
  if (!deploymentName) throw new Error('Usage: orch pipeline trigger <deployment-name>')

  const config = loadConfig()
  if (!config.controlPlaneUrl) throw new Error('controlPlaneUrl missing in ~/.orch/config.yaml')
  if (!config.apiKey) throw new Error('apiKey missing in ~/.orch/config.yaml')

  // step 1 — find deployment by name
  const deploymentsData = await getDeployments(config.controlPlaneUrl, config.apiKey)
  const deployment = deploymentsData.data.find(d => d.name === deploymentName)

  if (!deployment) {
    throw new Error(`Deployment '${deploymentName}' not found`)
  }

  // step 2 — find pipeline for this deployment
  const pipelinesData = await getPipelines(config.controlPlaneUrl, config.apiKey)
  const pipeline = pipelinesData.data.find(p => p.deploymentId === deployment.id)

  if (!pipeline) {
    throw new Error(`No pipeline found for deployment '${deploymentName}'`)
  }

  // step 3 — trigger the run
  console.log(`Triggering pipeline run for '${deploymentName}'...`)
  const run = await triggerPipelineRun(config.controlPlaneUrl, config.apiKey, pipeline.id)

  console.log(`Pipeline run started — id: ${run.id}`)
  console.log(`Branch: ${pipeline.branch}`)
  console.log(`Status: ${run.status}`)
}