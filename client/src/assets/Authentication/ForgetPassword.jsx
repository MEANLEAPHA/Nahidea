import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_SERVER_URL; 

export const ForgetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = email.trim() !== "";

  const handleSubmit = async () => {
    if (!isValid) return;

    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/forget-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
       res.status === 200 && toast.success(data.message);
       localStorage.setItem("resetEmail", email);
        setTimeout(() => {
          navigate("/verifyemailforgetpassword");
        }, 2500);
      } else {
        switch (res.status) {
                  case 401:
                    toast.warning(data.message);
                    break;
                  case 404:
                    toast.warning(data.message);
                    break;
                  case 429:
                    toast.warning(data.message);
                    break;
                  default:
                    toast.warning("Something went wrong");
          }
      }

    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }

    setLoading(false);
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={2000} />

      <h2>Reset your password</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        <button
          type="submit"
          disabled={!isValid || loading}
          style={{
            opacity: !isValid || loading ? 0.5 : 1,
            cursor: !isValid || loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Sending..." : "Send PIN"}
        </button>
      </form>
    </div>
  );
};