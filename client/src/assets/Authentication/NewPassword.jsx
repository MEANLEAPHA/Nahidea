import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeLowVision, faEye } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const API_URL = import.meta.env.VITE_SERVER_URL; 

import "../style/Authentication/SignPage.css";
import nahIdeaAuth from "../img/nahIdeaAuth.png";
import nahideaTren from "../img/nahidea-tran.png"

const checks = {
  lower: /[a-z]/,
  upper: /[A-Z]/,
  number: /\d/,
  symbol: /[^A-Za-z\d]/,
  length: /.{8,}/
};

export const NewPassword = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [loading, setLoading] = useState(false);

   const [showInstruction, setShowInstruction] = useState("none");

      const handleFocus = ()=>{
      setShowInstruction("block");
   }
   const handleBlur = () => {
  setShowInstruction("none");
};

  const [viewPassword, setViewPassword] = useState("password");
  const [eye, setEye] = useState(faEyeLowVision);

    const [isUpperCase, setIsUpperCase] = useState("grey");
    const [isLowerCase, setIsLowerCase] = useState("grey");
    const [isNumber, setIsNumber] = useState("grey");
    const [isSymbol, setIsSymbol] = useState("grey");
    const [isLength, setIsLength] = useState("grey");

  const email = localStorage.getItem("resetEmail");

    const calculateStrength = (value) => {
    let score = 0;
    if (checks.lower.test(value)){
      score++;
      setIsLowerCase("green");
    };
    if(!checks.lower.test(value)){
      setIsLowerCase("grey");
    }
    if (checks.upper.test(value)){
      score++;
      setIsUpperCase("green");
    };
    if(!checks.upper.test(value)){
      setIsUpperCase("grey");
    }
    if (checks.number.test(value)){
      score++;
      setIsNumber("green");
    };
    if(!checks.number.test(value)){
      setIsNumber("grey");
    }
    if (checks.symbol.test(value)){
      score++;
      setIsSymbol("green");
    };
    if(!checks.symbol.test(value)){
      setIsSymbol("grey");
    }
    if (checks.length.test(value)){
      score++;
      setIsLength("green");
    };
    if(!checks.length.test(value)){
      setIsLength("grey");
    }
    return score;
  };
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setStrength(calculateStrength(value));
  };

  const isValid =
    password &&
    confirmPassword &&
    password === confirmPassword &&
    strength >= 4;

  const handleSubmit = async () => {
    if (!isValid) return;
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/set-new-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          newPassword: password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        res.status === 200 && toast.success(data.message);
        localStorage.removeItem("resetEmail");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        switch (res.status) {
                  case 400:
                    toast.warning(data.message);
                    break;
                  case 401:
                    toast.warning(data.message);
                    break;
                  case 403:
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
               Set New Password
              </p>
             <div className='container-input'>
               <div className="div-input">
          <input
            type={viewPassword}
            placeholder="New Password"
            value={password}
            onChange={handlePasswordChange}
             onFocus={handleFocus}
              onBlur={handleBlur}
          />

          <FontAwesomeIcon
            icon={eye}
            className="show-password-icon"
            onClick={() => {
              setViewPassword(
                viewPassword === "password" ? "text" : "password"
              );
              setEye(
                viewPassword === "password"
                  ? faEye
                  : faEyeLowVision
              );
            }}
          />
        </div>

        {/* strength bar */}
        <div style={{ display: "flex", gap: "5px", marginTop: "8px" }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                height: "6px",
                flex: 1,
                 borderRadius: "4px",
                backgroundColor: strength >= i ? "green" : "#ddd",
              }}
            />
          ))}
        </div>
{/* Instruction */}

          <div className = 'password-instruction' style={{display:showInstruction}}>
            <p>Password must include:</p>
            <p style={{color:isUpperCase}}>Uppercase</p>
            <p style={{color:isLowerCase}}>Lowercase</p>
            <p style={{color:isNumber}}>Number</p>
            <p style={{color:isSymbol}}>Symbol</p>
            <p style={{color:isLength}}>Min 6 and Max 8</p>
          </div>
          <br />
         <div className="div-input">
          <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
         </div>
     
        <div className="div-input div-submit">
             <button disabled={!isValid || loading}>
          {loading ? "Saving..." : "Reset Password"}
        </button>
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