import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../components/LogOut.css";

export default function LogOut({ onClose = () => {} }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [err,  setErr] = useState("");

  const handleLogout = async () => {
    if (busy) return;
    setBusy(true);
    setErr("");

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (e) {
      console.warn("Server logout failed (continuing locally)", e);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie.split(";").forEach(c => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // close modal, go to home page
    onClose();
    navigate("/", { replace: true });
  };

  return (
    <div className="logout-container">
      <h1 className="logout-header">Logout&nbsp;?</h1>

      {err && <p className="logout-error">{err}</p>}

      <ul>
        <li className="logout-list">
          <button
            className="confirm-logout"
            disabled={busy}
            onClick={handleLogout}
          >
            {busy ? "Logging out…" : "Confirm Logout"}
          </button>
        </li>
        <li className="logout-list">
          <button
            className="cancel-logout"
            disabled={busy}
            onClick={onClose}
          >
            Cancel
          </button>
        </li>
      </ul>
    </div>
  );
}
