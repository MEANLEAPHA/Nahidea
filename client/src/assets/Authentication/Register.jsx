
// export default Register;
import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_SERVER_URL; 

import "../style/Authentication/SignPage.css";

const checks = {
  lower: /[a-z]/,
  upper: /[A-Z]/,
  number: /\d/,
  symbol: /[!@#$%^&*()_\-+=\[\]{};:'",.<>?/|\\]/,
  length: /^.{6,8}$/
};

const Register = () => {
  const navigate = useNavigate();

  const [inputUsername, setInputUsername] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputConfirmPassword, setInputConfirmPassword] = useState("");

  const [viewPassword, setViewPassword] = useState("password");
  const [eye, setEye] = useState(faEyeSlash);

  const [strength, setStrength] = useState(0);
  const [loading, setLoading] = useState(false);

   const [showInstruction, setShowInstruction] = useState("none");

   const [isUpperCase, setIsUpperCase] = useState("grey");
   const [isLowerCase, setIsLowerCase] = useState("grey");
   const [isNumber, setIsNumber] = useState("grey");
   const [isSymbol, setIsSymbol] = useState("grey");
   const [isLength, setIsLength] = useState("grey");
  
   const handleFocus = ()=>{
      setShowInstruction("block");
   }
   const handleBlur = () => {
  setShowInstruction("none");
};

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
      setEye(faEyeSlash);
    }
  };

  const isValid =
    inputUsername.trim() &&
    inputEmail.trim() &&
    inputPassword &&
    inputConfirmPassword &&
    inputPassword === inputConfirmPassword &&
    strength >= 5;

  const submitRegister = async () => {
    if (!isValid) return;

    if (loading) return; // ✅ prevent spam

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/register`, {
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

      const data = await res.json();

      if (res.ok) {
        res.status === 200 && toast.success(data.message);
        localStorage.setItem("verifyEmail", data.email);
        setTimeout(() => {
          navigate("/verifyemail");
        }, 1000);
      } else {
        switch (res.status) {
                          case 400:
                            toast.warning(data.message);
                            break;
                          case 409:
                            toast.warning(data.message);
                            break;
                          default:
                            toast.warning("Something went wrong");
          }
      }
    } catch (error) {
      console.error(error);
      if (res.status === 506){
        toast.error(data.message);
      }
      toast.error("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="container-form">

      <div className='toast-feedback'>
          <ToastContainer position="top-right" autoClose={2000}/>
      </div>

   
      
      <form onSubmit={(e) => { e.preventDefault(); submitRegister(); }}>
        <div className="form-center">

         <p className="p-page">
                 Nahidea
              </p>
              <p className="p2-page">
                Strength grows when we care beyond ourselves <br/>Help others the way you’d want to be helped
              </p>
              <br />
         <div className='container-input'>
          <label>Username</label>
          <div className="div-input">
            <input
              type="text"
              name="username"
              value={inputUsername}
              onChange={handleValue}
              title="Enter your username"
              required
              className="input-auth"
            />
          </div>
          <label>Email</label>
          <div className="div-input">
            <input
              type="email"
              name="email"
              title="Enter your valid email address"
              value={inputEmail}
              onChange={handleValue}
              required
              className="input-auth"
            />
            </div>
          <label>Password</label>
          <div className="div-input">
            <input
              type={viewPassword}
              name="password"
              value={inputPassword}
              onChange={handleValue}
              title = "Enter hard password with instructions down below"
              required
              // ref={passwordRef}
              onFocus={handleFocus}
              onBlur={handleBlur}
              maxLength="8"
              onKeyDown={(e) => {
                if (e.key === " ") {
                  e.preventDefault(); 
                }
              }}
              className="input-auth"
            />
            <FontAwesomeIcon
              icon={eye}
              onMouseDown={(e) => {
                e.preventDefault(); // prevents input blur
                handleViewPassword();
              }}
              className="show-password-icon"
            />
          </div>
          

          {
            showInstruction !== "none" && 
            <>
            
          <div className = 'password-instruction' style={{display:showInstruction}}>
            <p tyle={{margin: '0px'}}>
            <b style={{marginBottom:'15px'}}>Password must contain: </b>

            </p>
            <p style={{margin: '0px'}}>
            <span style={{color:isUpperCase}}>Uppercase</span>
            <span>, </span>
            <span style={{color:isLowerCase}}>Lowercase</span>
            <span>, </span>
            <span style={{color:isNumber}}>Number</span>
            <span>, </span>
            <span style={{color:isSymbol}}>Symbol</span>
            <span>, </span>
            <span style={{color:isLength}}>Min 6 and Max 8 </span>
            </p>
          </div>
            <div style={{ display: "flex", gap: "5px", marginBottom: "20px", marginTop: "8px", width:"200px"}}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                style={{
                  height: "6px",
                  flex: 1,
                  backgroundColor: strength >= i ? "green" : "#dbdbdb",
                  border: "1px solid #4d4d4d",
                  borderRadius: "4px"
                }}
              />
            ))}
            
          </div>
          </>
          }  
            <label>Confirm Password</label>
            <div className="div-input">
              <input
              type="password"
              name="confirmPassword"
              maxLength="8"
              value={inputConfirmPassword}
              onChange={handleValue}
              required
              title = "Password must match"
              onKeyDown={(e) => {
                if (e.key === " ") {
                  e.preventDefault(); 
                }
              }}
              className="input-auth"
              />
            </div>
            <div className="div-input div-submit">
           <span style={{display:"flex", alignItems:"center"}}>
              <input type="checkbox" required style={{width:"20px"}} title="By clicking this, you are agree to term & condition"/>
              <a 
                href="/userAgreement" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{color:"black", textDecoration:"none"}}
                
              >
                Term & Condition
              </a>
            </span>

            <button
                type="submit"
                title="Create your account"
                disabled={!isValid || loading}
                style={{
                  opacity: !isValid || loading ? 0.5 : 1,
                  cursor: !isValid || loading ? "not-allowed" : "pointer"
                }}
              >
              {loading ? "..." : "Register"}
            </button>
          </div>
          </div>
          <p className="warm-welcome-p">
                Aleady have an account?{" "}
                <span onClick={() => navigate("/login")} style={{color:"green", cursor:"pointer"}} title='Click to login page'>Login</span>
          </p>
        </div>
      </form>
    
    </div>

  );
};

export default Register;