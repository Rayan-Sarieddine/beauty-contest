import { Route, Routes } from "react-router-dom";
import "./styles/index.css";
import Home from "./domain/pages/Home";
import Login from "./domain/pages/Login";
import SignUp from "./domain/pages/SignUp";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
