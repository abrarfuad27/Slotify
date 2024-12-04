import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// Create the AuthContext
const AuthContext = createContext(null);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on initial load
  useEffect(() => {
    const validateUser = async () => {
      try {
        const response = await axios.get("http://localhost:4000/validateUser", {
          withCredentials: true,
        });

        // If validation is successful, set the user
        setUser(response.data.user);
      } catch (error) {
        // User is not authenticated
        setUser(null);
      } finally {
        // Loading is complete
        setIsLoading(false);
      }
    };

    validateUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/userLogin",
        { email, password },
        { withCredentials: true }
      );

      // Validate user again to get user details
      const validateResponse = await axios.get(
        "http://localhost:4000/validateUser",
        {
          withCredentials: true,
        }
      );
      setUser(validateResponse.data.user);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:4000/userLogout",
        {},
        {
          withCredentials: true,
        }
      );
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Context value
  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};