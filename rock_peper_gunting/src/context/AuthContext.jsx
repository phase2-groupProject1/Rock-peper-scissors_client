import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ServerSide } from "../../helpers/httpClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const storedName = localStorage.getItem("userName");
      const storedId = localStorage.getItem("userId");
      if (storedName) setUserName(storedName);
      if (storedId) setUserId(Number(storedId));
    } catch (_) {}
  }, []);

  // Keep localStorage in sync
  useEffect(() => {
    try {
      if (userName) localStorage.setItem("userName", userName);
      else localStorage.removeItem("userName");
      if (userId != null) localStorage.setItem("userId", String(userId));
      else localStorage.removeItem("userId");
    } catch (_) {}
  }, [userName, userId]);

  const register = async (username) => {
    setError(null);
    setLoading(true);
    try {
      const { data } = await ServerSide.post("/users", { username });
      const uName = data?.user?.username || username;
      const uId = data?.user?.id ?? null;
      setUserName(uName);
      setUserId(uId);
      return data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Register failed";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUserName("");
    setUserId(null);
    setError(null);
  };

  const value = useMemo(
    () => ({ userName, userId, loading, error, register, logout, setUserName, setUserId }),
    [userName, userId, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
