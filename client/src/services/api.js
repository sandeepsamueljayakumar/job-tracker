// Determine the API URL based on the environment
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // In production, use relative path (same domain)
  : 'http://localhost:5000/api'; // In development, use localhost

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }
  return response.json();
};

// Job API functions
export const getJobs = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const url = `${API_BASE_URL}/jobs${queryParams ? `?${queryParams}` : ""}`;
  
  const response = await fetch(url);
  return handleResponse(response);
};

export const getJobById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
  return handleResponse(response);
};

export const createJob = async (jobData) => {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jobData),
  });
  return handleResponse(response);
};

export const updateJob = async (id, jobData) => {
  const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jobData),
  });
  return handleResponse(response);
};

export const deleteJob = async (id) => {
  const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};

export const getJobStats = async () => {
  const response = await fetch(`${API_BASE_URL}/jobs/stats/overview`);
  return handleResponse(response);
};

export const getJobsNeedingFollowUp = async () => {
  const response = await fetch(`${API_BASE_URL}/jobs/followup/needed`);
  return handleResponse(response);
};

// Interview API functions
export const getInterviews = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const url = `${API_BASE_URL}/interviews${queryParams ? `?${queryParams}` : ""}`;
  
  const response = await fetch(url);
  return handleResponse(response);
};

export const getInterviewById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/interviews/${id}`);
  return handleResponse(response);
};

export const getInterviewsByJobId = async (jobId) => {
  const response = await fetch(`${API_BASE_URL}/interviews/job/${jobId}`);
  return handleResponse(response);
};

export const createInterview = async (interviewData) => {
  const response = await fetch(`${API_BASE_URL}/interviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(interviewData),
  });
  return handleResponse(response);
};

export const updateInterview = async (id, interviewData) => {
  const response = await fetch(`${API_BASE_URL}/interviews/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(interviewData),
  });
  return handleResponse(response);
};

export const deleteInterview = async (id) => {
  const response = await fetch(`${API_BASE_URL}/interviews/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};

export const getUpcomingInterviews = async () => {
  const response = await fetch(`${API_BASE_URL}/interviews/calendar/upcoming`);
  return handleResponse(response);
};

export const getInterviewStats = async () => {
  const response = await fetch(`${API_BASE_URL}/interviews/stats/overview`);
  return handleResponse(response);
};