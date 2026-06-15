import { saveConfig, loadConfig } from '../config.js'

export function configSetCommand(args) {
  const urlIndex = args.indexOf('--url')
  const keyIndex = args.indexOf('--key')

  if (urlIndex === -1 || keyIndex === -1) {
    throw new Error('Usage: orch config set --url <controlPlaneUrl> --key <apiKey>')
  }

  const url = args[urlIndex + 1]
  const key = args[keyIndex + 1]

  if (!url || url.startsWith('--')) throw new Error('--url value is missing')
  if (!key || key.startsWith('--')) throw new Error('--key value is missing')

  saveConfig({
    controlPlaneUrl: url,
    apiKey: key
  })

  console.log(`Config saved to ~/.orch/config.yaml`)
  console.log(`  controlPlaneUrl: ${url}`)
  console.log(`  apiKey: ${key}`)
}