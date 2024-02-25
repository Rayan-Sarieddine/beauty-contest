import React, { useEffect, useState } from "react";
import { ReactComponent as EmailIcon } from "../../../assets/icons/envelope.svg";
import { useNavigate } from "react-router-dom";
import { local } from "../../../core/helpers/localstorage";

import "./style.css";
import { authDataSource } from "../../../core/dataSource/remoteDataSource/auth";
import CheckMark from "../../components/common/CheckMark";

const ForgetPassword = () => {
  const [email, setEmail] = React.useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = local("token");
    if (token) {
      navigate("/");
    }
  }, []);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) {
      setError("All Fields are Required");
      return;
    }
    const emailRegExpression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegExpression.test(email)) {
      setError("Please Enter a Valid Email");
      setTimeout(() => setError(""), 4000);
      return;
    }
    let data = { email };
    try {
      await authDataSource.login(data);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <section className="forget">
      {!success ? (
        <div className="forget-form-box">
          <div className="forget-form-value">
            <form onSubmit={handleSubmit}>
              <h2>Forget Password</h2>
              <div className="forget-inputbox">
                <input
                  id="email"
                  type="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="email">Enter Your Email</label>
                <EmailIcon />
              </div>

              <button type="submit" className="forget-btn">
                Send Reset Email
              </button>
              {error && <p className="error">{error}</p>}
              <div className="forget-login">
                <p>
                  Back To{" "}
                  <button
                    className="forget-login-link"
                    onClick={() => {
                      navigate("/signup");
                    }}
                  >
                    Login
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <CheckMark message={"Email Sent"} />
      )}
    </section>
  );
};

export default ForgetPassword;
