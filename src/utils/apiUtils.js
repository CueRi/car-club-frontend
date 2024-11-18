import axios from "axios";

const API_URL = import.meta.env.VITE_CAR_CLUB_URL;

export const createApiClient = (navigate) => {
  const api = axios.create({
    baseURL: `${API_URL}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export const handleApiError = (error) => {
  return error.response?.data?.error || "An error occurred";
};
