import React, { useEffect, useState, useRef } from "react";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import loginImg from "../assets/login.png";
import "../styles/login.scss";
import Links from "./Links";

const LOGIN_URL = "/api/auth/login";

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { email, password };

    try {
      const response = await axios.post(LOGIN_URL, JSON.stringify(payload), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response?.data?.success) {
        const userData = response.data.user;

        // Clear local storage and set new user data
        localStorage.clear();
        localStorage.setItem("auth", JSON.stringify({
          user: userData.username,
          roles: userData.roles,
          email: userData.email
        }));

        // Update auth context
        setAuth({
          user: userData.username,
          roles: userData.roles,
          email: userData.email,
          accessToken: null,
        });

        setEmail("");
        setPassword("");
        navigate(from);
      } else {
        setErrMsg(response?.data?.message || "Login failed");
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No server response.");
      } else {
        setErrMsg(err.response?.data?.message || "Login failed");
      }
      errRef.current?.focus();
    }
  };

  return (
    <main className="app-outer">
      <div className="app-inner--narrow">
        <Links />
        <section className="login">
          <div className="login__container-left">
            <h1 className="login__header">Sign In</h1>
            <p className="login__description mb-1p5 text--bold">
              Enter your account details
            </p>

            <form onSubmit={handleSubmit} className="login-form">
              <label htmlFor="email" className="login-form__label">
                Email
              </label>
              <input
                ref={emailRef}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                autoComplete="off"
                value={email}
                required
                placeholder="example@email.com"
                className="login-form__input"
              />

              <label htmlFor="password" className="login-form__label mb-1">
                Password
              </label>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                id="password"
                required
                placeholder="password"
                className="login-form__input login-form__input--password"
              />

              <p id="uidnote" className="login-form__instructions">
                Forgot Password?
              </p>

              <div className="flex-col-center">
                {errMsg && (
                  <p ref={errRef} aria-live="assertive" className="login__error">
                    {errMsg}
                  </p>
                )}

                <button
                  disabled={!email || !password}
                  type="submit"
                  className="login__btn-cta"
                >
                  Sign In
                </button>

                <p className="register__text register__text--subtle">
                  New here?{" "}
                  <Link
                    to="/"
                    className="register__text register__text--subtle text--underline"
                  >
                    Sign Up instead
                  </Link>
                </p>
              </div>
            </form>
          </div>

          <img
            src={loginImg}
            alt="Black model in blue dress with arm raised"
            className="login__img-right"
          />
        </section>
      </div>
    </main>
  );
};

export default Login;