import { loadConfig } from '../config.js'
import { getDeployments, restartDeployment } from '../api.js'

export async function restartCommand(deploymentName) {
  if (!deploymentName) throw new Error('Usage: orch restart <deployment-name>')

  const config = loadConfig()
  if (!config.controlPlaneUrl) throw new Error('controlPlaneUrl missing in ~/.orch/config.yaml')
  if (!config.apiKey) throw new Error('apiKey missing in ~/.orch/config.yaml')

  // step 1 — find deployment by name
  const deploymentsData = await getDeployments(config.controlPlaneUrl, config.apiKey)
  const deployment = deploymentsData.data.find(d => d.name === deploymentName)

  if (!deployment) {
    throw new Error(`Deployment '${deploymentName}' not found`)
  }

  // step 2 — restart
  console.log(`Restarting deployment '${deploymentName}'...`)
  const result = await restartDeployment(config.controlPlaneUrl, config.apiKey, deployment.id)

  console.log(`Restarting — ${result.replicasTerminated} replica(s) terminated and rescheduling`)
}