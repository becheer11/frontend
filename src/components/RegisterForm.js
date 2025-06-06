import React from "react";
import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

import {
  faCheck,
  faTimes,
  faInfoCircle,
  faArrowLeftLong,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../api/axios";
import "../styles/register.scss";

// const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const RegisterForm = ({
  showInfluencerForm,
  showBrandForm,
  handleShowForms,
  role,
}) => {
  const navigate = useNavigate(); // to use the navigate hook

  // returns a mutable object whose .current is initialized to the passed argument
  const userRef = useRef();
  const errRef = useRef();
  // state for user input
  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);
  const [username, setUsername] = useState("");
  const[industry,setIndustry]=useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const[tiktokUsername,settiktokUsername]= useState("");
  const[instaUsername,setinstaUsername]= useState("");

  // state for password input
  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);
  // state for password confirmation
  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);
  //   state for  successful registration
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  // other user props

  const [company, setCompany] = useState("");

  // Form Pages
  const [showInfluencerPageOne, setShowInfluencerPageOne] = useState(true);
  const [showBrandPageOne, setShowBrandPageOne] = useState(true);
  const [showBrandPageTwo, setShowBrandPageTwo] = useState(true);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    setValidPwd(result);
    // password confirmation
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  //   Set Error Message
  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v2 = PWD_REGEX.test(pwd);
    if (!v2 || pwd !== matchPwd) {
      Swal.fire({
        icon: "error",
        title: "Invalid password",
        text: "Make sure it matches the requirements and confirmation.",
      });
      return;
    }
  
    try {
      const REGISTER_URL = `/api/auth/signup/${role}`;
      const payload = JSON.stringify({
        email: user,
        password: pwd,
        companyName: company,
        username:username,
        firstName:firstName,
        lastName:lastName,
        tiktokUsername: tiktokUsername,
        instaUsername: instaUsername,
      });
  
      const response = await axios.post(REGISTER_URL, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
  
      if (response.status === 200 || response.status === 201 || response.status==400) {
        Swal.fire({
          icon: 'success',
          title: 'Account Created!',
          text: 'A verification code has been sent to your email.',
          confirmButtonColor: '#1E90FF' // Change this to any HEX, RGB, or CSS color name
        })
        .then(() => {
          setUser("");
          setPwd("");
          setCompany("");
          setUsername("");
          setMatchPwd("");
          setSuccess(true);
        });
      }
    } catch (err) {
      console.error("Registration error:", err);
      let message = "Registration Failed";
      if (!err?.response) {
        message = "No Server Response";

      } else if (err.response?.status === 400) {

        message = err.response.data?.message || "Invalid data";
      }
  
      Swal.fire({
        icon: "error",
        title: "Registration Error",
        text: message,
      });
    }

  
  };
  return (
    <>
      {success ? (
        <section>
          <h1 className="register__title">Account Created!</h1>
          <p>
            please verify your mail to continue
          <button
              onClick={() => {
                navigate("/verify-email");
              }}
              className="register__btn-cta"
            >
              Verify email
            </button>
            <button
              onClick={() => {
                navigate("/login");
              }}
              className="register__btn-cta"
            >
              Sign In
            </button>
          </p>
        </section>
      ) : (
        <>
          {/* Influencer Sign Up Form */}
          {showInfluencerForm && !showBrandForm ? (
            <section className="landing__container-left">
              <p
                ref={errRef}
                className={errMsg ? "errmsg" : "offscreen"}
                aria-live="assertive"
              >
                {errMsg}
              </p>
              <div className="div-align-left">
                <button
                  onClick={(e) => {
                    handleShowForms(e, "reset");
                  }}
                  className="register__btn-back"
                >
                  <FontAwesomeIcon
                    icon={faArrowLeftLong}
                    className="icon-left"
                  />
                  Not an influencer?
                </button>
              </div>
              <h1 className="heading heading--medium">Welcome to the club!</h1>
              <p className="register__description">
                Just a few more steps to get access to thousands of social media
                campaigns with the top brands.
              </p>
              <h4 className="register__subheader">Create an Account</h4>
              {showInfluencerPageOne ? (
                <>
                  <form onSubmit={handleSubmit} className="register-form">
                    <label htmlFor="firstName" className="register-form__label">
                      First Name:
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      autoComplete="off"
                      onChange={(e) => {
                        setFirstName(e.target.value);
                      }}
                      required
                      placeholder="first name"
                      className="register-form__input"
                    />
                    
                    <label htmlFor="lastName" className="register-form__label">
                      Last Name:
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      autoComplete="off"
                      onChange={(e) => {
                        setLastName(e.target.value);
                      }}
                      required
                      placeholder="last name"
                      className="register-form__input"
                    />
                     <label htmlFor="instaUsername" className="register-form__label">
                      Instagram Username: 
                    </label>
                    <input
                      type="text"
                      id="instaUsername"
                      autoComplete="off"
                      onChange={(e) => {
                        setinstaUsername(e.target.value);
                      }}
                      required
                      placeholder="instaUsername"
                      className="register-form__input"
                    />
                     <label htmlFor="instaUsername" className="register-form__label">
                      Tiktok Username:
                    </label>
                    <input
                      type="text"
                      id="tiktokUsername"
                      autoComplete="off"
                      onChange={(e) => {
                        settiktokUsername(e.target.value);
                      }}
                      required
                      placeholder="tiktokUsername"
                      className="register-form__input"
                    />
                     <label htmlFor="username" className="register-form__label">
                    Username:
                  </label>
                  <input
                    type="text"
                    id="username"
                    autoComplete="off"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="username"
                    className="register-form__input"
                  />
                    <label htmlFor="username" className="register-form__label">
                      Email:
                    </label>
                    <input
                      type="email"
                      id="username"
                      ref={userRef}
                      autoComplete="off"
                      onChange={(e) => {
                        setUser(e.target.value);
                      }}
                      required
                      onFocus={() => setUserFocus(true)}
                      onBlur={() => setUserFocus(false)}
                      placeholder="email"
                      className="register-form__input"
                    />
                    <div className="register-form__label-row-container">
                      <label
                        htmlFor="password"
                        className="register-form__label"
                      >
                        Password:
                        <span className={validPwd ? "valid" : "hide"}>
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={validPwd || !pwd ? "hide" : "invalid"}>
                          <FontAwesomeIcon icon={faTimes} />
                        </span>
                      </label>
                    </div>

                    <input
                      type="password"
                      id="password"
                      onChange={(e) => {
                        setPwd(e.target.value);
                      }}
                      required
                      aria-invalid={validPwd ? "false" : "true"}
                      aria-describedby="pwdnote"
                      onFocus={() => setPwdFocus(true)}
                      onBlur={() => setPwdFocus(false)}
                      placeholder="password"
                      className="register-form__input register-form__input--password"
                    />
                    <p id="uidnote" className="register-form__instructions">
                      Use 8 or more characters with at least one upper case
                      letter, lower case letter, number, and special character.
                    </p>
                    <label
                      htmlFor="confirm_pwd"
                      className="register-form__label"
                    >
                      Confirm Password:
                      <span
                        className={validMatch && matchPwd ? "valid" : "hide"}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </span>
                      <span
                        className={validMatch || !matchPwd ? "hide" : "invalid"}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </span>
                    </label>
                    <input
                      type="password"
                      id="confirm_pwd"
                      onChange={(e) => setMatchPwd(e.target.value)}
                      required
                      aria-invalid={validMatch ? "false" : "true"}
                      aria-describedby="confirmnote"
                      onFocus={() => setMatchFocus(true)}
                      onBlur={() => setMatchFocus(false)}
                      placeholder="confirm password"
                      className={
                        validMatch || !matchPwd
                          ? "register-form__input"
                          : "register-form__input--invalid"
                      }
                    />

                    <div className="flex-col-center">
                      <button className="register__btn-cta">
                        Create New Account
                      </button>
                      <p className="register__text register__text--subtle">
                        Already have an account?{" "}
                        <Link
                          to="/login"
                          className="register__text register__text--subtle text--underline"
                        >
                          Log In Instead
                        </Link>
                      </p>
                    </div>
                  </form>
                </>
              ) : (
                ""
              )}
            </section>
          ) : (
            ""
          )}

          {/* Brand Sign Up Form */}

          {showBrandForm && !showInfluencerForm ? (
            <section className="landing__container-left">
              <p
                ref={errRef}
                className={errMsg ? "errmsg" : "offscreen"}
                aria-live="assertive"
              >
                {errMsg}
              </p>
              <div className="div-align-left">
                <button
                  onClick={(e) => {
                    handleShowForms(e, "reset");
                  }}
                  className="register__btn-back"
                >
                  <FontAwesomeIcon
                    icon={faArrowLeftLong}
                    className="icon-left"
                  />
                  Not a brand?
                </button>
              </div>
              <h1 className="heading heading--medium">Welcome to the club!</h1>
              <p className="register__description">
                Just a few more steps to get access to thousands of
                micro-influencers, perfect for your next campaign.
              </p>
              <h4 className="register__subheader">Create an Account</h4>
              {showInfluencerPageOne ? (
                <>
                  <form onSubmit={handleSubmit} className="register-form">
                    <div className="label-row-container label-row-container--justify-left">
                      <div className="label-row-container__col label-row-container__col--half">
                        <label
                          htmlFor="firstName"
                          className="register-form__label"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          autoComplete="off"
                          onChange={(e) => {
                            setFirstName(e.target.value);
                          }}
                          required
                          placeholder="first name"
                          className="register-form__input"
                        />
                      </div>
                      <div className="label-row-container__col label-row-container__col--half">
                        <label
                          htmlFor="lastName"
                          className="register-form__label"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          autoComplete="off"
                          onChange={(e) => {
                            setLastName(e.target.value);
                          }}
                          required
                          placeholder="last name"
                          className="register-form__input"
                        />
                      </div>
                    </div>
                    
                    <label htmlFor="username" className="register-form__label">
                    Username:
                  </label>
                  <input
                    type="text"
                    id="username"
                    autoComplete="off"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="username"
                    className="register-form__input"
                  />
                  <label htmlFor="instaUsername" className="register-form__label">
                      Instagram Username: 
                    </label>
                    <input
                      type="text"
                      id="instaUsername"
                      autoComplete="off"
                      onChange={(e) => {
                        setinstaUsername(e.target.value);
                      }}
                      required
                      placeholder="instaUsername"
                      className="register-form__input"
                    />
                     <label htmlFor="instaUsername" className="register-form__label">
                      Tiktok Username:
                    </label>
                    <input
                      type="text"
                      id="tiktokUsername"
                      autoComplete="off"
                      onChange={(e) => {
                        settiktokUsername(e.target.value);
                      }}
                      required
                      placeholder="tiktokUsername"
                      className="register-form__input"
                    />
                    <label htmlFor="username" className="register-form__label">
                      Email:
                    </label>
                    <input
                      type="email"
                      id="username"
                      ref={userRef}
                      autoComplete="off"
                      onChange={(e) => {
                        setUser(e.target.value);
                      }}
                      required
                      onFocus={() => setUserFocus(true)}
                      onBlur={() => setUserFocus(false)}
                      placeholder="email"
                      className="register-form__input"
                    />
                    <label htmlFor="company" className="register-form__label">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      autoComplete="off"
                      onChange={(e) => {
                        setCompany(e.target.value);
                      }}
                      required
                      placeholder="brand "
                      className="register-form__input"
                    />

                    <div className="register-form__label-row-container">
                      <label
                        htmlFor="password"
                        className="register-form__label"
                      >
                        Password:
                        <span className={validPwd ? "valid" : "hide"}>
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={validPwd || !pwd ? "hide" : "invalid"}>
                          <FontAwesomeIcon icon={faTimes} />
                        </span>
                      </label>
                    </div>

                    <input
                      type="password"
                      id="password"
                      onChange={(e) => {
                        setPwd(e.target.value);
                      }}
                      required
                      aria-invalid={validPwd ? "false" : "true"}
                      aria-describedby="pwdnote"
                      onFocus={() => setPwdFocus(true)}
                      onBlur={() => setPwdFocus(false)}
                      placeholder="password"
                      className="register-form__input register-form__input--password"
                    />
                    <p
                      id="uidnote"
                      className="register-form__instructions"
                      // className={
                      //   !validPwd
                      //     ? "register-form__instructions"
                      //     : "register-form__instructions--offscreen"
                      // }
                    >
                      Use 8 or more characters with at least one upper case
                      letter, lower case letter, number, and special character.
                    </p>
                    <label
                      htmlFor="confirm_pwd"
                      className="register-form__label"
                    >
                      Confirm Password:
                      <span
                        className={validMatch && matchPwd ? "valid" : "hide"}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </span>
                      <span
                        className={validMatch || !matchPwd ? "hide" : "invalid"}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </span>
                    </label>
                    <input
                      type="password"
                      id="confirm_pwd"
                      onChange={(e) => setMatchPwd(e.target.value)}
                      required
                      aria-invalid={validMatch ? "false" : "true"}
                      aria-describedby="confirmnote"
                      onFocus={() => setMatchFocus(true)}
                      onBlur={() => setMatchFocus(false)}
                      placeholder="confirm password"
                      className={
                        validMatch || !matchPwd
                          ? "register-form__input"
                          : "register-form__input--invalid"
                      }
                    />

                    <div className="flex-col-center">
                      <button className="register__btn-cta">
                        Create New Account
                      </button>
                      <p className="register__text register__text--subtle">
                        Already have an account?{" "}
                        <Link
                          to="/login"
                          className="register__text register__text--subtle text--underline"
                        >
                          Log In Instead
                        </Link>
                      </p>
                    </div>
                  </form>
                </>
              ) : (
                ""
              )}
            </section>
          ) : (
            ""
          )}
        </>
      )}
    </>
  );
};

export default RegisterForm;