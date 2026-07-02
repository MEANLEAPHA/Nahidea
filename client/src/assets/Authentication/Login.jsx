import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/Authentication/SignPage.css";

import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_SERVER_URL;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [viewPassword, setViewPassword] = useState("password");
  const [eye, setEye] = useState(faEyeSlash);
  const [loading, setLoading] = useState(false);

  const handleValue = (e) => {
    const { name, value } = e.target;
    if (name === "email") setInputEmail(value);
    if (name === "password") setInputPassword(value);
  };

  const isValid =
    inputEmail.trim() && inputPassword && inputPassword.length >= 6;

  const SubmitLogin = async () => {
    if (!isValid || loading) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inputEmail.trim(),
          password: inputPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000;

        login(data.token, expiry);

        navigate("/home");
      } else {
        switch (res.status) {
          case 400:
          case 401:
          case 403:
          case 404:
            toast.warning(data.message);
            break;
          default:
            toast.warning("Something went wrong");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error, please try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="container-form">
      <div className="toast-feedback">
        <ToastContainer position="top-right" autoClose={2000} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); SubmitLogin(); }}>
        <div className="form-center">
          <p className="p-page">Nahidea</p>
          <p className="p2-page">
            Strength grows when we care beyond ourselves <br />
            Help others the way you'd want to be helped
          </p>
          <br />
          <div className="container-input">
            <label>Email</label>
            <div className="div-input">
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={inputEmail}
                onChange={handleValue}
                required
                className="input-auth"
                title="Enter your email account"
              />
            </div>
            <label>Password</label>
            <div className="div-input">
              <input
                type={viewPassword}
                name="password"
                placeholder="Enter Password"
                value={inputPassword}
                onChange={handleValue}
                onKeyDown={(e) => { if (e.key === " ") e.preventDefault(); }}
                required
                className="input-auth"
                title="Enter your password"
              />
              <FontAwesomeIcon
                icon={eye}
                className="show-password-icon"
                onClick={() => {
                  setViewPassword(viewPassword === "password" ? "text" : "password");
                  setEye(viewPassword === "password" ? faEye : faEyeSlash);
                }}
              />
            </div>
            <div className="div-input div-submit">
              <button
                type="submit"
                disabled={!isValid || loading}
                style={{
                  opacity: !isValid || loading ? 0.5 : 1,
                  cursor: !isValid || loading ? "not-allowed" : "pointer",
                }}
                title="Click to login"
              >
                {loading ? "..." : "Login"}
              </button>
              <span onClick={() => navigate("/forgetpassword")} title="Click to reset your password">
                Forget Password
              </span>
            </div>
          </div>
          <p className="warm-welcome-p">
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")} style={{ color: "green", cursor: "pointer" }} title="Click to create an account">
              Create one
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
