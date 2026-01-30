import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// REQUEST → attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE → handle 401 & 422 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // Token missing / expired
      localStorage.removeItem("token");
      alert(error.response.data.message || "Session expired");
      window.location.href = "/login";
    }

    if (status === 422) {
      // Validation error
      alert(error.response.data.message);
    }

    return Promise.reject(error);
  }
);

export default api;
