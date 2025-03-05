import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // Django backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to refresh access token
export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refresh");
  if (!refreshToken) return null;

  try {
    const response = await axios.post(`${API_URL}/auth/token/refresh/`, { refresh: refreshToken });

    if (response.status === 200) {
      const data = response.data;
      localStorage.setItem("token", data.access); // Save new access token
      return data.access;
    }
  } catch (error) {
    console.error("Failed to refresh token", error);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh"); // Remove expired refresh token
    return null;
  }
}

// Function to attach Authorization token to headers
const authHeader = async () => {
  let token = localStorage.getItem("token");

  // If token is expired, try refreshing it
  if (!token) {
    token = await refreshAccessToken();
  }

  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Login
export const loginUser = async (username, password) => {
  try {
    const response = await api.post(`/auth/login/`, { username, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : "Server Error";
  }
};

// Register
export const registerUser = async (userData) => {
  try {
    const response = await api.post(`/auth/register/`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : "Server Error";
  }
};

// Get available rooms
export const getAvailableRooms = async () => {
  try {
    const response = await api.get(`/rooms/`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : "Server Error";
  }
};

// Book a room (With Token Refresh)
export const bookRoom = async (roomId) => {
  try {
    const headers = await authHeader();
    const response = await api.post(`/rooms/book/`, { room: roomId }, { headers });

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : "Server Error";
  }
};



// Log visitor entry
export const logVisitor = async (visitorData) => {
  try {
    const response = await api.post(`/visitors/`, visitorData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : "Server Error";
  }
};

// Fetch Admin Users (Ensuring Token Refresh)
export const getAdminUsers = async () => {
  try {
    const headers = await authHeader();
    const response = await api.get(`/auth/admin-users/`, { headers });

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expired, try refreshing it
      const newToken = await refreshAccessToken();
      if (newToken) {
        const response = await api.get(`/auth/admin-users/`, {
          headers: { Authorization: `Bearer ${newToken}` },
        });
        return response.data;
      }
    }
    throw error.response ? error.response.data : "Server Error";
  }
};

export const getInvoices = async (token) => {
  const response = await fetch("http://127.0.0.1:8000/invoices/", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to fetch invoices");

  return response.json();
};


