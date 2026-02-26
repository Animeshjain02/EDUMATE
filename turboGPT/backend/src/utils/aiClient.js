import axios from "axios";

const aiClient = axios.create({
  baseURL: process.env.PYTHON_API_URL || "https://blindfoldedly-calpacked-joslyn.ngrok-free.dev",
  timeout: 60000,
});

export default aiClient;
