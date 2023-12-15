import React, { useState, FormEvent } from "react";

import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import "./login.css";
import "../../global.css";

function Login(props: { redirectBack: string, state: any }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passMismatch, setPassMismatch] = useState(false)

  const navigate = useNavigate()

  const loginUser = (e: FormEvent) => {
    e.preventDefault()
    const auth = getAuth()
    signInWithEmailAndPassword(
      auth,
      email.toLowerCase(),
      password
    ).then(credential => {
      const user = credential.user
      localStorage.setItem("userID", user.uid)
      navigate(
        props.redirectBack,
        { state: props. state }
      )
    }).catch(error => {
      setPassMismatch(true)
      setPassword('')
      console.log(error.message)
    })
  }

  return (
    <div>
      <form className="email-input" onSubmit={loginUser}>
        <h2>Already have an account? Login:</h2>

        <label>Enter your email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="email-box"
          />
        </label>

        <label>Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="email-box"
          />
        </label>

        <Link to="/reset-password" className="link">
          Forgot your password?
        </Link>

        <input
          type="submit"
          value="Login"
        />

        {
          passMismatch &&
          <p>Email and password do not match!</p>
        }
      </form>
    </div>
  )
}

export default Login