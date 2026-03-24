/**
 * Shared API utility functions for GSMS
 */

const API_BASE = '';

export async function apiCall(endpoint, options = {}) {
  const { method = 'GET', body = null, headers = {} } = options;

  const fetchOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

export async function login(username, password) {
  return apiCall('/api/login', {
    method: 'POST',
    body: { username, password }
  });
}

export async function getCustomerProjects(customerId) {
  return apiCall(`/api/customer/projects?customerId=${customerId}`);
}

export async function createProject(customerId, vehicleId, serviceId, preferredDate, notes) {
  return apiCall('/api/customer/projects', {
    method: 'POST',
    body: { customerId, vehicleId, serviceId, preferredDate, notes }
  });
}

export async function getCustomerJobs(customerId) {
  return apiCall(`/api/customer/jobs?customerId=${customerId}`);
}

export async function getAdminProjects(status = null) {
  const url = status ? `/api/admin/projects?status=${status}` : '/api/admin/projects';
  return apiCall(url);
}

export async function updateProjectStatus(projectId, status) {
  return apiCall(`/api/admin/projects/${projectId}/status`, {
    method: 'PUT',
    body: { status }
  });
}

export async function getTechnicians() {
  return apiCall('/api/admin/technicians');
}

export async function assignTechnician(jobId, technicianId) {
  return apiCall(`/api/admin/jobs/${jobId}/assign`, {
    method: 'PUT',
    body: { technicianId }
  });
}

export async function getTechJobs(technicianId) {
  return apiCall(`/api/tech/jobs?technicianId=${technicianId}`);
}

export async function updateJobStatus(jobId, status) {
  return apiCall(`/api/tech/jobs/${jobId}/status`, {
    method: 'PUT',
    body: { status }
  });
}

export async function addJobNote(jobId, technicianId, noteText) {
  return apiCall(`/api/tech/jobs/${jobId}/notes`, {
    method: 'PUT',
    body: { technicianId, noteText }
  });
}

export async function getServices() {
  return apiCall('/api/services');
}

export async function getCustomerVehicles(customerId) {
  return apiCall(`/api/vehicles/${customerId}`);
}
