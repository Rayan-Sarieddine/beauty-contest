import React, { useState } from "react";
import { ReactComponent as EyeIcon } from "../../../assets/icons/eye.svg";
import { ReactComponent as EyeSlashIcon } from "../../../assets/icons/eye-slash.svg";
import { useNavigate } from "react-router-dom";

import "./style.css";
import { authDataSource } from "../../../core/dataSource/remoteDataSource/auth";
import CheckMark from "../../components/common/CheckMark";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(true);

  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const validatePassword = (value) => {
    const passwordRegExpression = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    if (!passwordRegExpression.test(value) && value) {
      setPasswordError(`- 8-20 characters long \n
- Include at least one uppercase letter \n
- Include at least one number`);
    } else {
      setPasswordError("");
    }
  };

  const validateConfirmPassword = (value) => {
    if (value !== password && value) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!password || !confirmPassword) {
      return;
    }

    let data = { password };
    try {
      await authDataSource.register(data);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleGoogleLogin = async () => {};
  return (
    <section className="reset">
      {!success ? (
        <div className="reset-form-box">
          <div className="reset-form-value">
            <form onSubmit={handleSubmit}>
              <h2>Reset Password</h2>

              <div className="reset-inputbox">
                <div className="input-container">
                  {" "}
                  <input
                    id="password"
                    type={showPassword ? "password" : "text"}
                    required
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validatePassword(e.target.value);
                    }}
                    className="signup-password-input"
                  />
                  <label htmlFor="password">Password</label>
                  <button
                    className="reset-toggle-password"
                    onClick={togglePasswordVisibility}
                    type="button"
                  >
                    {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                  </button>
                </div>
                {passwordError.split("\n").map((line, index) => (
                  <div key={index} className="error-line">
                    {line}
                  </div>
                ))}
              </div>
              <div className="reset-inputbox">
                <div className="input-container">
                  {" "}
                  <input
                    id="confirm-password"
                    type={showPassword ? "password" : "text"}
                    required
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      validateConfirmPassword(e.target.value);
                    }}
                    className="reset-password-input"
                  />
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <button
                    className="reset-toggle-password"
                    onClick={togglePasswordVisibility}
                    type="button"
                  >
                    {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                  </button>
                </div>
                {confirmPasswordError && (
                  <p className="error">{confirmPasswordError}</p>
                )}{" "}
              </div>

              <button type="submit" className="signup-btn">
                Reset
              </button>
              {error && <p className="error">{error}</p>}
            </form>
            <div className="reset-login">
              <p>
                Back To{" "}
                <button
                  className="reset-login-link"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <CheckMark message={"Successful"} />
      )}
    </section>
  );
};

export default ResetPassword;
