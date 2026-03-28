import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_SERVER_URL; 

export const VerifyEmailForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(
    localStorage.getItem("resetEmail") || ""
  );
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleSubmit = async () => {
    if (pin.length !== 6) {
      toast.warning("Enter 6-digit PIN");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/api/verify-forget-password-pin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            pin,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("PIN verified");

        setTimeout(() => {
      
          navigate("/newpassword");
        }, 2000);
      } else {
        toast.error(data.message);
      }

    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }

    setLoading(false);
  };

  const handleResendPin = async () => {
    if (cooldown > 0) return;

    try {
      const res = await fetch(
        `${API_URL}/resend-forget-password-pin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("PIN sent");

        setCooldown(300);
        const interval = setInterval(() => {
          setCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

      } else {
        toast.error(data.message);
      }

    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <div>
      <ToastContainer />

      <h2>Verify your PIN</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          value={pin}
          maxLength={6}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setPin(value);
          }}
        />

        <button disabled={pin.length !== 6 || loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>

        <hr />

        <button
          type="button"
          onClick={handleResendPin}
          disabled={cooldown > 0}
        >
          {cooldown > 0
            ? `Resend in ${cooldown}s`
            : "Resend PIN"}
        </button>
      </form>
    </div>
  );
};