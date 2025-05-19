import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { Router } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authuser, setAuthUser] = useState(null);
  const [onlineUsers, setonlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //Login function to handle authentication and socket

 const login = async (state, credentials) => {
  try {
    const { data } = await axios.post(`/api/auth/${state}`, credentials);
    console.log("API Response:", data); // Debug log

    if (data.success && data.userData) {
      setAuthUser(data.userData);
      connectSocket(data.userData);
      axios.defaults.headers.common["token"] = data.token;
      setToken(data.token);
      localStorage.setItem("token", data.token);
      toast.success(data.message);
    // ✅ Redirect to homepage
    } else {
      toast.error("Invalid user data received");
    }
  } catch (error) {
    console.error("Login error:", error);
    toast.error(error.message);
  }
};

  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setonlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logout out successfully");
    socket.disconnect();
  };

  //Update profile function to handle user profile update

  const updateProfile = async (body) => {
  try {
    const { data } = await axios.put("/api/auth/update-profile", body, {
      headers: { token },
    });
    if (data.success) {
      setAuthUser(data.user);
      toast.success("Profile updated successfully");
    } else {
      toast.error(data.message || "Failed to update profile");
    }
  } catch (error) {
    console.error("Update Profile Error:", error);
    toast.error(error.response?.data?.message || error.message);
  }
};
  //connect socket function to handle socket connection and online users updated (1)

const connectSocket = (userData) => {
  if (!userData || socket?.connected) return;

  const newSocket = io(backendUrl, {
    auth: {
      userId: userData._id,
    },
  });

  setSocket(newSocket);

  newSocket.on("getOnlineUsers", (userIds) => {
    setonlineUsers(userIds);
  });
};


  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      setToken(token);
          checkAuth();
    }else{
        setAuthUser(null);
    }

  }, []);

  const value = {
    axios,
    authuser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
