import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { DEPARTMENTS, DESIGNATIONS } from "../utils/constants";
import { getAdminCredentials } from "../utils/storage";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showNotification } = useNotification();

  const [role, setRole] = useState("");

  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [staffName, setStaffName] = useState("");
  const [staffDesignation, setStaffDesignation] = useState("");
  const [staffDepartment, setStaffDepartment] = useState("");

  const [errors, setErrors] = useState({});

  function clearErrors() {
    setErrors({});
  }

  function handleAdminLogin() {
    const username = adminUsername.trim();
    const password = adminPassword;

    const newErrors = {};
    if (!username) newErrors.adminUsername = true;
    if (!password) newErrors.adminPassword = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showNotification("Please enter both username and password.", "error");
      return;
    }

    const creds = getAdminCredentials();
    if (username !== creds.username || password !== creds.password) {
      setErrors({ adminPassword: true });
      showNotification("Invalid admin credentials. Try admin / admin123.", "error");
      return;
    }

    login({ role: "admin", name: "Administrator", username });
    showNotification(`Welcome back, ${username}.`, "success");
    navigate("/admin");
  }

  function handleStaffLogin() {
    const name = staffName.trim();
    const designation = staffDesignation;
    const department = staffDepartment;

    const newErrors = {};
    if (!name) newErrors.staffName = true;
    if (!designation) newErrors.staffDesignation = true;
    if (!department) newErrors.staffDepartment = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showNotification("Please fill in your name, designation and department.", "error");
      return;
    }

    login({ role: "staff", name, department, designation });
    showNotification(`Welcome, ${name}.`, "success");
    navigate("/staff");
  }

  function handleSubmit(e) {
    e.preventDefault();
    clearErrors();

    if (role === "admin") {
      handleAdminLogin();
    } else if (role === "staff") {
      handleStaffLogin();
    } else {
      showNotification("Please select a role to continue.", "error");
    }
  }

  return (
    <section id="loginPage" className="login-page">
      <div className="ledger-band"></div>
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-mark">FPA</div>
          <h1>
            Faculty Performance
            <br />
            Appraisal System
          </h1>
          <p className="brand-sub">Departmental Evaluation &amp; Scoring Ledger</p>
        </div>

        <form id="loginForm" autoComplete="off" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="roleSelect">Login as</label>
            <select
              id="roleSelect"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="" disabled>
                Select your role
              </option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <div id="adminFields" className={`field-group role-fields${role !== "admin" ? " hidden" : ""}`}>
            <label htmlFor="adminUsername">Username</label>
            <input
              type="text"
              id="adminUsername"
              placeholder="Enter admin username"
              className={errors.adminUsername ? "input-error" : ""}
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
            />
            <label htmlFor="adminPassword">Password</label>
            <input
              type="password"
              id="adminPassword"
              placeholder="Enter password"
              className={errors.adminPassword ? "input-error" : ""}
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
          </div>

          <div id="staffFields" className={`field-group role-fields${role !== "staff" ? " hidden" : ""}`}>
            <label htmlFor="staffName">Faculty Name</label>
            <input
              type="text"
              id="staffName"
              placeholder="Enter your full name"
              className={errors.staffName ? "input-error" : ""}
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
            />
            <label htmlFor="staffDesignation">Designation</label>
            <select
              id="staffDesignation"
              className={errors.staffDesignation ? "input-error" : ""}
              value={staffDesignation}
              onChange={(e) => setStaffDesignation(e.target.value)}
            >
              <option value="" disabled>
                Select designation
              </option>
              {DESIGNATIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
            <label htmlFor="staffDepartment">Department</label>
            <select
              id="staffDepartment"
              className={errors.staffDepartment ? "input-error" : ""}
              value={staffDepartment}
              onChange={(e) => setStaffDepartment(e.target.value)}
            >
              <option value="" disabled>
                Select department
              </option>
              {DEPARTMENTS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" id="loginBtn" className="btn-primary btn-block">
            Sign In
          </button>
          <p className="login-hint">
            Admin demo credentials — username: <strong>admin</strong>, password: <strong>admin123</strong>
          </p>
        </form>
      </div>
    </section>
  );
}
