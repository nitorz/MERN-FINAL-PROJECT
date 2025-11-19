// src/api.js
import axios from "axios";

export const api = axios.create({ 
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' 
});

export function authHeader(token) { 
  return { headers: { Authorization: `Bearer ${token}` } };
}
