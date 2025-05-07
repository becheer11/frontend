import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "../api/axios";
import "../styles/EmailVerification.scss";

const EmailVerification = () => {
  const [code, setCode] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputsRef = useRef([]);

  const handleChange = (element, index) => {
    const newCode = [...code];
    newCode[index] = element.value;
    setCode(newCode);

    if (element.value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join("");

    if (fullCode.length < 6) {
      return Swal.fire({
        icon: "error",
        title: "Incomplete Code",
        text: "Please enter all 6 digits of the verification code.",
      });
    }

    try {
      setLoading(true);
      await axios.post("/api/auth/verify-email", { code: fullCode });

      Swal.fire({
        icon: "success",
        title: "Email Verified",
        text: "Your email has been successfully verified. You can now login.",
        confirmButtonColor: "#1E90FF",
      }).then(() => navigate("/login"));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text:
          error.response?.data?.message ||
          "Invalid or expired verification code.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login">
      <div className="login__container-left">
        <h1 className="login__header">Verify Your Email</h1>
        <p className="login__description">
          Please enter the 6-digit code that was sent to your email.
        </p>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="otp-container">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                ref={(el) => (inputsRef.current[index] = el)}
                className="otp-input"
                required
              />
            ))}
          </div>

          <div className="flex-col-center mt-4">
            <button
              type="submit"
              className="login__btn-cta"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="login__btn-cta"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EmailVerification;
