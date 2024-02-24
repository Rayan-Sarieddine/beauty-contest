import React, { useState } from "react";
import { ReactComponent as EmailIcon } from "../../../assets/icons/envelope.svg";
import { ReactComponent as EyeIcon } from "../../../assets/icons/eye.svg";
import { ReactComponent as EyeSlashIcon } from "../../../assets/icons/eye-slash.svg";
import { useNavigate } from "react-router-dom";

import "./style.css";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(email, password);
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <section className="login">
      <div className="login-form-box">
        <div className="login-form-value">
          <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div className="login-inputbox">
              <input
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Email</label>
              <EmailIcon />
            </div>
            <div className="login-inputbox">
              <input
                type={showPassword ? "password" : "text"}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="login-password-input"
              />
              <label>Password</label>
              <button
                className="login-toggle-password"
                onClick={togglePasswordVisibility}
                type="button"
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>
            <div className="login-forget">
              <label>
                <button className="login-forget-btn">Forgot password?</button>
              </label>
            </div>
            <button type="submit" className="login-btn">
              Log in
            </button>
            <div className="login-register">
              <p>
                Don't have an account ?{" "}
                <button
                  className="login-register"
                  onClick={() => {
                    navigate("/signup");
                  }}
                >
                  Register
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
