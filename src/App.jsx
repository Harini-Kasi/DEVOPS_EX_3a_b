import { HashRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import SettingsPage from "./pages/SettingsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Notification from "./components/Notification";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import { useEffect } from "react";
import { ensureAdminCredentials } from "./utils/storage";

export default function App() {
  useEffect(() => {
    ensureAdminCredentials();
  }, []);

  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <HashRouter>
            <Notification />
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff"
                element={
                  <ProtectedRoute role="staff">
                    <StaffDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </HashRouter>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
