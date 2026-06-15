import { loadConfig } from '../config.js'
import {
  getDeployments,
  getPipelines,
  getServices,
  getIngresses,
  deleteIngress,
  deleteService,
  deletePipeline,
  deleteDeployment
} from '../api.js'

export async function destroyCommand(deploymentName) {
  if (!deploymentName) throw new Error('Usage: orch destroy <deployment-name>')

  const config = loadConfig()
  if (!config.controlPlaneUrl) throw new Error('controlPlaneUrl missing in ~/.orch/config.yaml')
  if (!config.apiKey) throw new Error('apiKey missing in ~/.orch/config.yaml')

  // step 1 — find deployment by name
  const deploymentsData = await getDeployments(config.controlPlaneUrl, config.apiKey)
  const deployment = deploymentsData.data.find(d => d.name === deploymentName)

  if (!deployment) throw new Error(`Deployment '${deploymentName}' not found`)

  // step 2 — find pipeline
  const pipelinesData = await getPipelines(config.controlPlaneUrl, config.apiKey)
  const pipeline = pipelinesData.data.find(p => p.deploymentId === deployment.id)

  // step 3 — find service (by label selector matching deployment labels)
  const servicesData = await getServices(config.controlPlaneUrl, config.apiKey)
  const service = servicesData.data.find(s => {
    const selector = s.labelSelector ?? {}
    const labels = deployment.labels ?? {}
    return Object.entries(selector).every(([k, v]) => labels[k] === v)
  })

  // step 4 — find ingress (by serviceName matching service name)
  let ingress = null
  if (service) {
    const ingressesData = await getIngresses(config.controlPlaneUrl, config.apiKey)
    ingress = ingressesData.data.find(i =>
      i.rules?.some(r => r.serviceName === service.name)
    )
  }

  // destroy in reverse order
  console.log(`\nDestroying '${deploymentName}'...`)

  if (ingress) {
    console.log(`Deleting ingress '${ingress.name}'...`)
    await deleteIngress(config.controlPlaneUrl, config.apiKey, ingress.name)
    console.log(`Ingress deleted`)
  }

  if (service) {
    console.log(`Deleting service '${service.name}'...`)
    await deleteService(config.controlPlaneUrl, config.apiKey, service.name)
    console.log(`Service deleted`)
  }

  if (pipeline) {
    console.log(`Deleting pipeline '${pipeline.id}'...`)
    await deletePipeline(config.controlPlaneUrl, config.apiKey, pipeline.id)
    console.log(`Pipeline deleted`)
  }

  console.log(`Deleting deployment '${deploymentName}'...`)
  await deleteDeployment(config.controlPlaneUrl, config.apiKey, deployment.id)
  console.log(`Deployment deleted`)

  console.log(`\nDone. '${deploymentName}' and all associated resources destroyed.`)
}