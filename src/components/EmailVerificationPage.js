import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "../api/axios";
import "../styles/register.scss";

const EmailVerification = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code) {
      return Swal.fire({
        icon: "error",
        title: "Missing Code",
        text: "Please enter the verification code sent to your email.",
      });
    }
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/verify-email", { code });

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
          <label htmlFor="verificationCode" className="login-form__label">
            Verification Code
          </label>
          <input
            type="text"
            id="verificationCode"
            maxLength="6"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            placeholder="Enter your code"
            className="login-form__input"
          />

          <div className="flex-col-center mt-4">
            <button
              type="submit"
              className="login__btn-cta"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
            <button
              onClick={() => {
                navigate("/login");
              }}
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
