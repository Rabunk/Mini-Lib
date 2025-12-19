import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api", // chỉnh đúng port backend
  headers: {
    "Content-Type": "application/json"
  }
});

const requestInit = async () => {
  try {
    const response = await axiosClient.get("/test-init");
    return response.data;
    } catch (error) {
    console.error("Error during requestInit:", error);
    throw error;
    }
};

export { requestInit };

axiosClient.interceptors.request.use(config => {
  const token = localStorage.getItem("gl_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
