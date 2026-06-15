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
