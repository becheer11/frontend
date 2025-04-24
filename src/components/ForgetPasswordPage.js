import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const FORGOT_PASSWORD_URL = "/api/auth/forgot-password";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        FORGOT_PASSWORD_URL,
        JSON.stringify({ email }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response?.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Check your inbox",
          text: "A password reset link has been sent to your email.",
        }).then(() => {
          setEmail(""); // Clear the form after success
          navigate("/login");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to send reset email",
          text: response?.data?.message || "Unknown error",
        });
      }
    } catch (err) {
      setErrMsg("No server response or network error.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <main className="app-outer">
      <div className="app-inner--narrow">
        <section className="login">
          <div className="login__container-left">
            <h1 className="login__header">Forgot Password</h1>
            <p className="login__description mb-1p5 text--bold">
              Enter your email to receive a password reset link
            </p>

            <form onSubmit={handleSubmit} className="login-form">
              <label htmlFor="email" className="login-form__label">
                Email
              </label>
              <input
                type="email"
                id="email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@email.com"
                className="login-form__input"
              />

              {errMsg && <p className="login__error">{errMsg}</p>}

              <div className="flex-col-center">
                <button
                  disabled={!email}
                  type="submit"
                  className="login__btn-cta"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ForgotPassword;
