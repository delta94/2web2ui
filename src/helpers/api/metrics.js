const METRICS_BASE_URL = `/v1/metrics`;
const DELIVERABILITY_BASE_URL = `${METRICS_BASE_URL}/deliverability`;

export function getDomainsMetrics(params) {
  return {
    method: 'GET',
    url: `${METRICS_BASE_URL}/domains`,
    params,
  };
}

export function getCampaignsMetrics(params) {
  return {
    method: 'GET',
    url: `${METRICS_BASE_URL}/campaigns`,
    params,
  };
}

export function getSendingIpsMetrics(params) {
  return {
    method: 'GET',
    url: `${METRICS_BASE_URL}/sending-ips`,
    params,
  };
}

export function getTemplatesMetrics(params) {
  return {
    method: 'GET',
    url: `${METRICS_BASE_URL}/templates`,
    params,
  };
}

export function getDeliverabilityMetrics(params, path) {
  const joinedPath = `${DELIVERABILITY_BASE_URL}${path ? `/${path}` : ''}`;
  return {
    method: 'GET',
    url: joinedPath,
    params,
  };
}

export function getTimeSeriesDeliverabilityMetrics(params) {
  return {
    method: 'GET',
    url: `${DELIVERABILITY_BASE_URL}/time-series`,
    params,
  };
}

export function getBounceClassificationDeliverabilityMetrics(params) {
  return {
    method: 'GET',
    url: `${DELIVERABILITY_BASE_URL}/bounce-classification`,
    params,
  };
}

export function getBounceReasonDeliverabilityMetrics(params) {
  return {
    method: 'GET',
    url: `${DELIVERABILITY_BASE_URL}/bounce-reason`,
    params,
  };
}

export function getBounceReasonsByDomainDeliverabilityMetrics(params) {
  return {
    method: 'GET',
    url: `${DELIVERABILITY_BASE_URL}/bounce-reason/domain`,
    params,
  };
}

export function getRejectionReasonByDomainDeliverabilityMetrics(params) {
  return {
    method: 'GET',
    url: `${DELIVERABILITY_BASE_URL}/rejection-reason/domain`,
    params,
  };
}

export function getDelayReasonByDomainDeliverabilityMetrics(params) {
  return {
    method: 'GET',
    url: `${DELIVERABILITY_BASE_URL}/delay-reason/domain`,
    params,
  };
}

export function getAttemptedDeliverabilityMetrics(params) {
  return {
    method: 'GET',
    url: `${DELIVERABILITY_BASE_URL}/deliverability/attempt`,
    params,
  };
}
