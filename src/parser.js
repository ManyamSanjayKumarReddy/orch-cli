import fs from 'fs'
import yaml from 'js-yaml'

export function parseOrchFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`)
  }

  const content = fs.readFileSync(filePath, 'utf8')
  const doc = yaml.load(content)

  // validate required fields
  const name = doc?.metadata?.name
  const namespace = doc?.metadata?.namespace
  const repoUrl = doc?.spec?.repoUrl
  const tag = doc?.spec?.tag
  const cpu = doc?.spec?.cpu
  const memory = doc?.spec?.memory
  const port = doc?.spec?.port
  const branch = doc?.cicd?.branch
  const webhookSecret = doc?.cicd?.webhookSecret

  if (!name) throw new Error('metadata.name is required')
  if (!namespace) throw new Error('metadata.namespace is required')
  if (!repoUrl) throw new Error('spec.repoUrl is required')
  if (!tag) throw new Error('spec.tag is required')
  if (!cpu) throw new Error('spec.cpu is required')
  if (!memory) throw new Error('spec.memory is required')
  if (!port) throw new Error('spec.port is required')
  if (!branch) throw new Error('cicd.branch is required')
  if (!webhookSecret) throw new Error('cicd.webhookSecret is required')

  // optional fields
  const replicas = doc?.spec?.replicas ?? 1
  const cmd = doc?.spec?.cmd ?? null
  const labels = doc?.spec?.labels ?? {}
  const config = doc?.spec?.config ?? null
  const secret = doc?.spec?.secret ?? null
  const volumeMounts = doc?.spec?.volumeMounts ?? []
  const event = doc?.cicd?.event ?? 'push'

  // map probes
  const livenessProbe = doc?.spec?.probes?.liveness ?? null
  const readinessProbe = doc?.spec?.probes?.readiness ?? null

  return {
    // for POST /deployment/pipeline
    deployment: {
      name,
      repoUrl,
      tag,
      cpu,
      memory,
      desiredReplicas: replicas,
      containerPort: port,
      cmd,
      labels,
      configName: config,
      secretName: secret,
      volumeMounts,
      livenessProbe,
      readinessProbe,
    },
    // for POST /pipeline
    pipeline: {
      branch,
      event,
      webhookSecret,
    },
    // metadata
    namespace,
  }
}