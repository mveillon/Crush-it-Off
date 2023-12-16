import React, { FormEvent, useState } from "react";

import { useNavigate } from "react-router-dom";
import { 
  createUserWithEmailAndPassword, 
  getAuth
} from "firebase/auth";


import "./create-account.css";
import "../../global.css";

function CreateAccount(props: { state: any }) {
  const [email, setEmail] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  type errors = {
    badPassword: boolean,
    dupeEmail: boolean
  }
  const [allErrors, setAllErrors] = useState<errors>({
    badPassword: false,
    dupeEmail: false
  })

  const navigate = useNavigate()

  const createUser = (e: FormEvent) => {
    e.preventDefault()
    if (password1 !== password2 || password1.length < 6) {
      setAllErrors({
        badPassword: true,
        dupeEmail: false
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
          { state: {...props.state, email: user.email} }
        )
      }).catch(error => {
        console.log(error)
        setAllErrors({
          badPassword: false,
          dupeEmail: true,
        })
      })
    }
  }

  return (
    <div>
      <form className="email-input" onSubmit={createUser}>
        <h2>
          New to Crush if Off? Sign up: 
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
    </div>
  )
}

export default CreateAccount
