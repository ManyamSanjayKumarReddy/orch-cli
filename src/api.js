export async function createPipelineDeployment(
  controlPlaneUrl,
  apiKey,
  deploymentData,
) {
  const res = await fetch(`${controlPlaneUrl}/deployment/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(deploymentData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Failed to create deployment: ${data.message}`);
  }

  return data;
}

export async function createPipeline(
  controlPlaneUrl,
  apiKey,
  deploymentId,
  pipelineData,
) {
  const res = await fetch(`${controlPlaneUrl}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      deploymentId,
      ...pipelineData,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Failed to create pipeline: ${data.message}`);
  }

  return data;
}

export async function createService(controlPlaneUrl, apiKey, serviceData) {
  const res = await fetch(`${controlPlaneUrl}/service`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serviceData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Failed to create service : ${data.message}`);
  }

  return data
}

export async function createIngress(controlPlaneUrl, apiKey, ingressData) {
  const res = await fetch(`${controlPlaneUrl}/ingress`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ingressData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Failed to create ingress: ${data.message}`);
  }

  return data;
}

export async function triggerPipelineRun(controlPlaneUrl, apiKey, pipelineId) {
  const res = await fetch(`${controlPlaneUrl}/pipeline/${pipelineId}/run`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(`Failed to trigger pipeline run: ${data.message}`)
  }

  return data
}

export async function getDeployments(controlPlaneUrl, apiKey) {
  const res = await fetch(`${controlPlaneUrl}/deployments`, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Failed to fetch deployments: ${data.message}`)
  return data
}

export async function getPipelines(controlPlaneUrl, apiKey) {
  const res = await fetch(`${controlPlaneUrl}/pipelines`, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Failed to fetch pipelines: ${data.message}`)
  return data
}

export async function getPipelineRuns(controlPlaneUrl, apiKey, pipelineId) {
  const res = await fetch(`${controlPlaneUrl}/pipeline/${pipelineId}/runs`, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Failed to fetch pipeline runs: ${data.message}`)
  return data
}

export async function restartDeployment(controlPlaneUrl, apiKey, deploymentId) {
  const res = await fetch(`${controlPlaneUrl}/deployment/${deploymentId}/restart`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Failed to restart deployment: ${data.message}`)
  return data
}

export async function scaleDeployment(controlPlaneUrl, apiKey, deploymentId, replicas) {
  const res = await fetch(`${controlPlaneUrl}/deployment/${deploymentId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ desiredReplicas: replicas })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Failed to scale deployment: ${data.message}`)
  return data
}

export async function deleteDeployment(controlPlaneUrl, apiKey, deploymentId) {
  const res = await fetch(`${controlPlaneUrl}/deployment/${deploymentId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${apiKey}` }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Failed to delete deployment: ${data.message}`)
  return data
}

export async function deletePipeline(controlPlaneUrl, apiKey, pipelineId) {
  const res = await fetch(`${controlPlaneUrl}/pipeline/${pipelineId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${apiKey}` }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Failed to delete pipeline: ${data.message}`)
  return data
}

export async function deleteService(controlPlaneUrl, apiKey, serviceName) {
  const res = await fetch(`${controlPlaneUrl}/service/${serviceName}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${apiKey}` }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Failed to delete service: ${data.message}`)
  return data
}

export async function deleteIngress(controlPlaneUrl, apiKey, ingressName) {
  const res = await fetch(`${controlPlaneUrl}/ingress/${ingressName}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${apiKey}` }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Failed to delete ingress: ${data.message}`)
  return data
}

export async function getServices(controlPlaneUrl, apiKey) {
  const res = await fetch(`${controlPlaneUrl}/services`, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Failed to fetch services: ${data.message}`)
  return data
}

export async function getIngresses(controlPlaneUrl, apiKey) {
  const res = await fetch(`${controlPlaneUrl}/ingresses`, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Failed to fetch ingresses: ${data.message}`)
  return data
}