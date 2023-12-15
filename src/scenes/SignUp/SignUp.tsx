import React, { FormEvent, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { 
  createUserWithEmailAndPassword, 
  getAuth, 
  signInWithEmailAndPassword 
} from "firebase/auth";

import "./sign-up.css";
import "../../global.css";

function SignUp() {
  const location = useLocation()
  const {
    redirectBack,
    state
  } = location.state as { redirectBack: string, state?: any }

  const [email, setEmail] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')

  type errors = { 
    badPassword: boolean, 
    dupeEmail: boolean, 
    passMismatch: boolean 
  }
  const [allErrors, setAllErrors] = useState<errors>({
    badPassword: false,
    dupeEmail: false,
    passMismatch: false
  }) 

  const navigate = useNavigate()
  const createUser = (e: FormEvent) => {
    e.preventDefault()
    if (password1 !== password2 || password1.length < 6) {
      setAllErrors({
        badPassword: true,
        dupeEmail: false,
        passMismatch: false
      })
      setPassword2('')

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
      }).catch(error => {
        console.log(error)
        setAllErrors({
          badPassword: false,
          dupeEmail: true,
          passMismatch: false
        })
      })
    }
  }

  const loginUser = (e: FormEvent) => {
    e.preventDefault()
    const auth = getAuth()
    signInWithEmailAndPassword(
      auth,
      email.toLowerCase(),
      password1
    ).then(credential => {
      const user = credential.user
      localStorage.setItem("userID", user.uid)
      navigate(
        redirectBack,
        { state: state }
      )
    }).catch(error => {
      setAllErrors({
        badPassword: false,
        dupeEmail: false,
        passMismatch: true
      })
      setPassword1('')
      console.log(error.message)
    })
  }

  return (
    <div>
      <Header />
      <div className="content">
        <h1 className="title">Sign up to use Crushers</h1>

        <div className="sign-up">
          <form className="email-input" onSubmit={createUser}>
            <h2>
              New to Crushers? Sign up: 
            </h2>

            <label>Enter your email: 
              <input 
                type="email" 
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

            <input 
              type="submit" 
              value="Sign Up"
            />

            {
              allErrors.badPassword &&
              <p>
                Invalid password! Passwords must match and be at least 6 characters.
              </p>
            }
            {
              allErrors.dupeEmail &&
              <p>Email already in use!</p>
            }
          </form>

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
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
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
              allErrors.passMismatch &&
              <p>Email and password do not match!</p>
            }
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp