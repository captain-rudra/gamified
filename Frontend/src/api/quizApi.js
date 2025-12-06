import axios from "axios";

export const api = axios.create({
  baseURL: "https://gamified-1.onrender.com/api", // your backend base URL
});

