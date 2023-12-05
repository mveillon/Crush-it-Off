import React, { useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { createUserWithEmailAndPassword, getAuth  } from "firebase/auth";

import "./sign-up.css";
import "../../global.css";

function SignUp() {
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')

  const [invalid, setInvalid] = useState(false)

  const navigate = useNavigate()
  const createUser = () => {
    if (password1 !== password2) {
      setInvalid(true)
    } else {
      const auth = getAuth()
      createUserWithEmailAndPassword(
        auth, 
        email.toLowerCase(), 
        password1
      ).then(credential => {
        const user = credential.user
        localStorage.setItem("userID", user.uid)
        navigate(
          "/edit-profile",
          { state: {...location.state, email: user.email} }
        )
      })
    }
  }

  return (
    <div>
      <Header />
      <div className="content">
        <h1 className="title">Sign up to use Crushers</h1>

        <div className="sign-up">
          <div className="email-input">
            <label>Enter your email: 
              <input 
                type="text" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="email-box"
              />
            </label>

            <label>Enter your password:
              <input
                type="password"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                className="email-box"
              />
            </label>

            <label>Confirm password:
              <input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="email-box"
              />
            </label>

            <button onClick={createUser}>
              Sign Up
            </button>

            {
              invalid &&
              <p>Passwords don't match!</p>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp