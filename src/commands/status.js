import { loadConfig } from '../config.js'
import { getDeployments, getPipelines, getPipelineRuns } from '../api.js'

export async function statusCommand(deploymentName) {
  if (!deploymentName) throw new Error('Usage: orch status <deployment-name>')

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

  // step 3 — get last pipeline run if pipeline exists
  let lastRun = null
  if (pipeline) {
    const runsData = await getPipelineRuns(config.controlPlaneUrl, config.apiKey, pipeline.id)
    lastRun = runsData.data?.[0] ?? null
  }

  // print status
  console.log('')
  console.log(`Deployment : ${deployment.name}`)
  console.log(`Status     : ${deployment.status}`)
  console.log(`Replicas   : ${deployment.replicas.actual}/${deployment.desiredReplicas} running`)
  console.log(`Image      : ${deployment.image}`)
  console.log(`Pipeline   : ${pipeline ? pipeline.id : 'none'}`)
  console.log(`Branch     : ${pipeline ? pipeline.branch : 'none'}`)
  console.log(`Last Run   : ${lastRun ? lastRun.status : 'none'}`)
  console.log('')
}