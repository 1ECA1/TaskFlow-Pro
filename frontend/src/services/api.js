const API_URL = "http://127.0.0.1:8000/api";

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("accessToken");

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  // Only add JWT when authentication is required
  if (token && !options.skipAuth) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        data?.message ||
        Object.values(data || {})?.flat()?.[0] ||
        "Something went wrong with the request.",
    );
  }

  return data;
};

// =========================
// LOGIN
// =========================

export const loginUser = async (username, password) => {
  const data = await apiRequest("/login/", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify({
      username,
      password,
    }),
  });

  localStorage.setItem("accessToken", data.access);
  localStorage.setItem("refreshToken", data.refresh);

  return data;
};

// =========================
// REGISTER
// =========================

export const registerUser = async (userData) => {
  return apiRequest("/register/", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify(userData),
  });
};

// =========================
// PROFILE
// =========================

export const getProfile = async () => {
  return apiRequest("/profile/");
};

export const updateProfile = async (profileData) => {
  return apiRequest("/profile/", {
    method: "PATCH",
    body:
      profileData instanceof FormData
        ? profileData
        : JSON.stringify(profileData),
  });
};

// =========================
// TASKS
// =========================

export const getTasks = async () => {
  return apiRequest("/tasks/");
};

export const createTask = async (taskData) => {
  return apiRequest("/tasks/", {
    method: "POST",
    body: JSON.stringify(taskData),
  });
};

export const updateTask = async (taskId, taskData) => {
  return apiRequest(`/tasks/${taskId}/`, {
    method: "PUT",
    body: JSON.stringify(taskData),
  });
};

export const deleteTask = async (taskId) => {
  return apiRequest(`/tasks/${taskId}/`, {
    method: "DELETE",
  });
};

// =========================
// PROJECTS
// =========================

export const getProjects = async () => {
  return apiRequest("/projects/");
};

export const createProject = async (projectData) => {
  return apiRequest("/projects/", {
    method: "POST",
    body: JSON.stringify(projectData),
  });
};

export const updateProject = async (projectId, projectData) => {
  return apiRequest(`/projects/${projectId}/`, {
    method: "PUT",
    body: JSON.stringify(projectData),
  });
};

export const deleteProject = async (projectId) => {
  return apiRequest(`/projects/${projectId}/`, {
    method: "DELETE",
  });
};
