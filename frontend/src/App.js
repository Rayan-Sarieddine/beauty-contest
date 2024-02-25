import { Route, Routes } from "react-router-dom";
import "./styles/index.css";
import Home from "./domain/pages/Home";
import Login from "./domain/pages/Login";
import SignUp from "./domain/pages/SignUp";
import ForgetPassword from "./domain/pages/ForgetPassword";
import ResetPassword from "./domain/pages/ResetPassword";
import EmailVerified from "./domain/pages/EmailVerified";
import Admin from "./domain/pages/Admin";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/email-verified" element={<EmailVerified />} />
      </Routes>
    </div>
  );
}

export default App;
