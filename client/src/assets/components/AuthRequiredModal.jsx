// components/AuthRequiredModal.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/components/AuthRequiredModal.css";

export default function AuthRequiredModal() {
  const navigate = useNavigate();

  return (
    <div className="auth-required-overlay" role="dialog" aria-modal="true">
      <div className="auth-required-modal">
        <h2>You need an account to continue</h2>
        <p>Log in or create a free account to keep using Nahidea.</p>

        <div className="auth-required-actions">
          <button
            className="btn-auth-primary"
            onClick={() => navigate("/login")}
          >
            Log in
          </button>
          <button
            className="btn-auth-secondary"
            onClick={() => navigate("/register")}
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}