import API_URL from "@/config";
import axios from "axios";

const instance = axios.create({
  withCredentials: true,
  baseURL: `${API_URL}`,
});

instance.interceptors.request.use(
  (config) => {
    console.log("Request Interceptor");
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log("Request Interceptor Error", error);
    return Promise.reject(error);
  }
);

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No refresh token available");

  const response = await axios.post(`${API_URL}/auth/refreshtoken`, {
    refreshToken,
  });

  if (response.data.accessToken) {
    localStorage.setItem("accessToken", response.data.accessToken);
    return response.data.accessToken;
  }
  throw new Error("Failed to refresh token");
};

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("accessToken");
        // localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // Redirect to login if token refresh fails
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
