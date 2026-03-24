
// export default Register;
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeLowVision, faEye } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "../style/Authentication/SignPage.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://nahIdeaBackend.onrender.com/api";

const checks = {
  lower: /[a-z]/,
  upper: /[A-Z]/,
  number: /\d/,
  symbol: /[^A-Za-z\d]/,
  length: /^.{6,10}$/
};

const Register = () => {
  const navigate = useNavigate();

  const [inputUsername, setInputUsername] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputConfirmPassword, setInputConfirmPassword] = useState("");

  const [viewPassword, setViewPassword] = useState("password");
  const [eye, setEye] = useState(faEyeLowVision);

  const [strength, setStrength] = useState(0);
  const [loading, setLoading] = useState(false);

  const calculateStrength = (value) => {
    let score = 0;
    if (checks.lower.test(value)) score++;
    if (checks.upper.test(value)) score++;
    if (checks.number.test(value)) score++;
    if (checks.symbol.test(value)) score++;
    if (checks.length.test(value)) score++;
    return score;
  };

  const handleValue = (e) => {
    const { name, value } = e.target;

    if (name === "username") setInputUsername(value);
    if (name === "email") setInputEmail(value);

    if (name === "password") {
      setInputPassword(value);
      setStrength(calculateStrength(value)); // ✅ correct usage
    }

    if (name === "confirmPassword") {
      setInputConfirmPassword(value);
    }
  };

  const handleViewPassword = () => {
    if (viewPassword === "password") {
      setViewPassword("text");
      setEye(faEye);
    } else {
      setViewPassword("password");
      setEye(faEyeLowVision);
    }
  };

  const isValid =
    inputUsername.trim() &&
    inputEmail.trim() &&
    inputPassword &&
    inputConfirmPassword &&
    inputPassword === inputConfirmPassword &&
    strength >= 4;

  const submitRegister = async () => {
    if (!isValid) return;

    if (loading) return; // ✅ prevent spam

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: inputUsername.trim(),
          email: inputEmail.trim(),
          password: inputPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created! Redirecting...");

        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="container-form">
      <ToastContainer position="top-right" autoClose={2000} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitRegister();
        }}
      >
        <div className="form-center">

          <p className="p-page">
            <span>Signup</span> |{" "}
            <span onClick={() => navigate("/login")}>Login</span>
          </p>

          <p className="warm-welcome-p">Create your account</p>

          <label>Username</label>
          <input
            type="text"
            name="username"
            value={inputUsername}
            onChange={handleValue}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={inputEmail}
            onChange={handleValue}
            required
          />

          <label>Password</label>
          <div className="div-input">
            <input
              type={viewPassword}
              name="password"
              value={inputPassword}
              onChange={handleValue}
              required
            />
            <FontAwesomeIcon
              icon={eye}
              onClick={handleViewPassword}
              className="show-password-icon"
            />
          </div>

          {/* ✅ Strength bars */}
          <div style={{ display: "flex", gap: "5px", marginTop: "8px", width:"200px"}}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                style={{
                  height: "6px",
                  flex: 1,
                  backgroundColor: strength >= i ? "green" : "#dbdbdb",
                  borderRadius: "4px"
                }}
              />
            ))}
          </div>

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={inputConfirmPassword}
            onChange={handleValue}
            required
          />

          <button
            type="submit"
            disabled={!isValid || loading}
            style={{
              opacity: !isValid || loading ? 0.5 : 1,
              cursor: !isValid || loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Creating..." : "Register"}
          </button>

        </div>
      </form>
    </div>
  );
};

export default Register;