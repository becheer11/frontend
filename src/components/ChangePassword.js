import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../api/axios";
import "../styles/changepassword.scss"; // Import your existing styles

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/; // Regex for password validation
const CHANGE_PASSWORD_URL = "/api/auth/reset-password/"; // URL endpoint for password change

const ChangePassword = () => {
  const navigate = useNavigate(); // To use the navigate hook
  const { token } = useParams(); // Get the token from the URL params

  // Refs for focus management
  const pwdRef = useRef();
  const errRef = useRef();

  // State for new password input
  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  // State for password confirmation
  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  // State for error message and success status
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // Focus the new password input field when the component is mounted
  useEffect(() => {
    if (pwdRef.current) {
      pwdRef.current.focus();
    }
  }, []);

  // Validate password and password confirmation
  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  // Clear error messages when any of the fields change
  useEffect(() => {
    setErrMsg("");
  }, [pwd, matchPwd]);

  // Handle form submission
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

    // Prepare the payload with the new password and token from URL
    const payload = {
      newPwd: pwd,
      token: token, // Using token from URL params
    };

    try {
      // Send the request to change the password
      const response = await axios.post(CHANGE_PASSWORD_URL + token, payload, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        setSuccess(true);
        // Clear form fields
        setPwd("");
        setMatchPwd("");
      } else {
        setErrMsg(response?.data?.message || "Password change failed");
      }
    } catch (err) {
      // Handle errors
      if (!err?.response) {
        setErrMsg("No server response");
      } else if (err.response?.status === 400) {
        setErrMsg("Password error");
      } else {
        setErrMsg("Change password failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Your password was changed!</h1>
          <p>
            <button
              onClick={() => {
                navigate("/login");
              }}
            >
              Sign In
            </button>
          </p>
        </section>
      ) : (
        <section className="change-password">
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1 className="heading heading--large mb-1p5">Change Password</h1>
          <form onSubmit={handleSubmit} className="form">
            <label className="form__label" htmlFor="password">
              New Password:
              <span className={validPwd ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validPwd || !pwd ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              className="form__input"
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
              ref={pwdRef}
            />

            <label className="form__label" htmlFor="confirm_pwd">
              Confirm Password:
              <span className={validMatch && matchPwd ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              className="form__input"
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            {matchPwd ? (
              <p
                id="confirmnote"
                className={
                  matchFocus && !validMatch
                    ? "change-password__instructions"
                    : "change-password__instructions--ofscreen"
                }
              >
                {!validMatch ? "Confirmation password does not match." : ""}
              </p>
            ) : (
              ""
            )}

            <button
              className={
                pwd && validPwd && validMatch
                  ? "btn-cta btn-cta--active"
                  : "btn-cta btn-cta--inactive"
              }
              disabled={pwd && validPwd && validMatch ? false : true}
            >
              Change Password
            </button>
          </form>
        </section>
      )}
    </>
  );
};

export default ChangePassword;
