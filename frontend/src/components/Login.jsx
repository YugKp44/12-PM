import React from "react";
import "./Login.css"; // Assuming the CSS file is saved as Login.css

const Login = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google"; // Adjust backend auth endpoint
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Welcome Back!</h1>
      <button className="login-button" onClick={handleLogin}>
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
