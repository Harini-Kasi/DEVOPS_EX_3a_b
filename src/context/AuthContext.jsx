import { createContext, useCallback, useContext, useState } from "react";

/* Session state kept in memory only (not persisted) — this mirrors
   the original vanilla-JS app, where `currentSession` was a plain
   in-memory variable that reset on page reload. */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null); // { role: 'admin'|'staff', name, department, designation }

  const login = useCallback((sessionData) => {
    setSession(sessionData);
  }, []);

  const logout = useCallback(() => {
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{ session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
