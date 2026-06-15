import { loadConfig } from '../config.js'
import { getDeployments, scaleDeployment } from '../api.js'

export async function scaleCommand(deploymentName, replicas) {
  if (!deploymentName) throw new Error('Usage: orch scale <deployment-name> <replicas>')
  if (replicas === undefined) throw new Error('Usage: orch scale <deployment-name> <replicas>')

  const replicaCount = Number(replicas)
  if (!Number.isInteger(replicaCount) || replicaCount < 0) {
    throw new Error('replicas must be a non-negative integer')
  }

  const config = loadConfig()
  if (!config.controlPlaneUrl) throw new Error('controlPlaneUrl missing in ~/.orch/config.yaml')
  if (!config.apiKey) throw new Error('apiKey missing in ~/.orch/config.yaml')

  const deploymentsData = await getDeployments(config.controlPlaneUrl, config.apiKey)
  const deployment = deploymentsData.data.find(d => d.name === deploymentName)

  if (!deployment) throw new Error(`Deployment '${deploymentName}' not found`)

  console.log(`Scaling '${deploymentName}' to ${replicaCount} replica(s)...`)
  await scaleDeployment(config.controlPlaneUrl, config.apiKey, deployment.id, replicaCount)

  console.log(`Done. Desired replicas set to ${replicaCount}`)
}