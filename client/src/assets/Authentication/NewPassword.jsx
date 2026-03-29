import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeLowVision, faEye } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const API_URL = import.meta.env.VITE_SERVER_URL; 

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

    const [isUpperCase, setIsUpperCase] = useState("white");
   const [isLowerCase, setIsLowerCase] = useState("white");
   const [isNumber, setIsNumber] = useState("white");
   const [isSymbol, setIsSymbol] = useState("white");
   const [isLength, setIsLength] = useState("white");

  const email = localStorage.getItem("resetEmail");

   const calculateStrength = (value) => {
    let score = 0;
    if (checks.lower.test(value)){
      score++;
      setIsLowerCase("green");
    };
    if(!checks.lower.test(value)){
      setIsLowerCase("white");
    }
    if (checks.upper.test(value)){
      score++;
      setIsUpperCase("green");
    };
    if(!checks.upper.test(value)){
      setIsUpperCase("white");
    }
    if (checks.number.test(value)){
      score++;
      setIsNumber("green");
    };
    if(!checks.number.test(value)){
      setIsNumber("white");
    }
    if (checks.symbol.test(value)){
      score++;
      setIsSymbol("green");
    };
    if(!checks.symbol.test(value)){
      setIsSymbol("white");
    }
    if (checks.length.test(value)){
      score++;
      setIsLength("green");
    };
    if(!checks.length.test(value)){
      setIsLength("white");
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
        toast.success("Password reset successful");
        localStorage.removeItem("resetEmail");
        setTimeout(() => {
          navigate("/login");
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

  return (
    <div>
      <ToastContainer />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <h2>Set New Password</h2>

        <div>
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button disabled={!isValid || loading}>
          {loading ? "Saving..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};