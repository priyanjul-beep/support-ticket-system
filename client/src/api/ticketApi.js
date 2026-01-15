import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:5000/api"
  baseURL: `${import.meta.env.VITE_API_URL}/api`

});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const createTicket = (data) => API.post("/tickets", data);
export const getMyTickets = () => API.get("/tickets/my");
export const getAllTickets = () => API.get("/tickets");
export const updateTicket = (id, data) =>
  API.put(`/tickets/${id}`, data);
