import { createContext, useContext, useState } from "react";
import { API_URL } from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("musichub-user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData, accessToken, refreshToken) => {
    localStorage.setItem("musichub-user", JSON.stringify(userData));
    localStorage.setItem("musichub-access-token", accessToken);
    localStorage.setItem("musichub-refresh-token", refreshToken);

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("musichub-user");
    localStorage.removeItem("musichub-access-token");
    localStorage.removeItem("musichub-refresh-token");

    setUser(null);
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem(
      "musichub-refresh-token"
    );

    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/accounts/token/refresh/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh: refreshToken,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        logout();
        return null;
      }

      localStorage.setItem(
        "musichub-access-token",
        data.access
      );

      return data.access;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        refreshAccessToken,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}