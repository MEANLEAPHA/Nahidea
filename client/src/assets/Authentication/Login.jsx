// export default Login;
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeLowVision, faEye } from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/Authentication/SignPage.css";
import nahIdeaAuth from "../img/nahIdeaAuth.png";
import nahideaTren from "../img/nahidea-tran.png"

const API_URL = import.meta.env.VITE_SERVER_URL;  

const Login = () => {
  const navigate = useNavigate();

  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [viewPassword, setViewPassword] = useState("password");
  const [eye, setEye] = useState(faEyeLowVision);
  const [loading, setLoading] = useState(false);

  const handleValue = (e) => {
    const { name, value } = e.target;

    if (name === "email") setInputEmail(value);
    if (name === "password") setInputPassword(value);
  };

  // ✅ validation
  const isValid =
    inputEmail.trim() &&
    inputPassword &&
    inputPassword.length >= 6;

  const SubmitLogin = async () => {
    if (!isValid) return;

    if (loading) return; 
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inputEmail.trim(),
          password: inputPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {

        res.status === 200 && toast.success(data.message);
        localStorage.setItem("token", data.token);
        
        setTimeout(() => {
          navigate("/home");
        }, 1000);

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
                  case 404:
                    toast.warning(data.message);
                    break;
                  default:
                    toast.warning("Something went wrong");
          }
      }

    } catch (error) {
      console.error(error);
      toast.error("Server error, please try again later.");
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

        <form onSubmit={(e) => { e.preventDefault(); SubmitLogin(); }} >        
          <div className="form-center">

              <p className="p-page">
                <span>Login </span> | 
                <span onClick={() => navigate("/register")}>Sign up</span>
              </p>
              <br />
              <div className='container-input'>
                <label>Email</label>
                <div className="div-input">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
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
                    maxLength="8"
                    placeholder="Enter Password"
                    value={inputPassword}
                    onChange={handleValue}
                    onKeyDown={(e) => {
                      if (e.key === " ") {
                        e.preventDefault(); 
                      }
                    }}
                    required
                    className="input-auth"
                  />
                  <FontAwesomeIcon
                    icon={eye}
                    className="show-password-icon"
                    onClick={() => {
                      setViewPassword(viewPassword === "password" ? "text" : "password");
                      setEye(viewPassword === "password" ? faEye : faEyeLowVision);
                    }}
                  />
                </div>
                <div className="div-input div-submit">
                <button
                  type="submit"
                  disabled={!isValid || loading}
                  style={{
                    opacity: !isValid || loading ? 0.5 : 1,
                    cursor: !isValid || loading ? "not-allowed" : "pointer"
                  }}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
                <span onClick={() => navigate('/forgetpassword')}><u>Forget Password?</u></span>
              </div>
              </div>
              <p className="warm-welcome-p">
                Don't have an account?{" "}
                <u onClick={() => navigate("/register")} style={{color:"green", cursor:"pointer"}}>Create one</u>
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

export default Login;


