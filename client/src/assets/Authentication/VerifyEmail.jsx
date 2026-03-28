import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
const API_URL = import.meta.env.VITE_SERVER_URL; 

export const VerifyEmail = () => {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  const verifyEmail = localStorage.getItem("verifyEmail");

  const handleSubmit = async () => {
    if (!verifyEmail){
       navigate("/verifyemail");
       return;
    };
    if (pin.length !== 6) {
      toast.warning("Enter 6-digit PIN");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Email verified!");

        setTimeout(() => {
          localStorage.removeItem("verifyEmail");
          navigate("/login");
        }, 2500);
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
    if (!verifyEmail){
       navigate("/verifyemail");
       return;
    };
    if (cooldown > 0) return;

    try {
      const res = await fetch(`${API_URL}/resend-verify-email-pin`, {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("New PIN sent");

        // ⏱ cooldown 5min
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

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <h2>Verify your email</h2>

        <input
          type="text"
          value={pin}
          maxLength={6}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ""); // only digits
            setPin(value);
          }}
        />

        <button disabled={pin.length !== 6 || loading} type="submit">
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