import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/login.scss";

const RESET_PASSWORD_URL = "/api/auth/reset-password/";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [validMatch, setValidMatch] = useState(false);

  useEffect(() => {
    const result = PWD_REGEX.test(password);
    setValidPwd(result);
    const match = password === confirmPassword;
    setValidMatch(match);
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validPwd) {
      setErrMsg("Password must contain one uppercase letter, one number, and one special character.");
      return;
    }
    if (!validMatch) {
      setErrMsg("Passwords do not match!");
      return;
    }
    try {
      const response = await axios.post(
        `${RESET_PASSWORD_URL}${token}`,
        JSON.stringify({ password }),
        { headers: { "Content-Type": "application/json" } }
      );

      if (response?.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Password reset successful",
          text: "You can now log in with your new password.",
        }).then(() => {
          navigate("/login");
        });
      } else {
        setErrMsg(response?.data?.message || "Password reset failed");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response?.data?.message || "Unknown error",
        });
      }
    } catch (err) {
      setErrMsg("Server error");
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
            <h1 className="login__header">Reset Password</h1>
            <p className="login__description mb-1p5 text--bold">
              Enter your new password
            </p>

            <form onSubmit={handleSubmit} className="login-form">
              <label htmlFor="password" className="login-form__label">
                New Password
              </label>
              <input
                type="password"
                id="password"
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter new password"
                className="login-form__input"
              />

              <label htmlFor="confirmPassword" className="login-form__label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                autoComplete="off"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
                className="login-form__input"
              />

              {errMsg && <p className="login__error">{errMsg}</p>}

              <div className="flex-col-center">
                <button
                  disabled={!validPwd || !validMatch}
                  type="submit"
                  className="login__btn-cta"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ResetPassword;
