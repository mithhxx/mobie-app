import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const [username, setuname] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "123") {
      navigate("/dashboard");
    } else {
      alert("Invalid login");
    }
  };

  return (
    <div className="login-bg">

      {/* 👁 LEFT EYE */}
      <div className="eye left"></div>

      {/* 👁 RIGHT EYE */}
      <div className="eye right"></div>

      {/* LOGIN CARD */}
      <div className="login-card">

        <h2>Login</h2>

        <form onSubmit={handleLogin}>

          <input
            type="text"
            placeholder="user"
            value={username}
            onChange={(e)=>setuname(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <div className="options">
            <label>
              <input type="checkbox"/> Remember me
            </label>
            <span>Forgot Password?</span>
          </div>

          <button type="submit">Login</button>

        </form>

        <p>Don't have an account? <span>Register</span></p>

      </div>

    </div>
  );
};

export default Login;