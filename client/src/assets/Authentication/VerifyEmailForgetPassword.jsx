import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_SERVER_URL; 

export const VerifyEmailForgetPassword = () => {
  const navigate = useNavigate();

  const email = localStorage.getItem("resetEmail");

  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleSubmit = async () => {
    if (pin.length !== 6) {
      toast.warning("Please enter the 6-digit PIN");
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
        toast.success("PIN verified successfully");

        setTimeout(() => {
          navigate("/newpassword");
        }, 2000);

      } else {
        switch (res.status) {
          case 400:
            toast.warning(data.message);
            break;
          case 404:
            toast.warning(data.message);
            break;
          case 421:
            toast.warning(data.message);
            break;
          case 422:
            toast.warning(data.message);
            break;
          case 429:
            toast.warning(data.message);
            break;
          default:
            toast.warning("Something went wrong");
            break;
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again later.");
    };
    setLoading(false);
  };

  const handleResendPin = async () => {
    if (cooldown > 0) return;
    if(loading) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/resend-forget-password-pin`,
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

        res.status === 200 && toast.success(data.message);

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
        switch (res.status) {
          case 400:
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
      };
    } catch (err) {
      console.error(err);
      if(res.status === 506){
              toast.error(data.message);
            }
      toast.error("Server error. Please try again later.");
    };
    setLoading(false);
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