import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, getToken, setToken, clearToken } from "./api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api.auth
      .me()
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    setAuthError("");
    try {
      const res = await api.auth.login({ email, password });
      setToken(res.access_token);
      setUser(res.user);
      return true;
    } catch (err) {
      setAuthError(err.message || "Login failed");
      return false;
    }
  }, []);

  const register = useCallback(async (email, password, fullName) => {
    setAuthError("");
    try {
      const res = await api.auth.register({ email, password, full_name: fullName });
      setToken(res.access_token);
      setUser(res.user);
      return true;
    } catch (err) {
      setAuthError(err.message || "Registration failed");
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, authError, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
