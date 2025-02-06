import axios from "axios";

//const accessToken = localStorage.getItem("access_token");
// axios send credentials (cookie)
export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  headers: {
    "Content-Type": "application/json",
    // Authorization: `Bearer ${accessToken}`,
  },
  withCredentials: true,
});
