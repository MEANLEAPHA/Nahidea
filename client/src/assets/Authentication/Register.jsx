
// export default Register;
import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeLowVision, faEye } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_SERVER_URL; 

import "../style/Authentication/SignPage.css";
import nahIdeaAuth from "../img/nahIdeaAuth.png";
import nahideaTren from "../img/nahidea-tran.png"

const checks = {
  lower: /[a-z]/,
  upper: /[A-Z]/,
  number: /\d/,
  symbol: /[^A-Za-z\d]/,
  length: /^.{6,8}$/
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
      setEye(faEyeLowVision);
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
        }, 3000);
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

      <div className='logo-container'>
                      <img src={nahideaTren}/>
                      <p>Nahidea</p>
      </div>
      
      <form onSubmit={(e) => { e.preventDefault(); submitRegister(); }}>
        <div className="form-center">

          <p className="p-page">
            <span>Signup</span> |{" "}
            <span onClick={() => navigate("/login")}>Login</span>
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
              required
            />
          </div>
          <label>Email</label>
          <div className="div-input">
            <input
              type="email"
              name="email"
              value={inputEmail}
              onChange={handleValue}
              required
            />
            </div>
          <label>Password</label>
          <div className="div-input">
            <input
              type={viewPassword}
              name="password"
              value={inputPassword}
              onChange={handleValue}
              required
              // ref={passwordRef}
              onFocus={handleFocus}
              onBlur={handleBlur}
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
            <label>Confirm Password</label>
            <div className="div-input">
              <input
              type="password"
              name="confirmPassword"
              value={inputConfirmPassword}
              onChange={handleValue}
              required
              />
            </div>
            <div className="div-input div-submit">
            <span style={{display:"flex", alignItems:"center"}}> <input type="checkbox" required style={{width:"20px"}}/><u onClick={() => navigate('/forgetpassword')} style={{color:"black"}}>Agree to Term & Condition</u></span>
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
          </div>
          <p className="warm-welcome-p">
                Aleady have an account?{" "}
                <u onClick={() => navigate("/login")} style={{color:"green", cursor:"pointer"}}>Login</u>
              </p>
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

export default Register;