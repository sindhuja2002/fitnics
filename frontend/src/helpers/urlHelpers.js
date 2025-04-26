export const getServiceUrl = (servicePrefix) => {
  const currentHost = window.location.hostname;

  if (currentHost === 'frontend.localhost' || currentHost.endsWith('.localhost')) {
    return `https://${servicePrefix}.localhost`;
  }

  if (currentHost === 'localhost') {
    return `http://localhost:9000`;
  }

  const serviceHost = currentHost.replace(/^app\./, `${servicePrefix}.`);
  return `https://${serviceHost}`;
};
