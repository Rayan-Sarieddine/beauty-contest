import React, { useEffect, useState } from "react";
import { ReactComponent as EmailIcon } from "../../../assets/icons/envelope.svg";
import { ReactComponent as EyeIcon } from "../../../assets/icons/eye.svg";
import { ReactComponent as EyeSlashIcon } from "../../../assets/icons/eye-slash.svg";
import { useNavigate } from "react-router-dom";
import { local } from "../../../core/helpers/localstorage";
import { useDispatch } from "react-redux";
import googleIcon from "../../../assets/logos/google-icon.png";

import "./style.css";
import { authDataSource } from "../../../core/dataSource/remoteDataSource/auth";
import { loggedIn } from "../../../core/dataSource/localDataSource/user";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = local("token");
    if (token) {
      navigate("/");
    }
  }, []);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      setError("All Fields are Required");
      return;
    }
    const emailRegExpression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegExpression.test(email)) {
      setError("Please Enter a Valid Email");
      setTimeout(() => setError(""), 4000);
      return;
    }
    const passwordRegExpression = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    if (!passwordRegExpression.test(password)) {
      setError("Please Enter your Valid Password");
      setTimeout(() => setError(""), 4000);
      return;
    }
    let data = { email, password };
    try {
      const response = await authDataSource.login(data);
      local("token", response.token);

      dispatch(
        loggedIn({
          email: response.user.email,
          user_id: response.user._id,
          fullName: response.user.name,
          userType: response.user.userType,
          image: response.user.image,
          token: response.token,
        })
      );

      navigate("/");
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleGoogleLogin = async () => {};
  return (
    <section className="login">
      <div className="login-form-box">
        <div className="login-form-value">
          <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div className="login-inputbox">
              <input
                id="email"
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email">Email</label>
              <EmailIcon />
            </div>
            <div className="login-inputbox">
              <input
                id="password"
                type={showPassword ? "password" : "text"}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="login-password-input"
              />
              <label htmlFor="password">Password</label>
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
                <button
                  className="login-forget-link"
                  onClick={() => {
                    navigate("/forget-password");
                  }}
                  type="button"
                >
                  Forgot password?
                </button>
              </label>
            </div>
            <button type="submit" className="login-btn">
              Log in
            </button>
            {error && <p className="error">{error}</p>}
            <div className="inputBox google-sign-in">
              <p>-------- or sign in with --------</p>
              <div className="google-button" onClick={handleGoogleLogin}>
                <img src={googleIcon} alt="google_logo" />
                <p>Google</p>
              </div>
            </div>
            <div className="login-register">
              <p>
                Don't have an account?{" "}
                <button
                  className="login-register-link"
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
