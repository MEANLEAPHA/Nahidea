import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
const API_URL = import.meta.env.VITE_SERVER_URL; 


import "../style/Authentication/SignPage.css";
import nahIdeaAuth from "../img/nahIdeaAuth.png";
import nahideaTren from "../img/nahidea-tran.png"

export const VerifyEmail = () => {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  const email = localStorage.getItem("verifyEmail");

  const handleSubmit = async () => {
    if (!email){
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
      const res = await fetch(`${API_URL}/api/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin, email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Email verified!");

        setTimeout(() => {
          localStorage.removeItem("verifyEmail");
          navigate("/login");
        }, 1000);
      } else {
        switch (res.status) {
          case 400:
            toast.warning(data.message);
            break;
          case 401:
            toast.warning(data.message);
            break;
          case 402:
            toast.warning(data.message);
            break;
          case 403:
            toast.warning(data.message);
            break;
          case 405:
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

  const handleResendPin = async () => {
    if (!email){
       navigate("/verifyemail");
       return;
    };
    if (cooldown > 0) return;

    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/resend-verify-email-pin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
       
        res.status === 200 && toast.success(data.message);
        // ⏱ cooldown 1min
        setCooldown(60);
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
      if(res.status === 506){
        toast.error(data.message);
      }
      toast.error("Server error");
    }
    setLoading(false);
  };

  return (
    <div className="container-form">

      <div className='toast-feedback'>
        <ToastContainer position="top-right" autoClose={2000} />
      </div>

      <div className='logo-container'>
        <img src={nahideaTren}/>
        <p>Nahidea</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="form-center">
          <p className="p-page" style={{fontSize:"x-large", fontWeight:"bold"}}>
               Verify your email
              </p>

        <div className='container-input'>
           <div className="div-input">
              <input
                type="text"
                value={pin}
                maxLength={6}
                placeholder="Enter your verification code"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // only digits
                  setPin(value);
                }}
                className="input-auth"
              />
           </div>
         
        <div className="div-input div-submit">
              <button disabled={pin.length !== 6 || loading} type="submit">
            {loading ? "Verifying..." : "Verify"}
          </button>

            <p
              onClick={handleResendPin}
              disabled={cooldown > 0}
              style={{background:"none", color:"black", cursor:"pointer", fontSize:"small"}}
            >
              {cooldown > 0
                ? `Resend in ${cooldown}s`
                : "Resend PIN"}
            </p>
          </div>
        </div>
        </div>
      </form>
       <div className='container-image'>
              <div className='container-image-center'>
                <h1 className="not-mobile greeting">Design later</h1>
                <img src={nahIdeaAuth} className="auth-img" />
                <p className='logo-font'>Nahidea</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia laudantium consectetur quidem porro expedita perferendis maxime aperiam? Iusto dolorem sunt dolorum rem cumque quisquam a nesciunt perspiciatis, neque, obcaecati itaque.</p>
              </div>
            </div>
    </div>
  );
};