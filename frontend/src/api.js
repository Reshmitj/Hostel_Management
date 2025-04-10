import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api"; // Updated base URL for Django backend API

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
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

  // If token is missing or expired, try refreshing it
  if (!token) {
    token = await refreshAccessToken();
  }

  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ Login User
export const loginUser = async (username, password) => {
  try {
    const response = await api.post(`/auth/login/`, { username, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : "Server Error";
  }
};

// ✅ Register User
export const registerUser = async (userData) => {
  try {
    const response = await api.post(`/auth/register/`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : "Server Error";
  }
};

// ✅ Fetch Available Rooms
export const getAvailableRooms = async () => {
  try {
    const response = await api.get(`/rooms/`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : "Server Error";
  }
};

// ✅ Book a Room
export const bookRoom = async (roomId) => {
  try {
    const headers = await authHeader();
    const response = await api.post(`/rooms/book/`, { room: roomId }, { headers });

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : "Server Error";
  }
};

// ✅ Fetch Room Management (Admin only)
export const getRooms = async () => {
  try {
    const headers = await authHeader();
    const response = await api.get(`/rooms/`, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : "Server Error";
  }
};

// ✅ Add a Room (Admin only)
export const addRoom = async (roomData) => {
  try {
    const headers = await authHeader();
    const response = await api.post(`/rooms/`, roomData, { headers });

    return response.data;
  } catch (error) {
    console.error("Error adding room:", error);
    throw error.response ? error.response.data : "Server Error";
  }
};


// ✅ Delete Room (Admin only)
export const deleteRoom = async (roomId) => {
  try {
    const headers = await authHeader();
    const response = await api.delete(`/rooms/${roomId}/`, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : "Server Error";
  }
};

// ✅ Log Visitor Entry
export const logVisitor = async (visitorData) => {
  try {
    const headers = await authHeader();
    const response = await api.post(`/visitor-log/`, visitorData, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : "Server Error";
  }
};

// ✅ Fetch Visitor Logs (Admin only)
export const getVisitorLogs = async () => {
  try {
    const headers = await authHeader();
    const response = await api.get(`/visitor-log/`, { headers });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : "Server Error";
  }
};

// ✅ Fetch Admin Users
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

// ✅ Fetch Billing Invoices
export const getInvoices = async () => {
  try {
    const headers = await authHeader();
    const response = await api.get(`/billing/invoices/`, { headers });

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : "Server Error";
  }
};

// ✅ Generate Invoices (Admin only)
export const generateInvoices = async () => {
  try {
    const headers = await authHeader();
    const response = await api.post(`/billing/generate/`, {}, { headers });

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : "Server Error";
  }
};

// ✅ Fetch User Profile
export const getUserProfile = async () => {
  try {
    const headers = await authHeader();
    const response = await api.get(`/auth/profile/`, { headers });

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : "Server Error";
  }
};

// api.js

export const getAssignedRoom = async (token) => {
  const response = await fetch("http://127.0.0.1:8000/api/assigned-room/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch assigned room");
  }
  return await response.json();
};


// ✅ Logout User
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
};
