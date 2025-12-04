import axios from "axios";
import { BASE_URL } from "./env";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Aumente o timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

