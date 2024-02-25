import { useNavigate } from "react-router-dom";
import "./style.css";
import CheckMark from "../../components/common/CheckMark";

const EmailVerified = () => {
  const navigate = useNavigate();

  return (
    <section className="email-verified">
      <div>
        <CheckMark message={"Email Verified Successfully!"} />
        <div className="email-verified-login">
          <p>
            Back To{" "}
            <button
              className="email-verified-login-link"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default EmailVerified;
